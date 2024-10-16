// Node modules
import { merge } from "d3-array";

// Helpers
import config from "~/helpers/api-config";
import { handleXHR, fetchData, transformResponse } from "~/helpers/utilities";
import {
  OBSERVED,
  OBSERVED_FILTER_YEAR,
  PRIORITY_10_MODELS,
  ENSEMBLES,
} from "../_common/constants";
import { DEFAULT_EMISSION_SCENARIO, CLIMATE_VARIABLES_VIC } from "./_constants";
import { buildEnvelope, convertAnnualRateToSum } from "../_common/helpers";

const { apiEndpoint } = config.env.production;

const getEnsembleStr = ({ climvarId, periodId }) => {
  const datasetId = CLIMATE_VARIABLES_VIC.includes(climvarId) ? "vic" : "loca";
  if (
    periodId === "wateryear" ||
    (periodId === "year" && datasetId === "vic")
  ) {
    return `${periodId}_${datasetId}`;
  } else {
    return periodId;
  }
};

const getObservedStr = ({ climvarId, seriesId }) => {
  const datasetId = CLIMATE_VARIABLES_VIC.includes(climvarId) ? "vic" : "loca";
  if (datasetId === "vic" && seriesId === "livneh") {
    return `${seriesId}_${datasetId}`;
  } else {
    return seriesId;
  }
};

/**
 * The following 3 functions take the list of observed, models and ensemble
 * raster series and add extra props. These props describe how the data
 * should be fetched from the API or how the data is shown in the charts.
 * List of extra props:
 * slugs - list of raster series names in API
 * mark - describes how the timeseries will be displayed in the chart (line/area)
 * visible - controls whether line/area in chart is hidden/shown
 *      when user clicks on corresponding legend key. Note: The stats component
 *      also uses this prop to include/remove series from summary calculations
 * @param {object} config
 * @return {array}
 */

// The observed data is usually a single raster series, so only 1 slug
const getObservedSeries = ({ climvarId }) => {
  return OBSERVED.map((d) => {
    const slugpart = getObservedStr({ climvarId, seriesId: d.id });
    const slugs = [`${climvarId}_day_${slugpart}`];
    return { ...d, slugs, mark: "line", visible: true };
  });
};

// For each model, there are usually 2 raster series in the API,
// the modeled historical (1950-2005) and modeled projections (2006-2099/2021)
const getModelSeries = ({ climvarId, scenarioId, modelIds }) => {
  return PRIORITY_10_MODELS.filter((d) => modelIds.includes(d.id)).map((d) => {
    const slugs = [
      `${climvarId}_day_drought_${d.id}_${DEFAULT_EMISSION_SCENARIO}_${scenarioId}`,
    ];
    return { ...d, slugs, mark: "line", visible: true };
  });
};

// The ensemble has to be assembled from the max and min of 10/all models
// Similar to the models, the models-max and models-min are 2 raster series each
const getEnsembleSeries = ({ climvarId, periodId }) => {
  return ENSEMBLES.filter(
    (d) => d.id === `${DEFAULT_EMISSION_SCENARIO}_range`
  ).map((d) => {
    const slugpart = getEnsembleStr({ climvarId, periodId });
    const slugs = [
      `${climvarId}_${slugpart}_models-min_${DEFAULT_EMISSION_SCENARIO}`,
      `${climvarId}_${slugpart}_models-max_${DEFAULT_EMISSION_SCENARIO}`,
    ];
    return { ...d, slugs, mark: "area", visible: true };
  });
};

/**
 * Fetches data from the events endpoint in Cal-Adapt API
 * Input parameters:
 * slug - name of raster series in API
 * params - object with props for geometry, stat, units, etc.
 * method - default is GET, POST used for user uploaded boundaries
 * @param {object}
 * @return {array}
 */
const fetchEvents = async ({ slug, params, method = "GET" }) => {
  const url = `${apiEndpoint}/series/${slug}/events/`;
  const [response, error] = await handleXHR(fetchData(url, params, method));
  if (error) {
    throw new Error(error.message);
  }
  return transformResponse(response);
};

/**
 * Fetches data for a single observed/model/ensemble series
 * Each series can have 1 or more slugs
 * @param {object} series - a distinct timeseries obj
 * @param {object} params - props for for geometry, stat, units, etc.
 * @param {string} method - default is GET, POST for uploaded boundaries
 * @return {array}
 */
const fetchSeries = async ({ series, params, method = "GET", isRate }) => {
  try {
    const { slugs } = series;
    const promises = slugs.map((slug) => fetchEvents({ slug, params, method }));
    const responses = await Promise.all(promises);
    const mergedResponses = merge(responses);
    const values = mergedResponses.map((d) => {
      // Reset date to start of year so x axis year ticks & values align in charts
      if ("mean" in d) {
        return {
          date: new Date(Date.UTC(d.date.getUTCFullYear(), 0, 1)),
          value: isRate
            ? convertAnnualRateToSum({ date: d.date, value: d.mean })
            : d.mean,
        };
      } else {
        return {
          date: new Date(Date.UTC(d.date.getUTCFullYear(), 0, 1)),
          value: isRate ? convertAnnualRateToSum(d) : d.value,
        };
      }
    });
    // Filter out livneh data before 2006 which as QA issues
    if (series.id === "livneh") {
      return {
        ...series,
        values: values.filter(
          (d) => d.date.getUTCFullYear() < OBSERVED_FILTER_YEAR
        ),
      };
    }
    return { ...series, values };
  } catch (error) {
    throw new Error(`${series.id}: ${error.message}`);
  }
};

/**
 * The following 3 functions get observed, models and ensemble data
 * params - obj with props for geometry, stat, units, etc.
 * method - default is GET, POST used for user uploaded boundaries
 * @param {object} config - props for climate variable/indicator, scenario, models, etc.
 * @param {object} params - props for for geometry, stat, units, etc.
 * @param {string} method - default is GET, POST for uploaded boundaries
 * @return {array}
 */

export async function getObserved(
  config,
  params,
  method = "GET",
  isRate = false
) {
  try {
    const seriesList = getObservedSeries(config);
    const promises = seriesList.map((series) =>
      fetchSeries({ series, params, method, isRate })
    );
    const data = await Promise.all(promises);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getModels(
  config,
  params,
  method = "GET",
  isRate = false
) {
  try {
    const seriesList = getModelSeries(config);
    const promises = seriesList.map((series) =>
      fetchSeries({ series, params, method, isRate })
    );
    const data = await Promise.all(promises);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getEnsemble(
  config,
  params,
  method = "GET",
  isRate = false
) {
  try {
    const seriesList = getEnsembleSeries(config);
    const { freq, ...ensembleParams } = params;
    const promises = seriesList.map((series) =>
      fetchSeries({ series, params: ensembleParams, method, isRate })
    );
    const data = await Promise.all(promises);
    return data.map((series) => {
      return { ...series, values: buildEnvelope(series.values) };
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Creates the param object used to fetch data from API
 * @param {object} location
 * @param {object} boundary - obj representing a mapbox layer
 * @param {boolean} imperial - represents units
 * @return {object} params
 * @return {string} method
 */
export function getQueryParams({ location, boundary, imperial = true }) {
  const params = { imperial };
  let method;
  switch (boundary.id) {
    case "locagrid":
      params.g = `Point(${location.center[0]} ${location.center[1]})`;
      method = "GET";
      return { params, method };
    case "custom":
      params.g = JSON.stringify(location.geometry);
      params.stat = "mean";
      method = "POST";
      return { params, method };
    default:
      params.ref = `/api/${boundary.id}/${location.id}/`;
      params.stat = "mean";
      method = "GET";
      return { params, method };
  }
}

// Node modules
import { merge, rollups, sum, mean, cumsum } from "d3-array";
import getCenter from "@turf/center";
import { format } from "d3-format";

// Helpers
import config from "~/helpers/api-config";
import { handleXHR, fetchData, parseDateIso } from "~/helpers/utilities";
import { OBSERVED, PRIORITY_10_MODELS } from "../_common/constants";
import { DEFAULT_WATERYEAR } from "./_constants";

const { apiEndpoint } = config.env.production;

const transformResponse = function (response, throwNoData = true) {
  if (!response) {
    if (throwNoData) {
      throw new Error("No data for this location");
    } else {
      return [];
    }
  }
  return response.results.map((d) => {
    const date = parseDateIso(d.time);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    let wateryear;
    if (month >= 9) {
      wateryear = year + 1;
    } else {
      wateryear = year;
    }
    return { ...d, date, wateryear };
  });
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
const getObservedSeries = ({ climvarId, stationId }) => {
  return OBSERVED.map((d) => {
    const slugs = [`${climvarId}_observed_monthly_${stationId}`];
    return { ...d, slugs, mark: "line", visible: true };
  });
};

// For each model, there are usually 2 raster series in the API,
// the modeled historical (1950-2005) and modeled projections (2006-2099/2021)
const getModelSeries = ({ climvarId, scenarioId, modelIds, stationId }) => {
  return PRIORITY_10_MODELS.filter((d) => modelIds.includes(d.id)).map((d) => {
    const slugs = [`${climvarId}_monthly_${d.id}_${scenarioId}_${stationId}`];
    return { ...d, slugs, mark: "line", visible: true };
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
  const url = `${apiEndpoint}/tseries/${slug}/events/`;
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
const fetchSeries = async ({ series, params, method = "GET", monthIds }) => {
  try {
    const { slugs } = series;
    const promises = slugs.map((slug) => fetchEvents({ slug, params, method }));
    const responses = await Promise.all(promises);
    const values = merge(responses);
    // For livneh, remove data values after 2006
    // because there are QA/QC issues with the data
    if (series.id === "livneh") {
      const filteredValues = values
        .filter((d) => d.date.getUTCFullYear() <= 2006)
        .map((d) => {
          return {
            ...d,
            value: (d.value * 1000) / 60.3707,
          };
        });
      return {
        ...series,
        values: filteredValues,
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

export async function getObserved(config, params, method = "GET") {
  try {
    const seriesList = getObservedSeries(config);
    const promises = seriesList.map((series) =>
      fetchSeries({ series, params, method })
    );
    const data = await Promise.all(promises);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getModels(config, params, method = "GET") {
  try {
    const seriesList = getModelSeries(config);
    const promises = seriesList.map((series) =>
      fetchSeries({ series, params, method })
    );
    const data = await Promise.all(promises);
    return data;
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
export function getQueryParams() {
  const params = { pagesize: 1812 };
  return { params, method: "GET" };
}

export function getBasinCenter(feature) {
  const { geometry } = getCenter(feature.geometry);
  return { ...feature, geometry };
}

export const filterDataByMonths = (data, monthIds) => {
  return data.map((series) => {
    const filteredValues = series.values.filter(({ date }) =>
      monthIds.includes(+date.getUTCMonth())
    );
    return { ...series, values: filteredValues };
  });
};

export const sumMonthlyDataByWaterYear = (data) => {
  return data.map((series) => {
    const aggregatedValues = rollups(
      series.values,
      (arr) => +format(".0f")(sum(arr, (d) => d.value)),
      (dd) => dd.wateryear
    ).map(([year, value]) => ({ date: new Date(Date.UTC(year)), value }));
    return { ...series, values: aggregatedValues };
  });
};

export const averageMonthlyDataByPeriod = (data) => {
  return data.map((series) => {
    const aggregatedValues = rollups(
      series.values,
      (arr) => +format(".0f")(mean(arr, (d) => d.value)),
      (dd) => dd.date.getUTCMonth()
    ).map(([month, value]) => {
      if (+month >= 9) {
        return { date: new Date(DEFAULT_WATERYEAR - 1, month, 1), value };
      } else {
        return { date: new Date(DEFAULT_WATERYEAR, month, 1), value };
      }
    });
    return { ...series, values: aggregatedValues };
  });
};

export const filterDataByPeriod = (data, start, end) => {
  return data.map((series) => {
    const filteredValues = series.values.filter(
      ({ wateryear }) => wateryear >= start && wateryear <= end
    );
    return { ...series, values: filteredValues };
  });
};

export const calculateRunoffMidPoint = (data) => {
  return data.map((series) => {
    const { id, label, values } = series;
    if (!values.length) {
      return {
        id,
        label,
        date: null,
        value: null,
      };
    }
    const cumulativeRunoff = cumsum(values, (d) => d.value);
    const totalRunoff = sum(values, (d) => d.value);
    const midpoint = cumulativeRunoff.findIndex((d) => d >= totalRunoff / 2);
    return {
      id,
      label,
      date: values[midpoint].date,
      value: cumulativeRunoff[midpoint],
    };
  });
};

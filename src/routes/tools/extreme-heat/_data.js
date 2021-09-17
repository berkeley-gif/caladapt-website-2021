// Node modules
import { merge, rollup, range, max, sum } from "d3-array";
import { timeFormat } from "d3-time-format";

// Helpers
import config from "~/helpers/api-config";
import {
  handleXHR,
  fetchData,
  transformResponse,
  serialize,
  groupConsecutiveDates,
} from "~/helpers/utilities";
import { OBSERVED, PRIORITY_10_MODELS } from "../_common/constants";

const { apiEndpoint } = config.env.production;
const dayNumberFormat = timeFormat("%j");

// Helper function to calculate day number
// Day number is used for plotting Timing of Days indicator
const calcDayNumber = (values) => {
  return values.map((d) => {
    return { ...d, day: +dayNumberFormat(d.date) };
  });
};

/**
 * The following 2 functions take the list of observed and models
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
    const slugs = [`${climvarId}_day_${d.id}`];
    return { ...d, slugs, mark: "line", visible: true };
  });
};

// For each model, there are usually 2 raster series in the API,
// the modeled historical (1950-2005) and modeled projections (2006-2099/2021)
const getModelSeries = ({ climvarId, scenarioId, modelIds }) => {
  return PRIORITY_10_MODELS.filter((d) => modelIds.includes(d.id)).map((d) => {
    const slugs = [
      `${climvarId}_day_${d.id}_historical`,
      `${climvarId}_day_${d.id}_${scenarioId}`,
    ];
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
  const url = `${apiEndpoint}/series/${slug}/events/`;
  const [response, error] = await handleXHR(fetchData(url, params, method));
  if (error) {
    throw new Error(error.message);
  }
  return calcDayNumber(transformResponse(response));
};

/**
 * Fetches data for a single observed/model series
 * Each series can have 1 or more slugs
 * @param {object} series - a distinct timeseries obj
 * @param {object} params - props for for geometry, stat, units, etc.
 * @param {string} method - default is GET, POST for uploaded boundaries
 * @return {array}
 */
const fetchSeries = async ({ series, params, method = "GET" }) => {
  try {
    const { slugs } = series;
    const promises = slugs.map((slug) => fetchEvents({ slug, params, method }));
    const responses = await Promise.all(promises);
    const values = merge(responses);
    if (!values.length) {
      throw new Error(`${series.id}: No Data`);
    }
    // For livneh, remove data values after 2006
    // because there are QA/QC issues with the data
    if (series.id === "livneh") {
      return {
        ...series,
        values: values.filter((d) => d.date.getFullYear() <= 2006),
      };
    }
    return { ...series, values };
  } catch (error) {
    throw new Error(`${series.id}: ${error.message}`);
  }
};

/**
 * The following 2 functions get observed and model data
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
export function getQueryParams({
  location,
  boundary,
  imperial = true,
  thresh,
}) {
  const params = { imperial, thresh };
  let method;
  switch (boundary.id) {
    case "locagrid":
      params.g = `Point(${location.center[0]} ${location.center[1]})`;
      method = "GET";
      return { params, method };
    case "ca":
      params.ref = "/media/ca.json";
      params.stat = "mean";
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

/**
 * Gets the 98th percentile threshold value from API
 * @param {object} location
 * @param {object} boundary - obj representing a mapbox layer
 * @param {boolean} imperial - represents units
 * @return {object} params
 * @return {string} method
 */
export async function get98pThreshold(climvarId, params) {
  try {
    const { thresh, ...rest } = params;
    const url = `${apiEndpoint}/series/${climvarId}_day_livneh/exheat/?${serialize(
      rest
    )}`;
    const data = await fetch(url);
    const json = await data.json();
    const thresh98p = +json["98p"].toFixed(1);
    return thresh98p;
  } catch (error) {
    throw new Error(`Default Threshold: ${error.message}`);
  }
}

// Functions for reformatting data for different chart views
export const groupDataByYear = (series) => {
  let yearRange;
  if (series.id === "livneh") {
    yearRange = range(1950, 2007);
  } else {
    yearRange = range(1950, 2100);
  }
  const daysPerYear = rollup(
    series.values,
    (v) => v,
    (d) => d.date.getFullYear()
  );
  const values = [];
  yearRange.forEach((year) => {
    if (daysPerYear.has(year)) {
      const days = daysPerYear.get(year);
      values.push({ date: new Date(year, 0, 1), days });
    } else {
      values.push({ date: new Date(year, 0, 1), days: [] });
    }
  });
  return {
    ...series,
    values,
  };
};

export const calcDaysCount = (series) => {
  return {
    ...series,
    values: series.values.map((d) => ({ date: d.date, value: d.days.length })),
  };
};

// Functions for reformatting data for different chart views
export const calcMaxDuration = (series) => {
  return {
    ...series,
    values: series.values.map((d) => {
      const groupedDates = groupConsecutiveDates(d.days);
      const groupLengths = groupedDates.map((arr) => arr.length);
      const duration = max(groupLengths);
      return { date: d.date, value: duration };
    }),
  };
};

export const calcHeatwaveCount = (series, duration) => {
  return {
    ...series,
    values: series.values.map((d) => {
      const groupedDates = groupConsecutiveDates(d.days);
      const groupCounts = groupedDates.map((arr) =>
        Math.floor(arr.length / duration)
      );
      const count = sum(groupCounts);
      return { date: d.date, value: count };
    }),
  };
};

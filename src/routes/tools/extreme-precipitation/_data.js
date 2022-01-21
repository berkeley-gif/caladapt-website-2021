// Node modules
import { merge, rollup, range, max, sum } from "d3-array";
import { timeFormat, timeParse } from "d3-time-format";

// Helpers
import config from "~/helpers/api-config";
import {
  handleXHR,
  fetchData,
  transformResponse,
  serialize,
  groupConsecutiveDates,
} from "~/helpers/utilities";
import {
  OBSERVED,
  PRIORITY_10_MODELS,
  OBSERVED_FILTER_YEAR,
  DEFAULT_STAT_PERIODS,
} from "../_common/constants";
import {
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_POLYGON_AGGREGATE_FUNCTION,
} from "./_constants";

const { apiEndpoint } = config.env.production;
const dayNumberFormat = timeFormat("%j");
const dateParse = timeParse("%Y-%m-%d");
const dateFormat = timeFormat("%b %Y");

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

// For each model, there are usually 2 raster series in the API,
// the modeled historical (1950-2005) and modeled projections (2006-2099/2021)
const getModelPotSeries = ({ climvarId, scenarioId, modelIds }) => {
  return PRIORITY_10_MODELS.filter((d) => modelIds.includes(d.id)).map((d) => {
    return {
      ...d,
      slug: `${climvarId}_day_${d.id}_${scenarioId}`,
      mark: "line",
      visible: true,
    };
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
 * Fetches data from the pot endpoint in Cal-Adapt API
 *
 * The "pot" endpoint is used to get return levels of a climate variable for a particular combination
 * of GCM + percentile + event duration using the Peak Over Threshold statistical method.
 *
 * If there is no "pct" (percentile) in the params, the default threshold value returned is the Lowest
 * Annual Maximum value from the observed data.
 *
 * Input parameters:
 * slug - name of raster series in API
 * params -  { location, boundary, imperial, duration, intervals, pct }
 * method - default is GET, POST used for user uploaded boundaries
 * @param {object}
 * @return {array}
 */
const fetchPot = async ({ series, params, method = "GET" }) => {
  const { slug } = series;
  const url = `${apiEndpoint}/series/${slug}/pot/`;
  const model = "";
  const [response, error] = await handleXHR(fetchData(url, params, method));
  if (error) {
    throw new Error(error.message);
  }
  const { returnlevels } = response;
  return returnlevels.map((d) => {
    const { begin, end, n, levels, threshold } = d;
    const { period, lowerci, upperci, value } = levels[0];
    const beginDate = dateParse(begin);
    const endDate = dateParse(end);
    const timestep = `${dateFormat(beginDate)} – ${dateFormat(endDate)}`;
    const timePeriod = DEFAULT_STAT_PERIODS.find(({ start, end }) => {
      return (
        start >= beginDate.getUTCFullYear() && end <= endDate.getUTCFullYear()
      );
    });
    return {
      ...series,
      begin: beginDate,
      end: endDate,
      groupLabel: `${timestep} | ${timePeriod.label.split(" ")[0]}`,
      interval: +period,
      ci_lower: +lowerci,
      ci_upper: +upperci,
      value: +value,
      n,
    };
  });
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
    // For livneh, remove data values after 2006
    // because there are QA/QC issues with the data
    if (series.id === "livneh") {
      return {
        ...series,
        values: values.filter(
          (d) => d.date.getUTCFullYear() <= OBSERVED_FILTER_YEAR
        ),
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

export async function getIntensityData(config, params, method = "GET") {
  try {
    const seriesList = getModelPotSeries(config);
    const promises = seriesList.map((series) =>
      fetchPot({ series, params, method })
    );
    const seriesData = await Promise.all(promises);
    const data = merge(seriesData);

    // each of the model responses from the API contains historical data
    // extract one of them to create a new observed series
    const observedSeries = OBSERVED.find(({ id }) => id === "livneh");
    const observedData = {
      ...data.find((d) => d.groupLabel.includes("Baseline")),
      ...observedSeries,
      label: "Observed",
      mark: "line",
      visible: true,
    };
    return [
      observedData,
      ...data.filter((d) => !d.groupLabel.includes("Baseline")),
    ];
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Creates the param object used to fetch data from API
 * @param {object} location
 * @param {object} boundary - a mapbox layer
 * @param {boolean} imperial - default true
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
    case "ca":
      params.ref = "/media/ca.json";
      params.stat = DEFAULT_POLYGON_AGGREGATE_FUNCTION;
      method = "GET";
      return { params, method };
    case "custom":
      params.g = JSON.stringify(location.geometry);
      params.stat = DEFAULT_POLYGON_AGGREGATE_FUNCTION;
      method = "POST";
      return { params, method };
    default:
      params.ref = `/api/${boundary.id}/${location.id}/`;
      params.stat = DEFAULT_POLYGON_AGGREGATE_FUNCTION;
      method = "GET";
      return { params, method };
  }
}

/**
 * Get the threshold value from API
 *
 * The "pot" endpoint is used to get return levels of a climate variable for a particular combination
 * of GCM + percentile + event duration using the Peak Over Threshold statistical method.
 *
 * The threshold value used to calculate these return levels is returned as part of the
 * response from the API. There is no separate endpoint to return just the threshold value.
 *
 * The threshold is determined by values from the observed historical data
 * (for now only the livneh data is used) and does not depend on the GCM or scenario.
 *
 * The param "intervals" is passed so the API response contains return levels only for 1 return period and
 * not multiple which is the default. Threshold value is same for all intervals.
 *
 * If there is no "pct" (percentile) in the params, the default threshold value returned is the Lowest
 * Annual Maximum value from the observed data.
 *
 * @param {object} climvar
 * @param {object} params - { location, boundary, imperial, duration, intervals, pct }
 * @return {number}
 */

export async function getThreshold(params) {
  try {
    const url = `${apiEndpoint}/series/${DEFAULT_CLIMATE_VARIABLE}_day_HadGEM2-ES_rcp85/pot/?${serialize(
      params
    )}`;
    const data = await fetch(url);
    const json = await data.json();
    return +json["returnlevels"][0]["threshold"];
  } catch (error) {
    throw new Error(`Default Threshold: ${error.message}`);
  }
}

/**
 * The following 4 functions transform the data for different extreme heat indicators
 * @param {array} series
 * @return {array}
 */

// Group daily data by year
// Backfill data for missing years with empty array
export const groupEventsByWaterYear = (series) => {
  let yearRange;
  if (series.id === "livneh") {
    yearRange = range(1950, 2006);
  } else {
    yearRange = range(1950, 2100);
  }
  const data = series.values.map((d) => {
    const month = parseInt(d.date.getUTCMonth());
    const year = parseInt(d.date.getUTCFullYear());
    let wateryear;
    if (month >= 9) {
      wateryear = year + 1;
    } else {
      wateryear = year;
    }
    return { ...d, wateryear };
  });
  const daysPerYear = rollup(
    data,
    (v) => v,
    (d) => d.wateryear
  );
  const values = [];
  yearRange.forEach((year) => {
    if (daysPerYear.has(year)) {
      // Array of all dates in a year
      const days = daysPerYear.get(year);
      // Array of arrays of consecutive dates
      const groups = groupConsecutiveDates(days);
      values.push({ date: new Date(Date.UTC(year, 0, 1)), days, groups });
    } else {
      values.push({
        date: new Date(Date.UTC(year, 0, 1)),
        days: [],
        groups: [],
      });
    }
  });
  return {
    ...series,
    values,
  };
};

// Calculate number of extreme precipitation events for each water year
export const calcEventsCount = (series) => {
  return {
    ...series,
    values: series.values.map(({ date, days }) => ({
      date,
      value: days.length,
    })),
  };
};

// From arrays of consecutive dates, calculate longest group for each year
export const calcMaxDuration = (series) => {
  return {
    ...series,
    values: series.values.map(({ date, groups }) => {
      const groupLengths = groups.map((arr) => arr.length);
      return { date, value: max(groupLengths) || 0 };
    }),
  };
};

// From arrays of consecutive dates, calculate number of extreme precipitation events for each year
// Length of extreme precipitation event = duration
export const calcHeatwaveCount = (series, duration) => {
  return {
    ...series,
    values: series.values.map(({ date, groups }) => {
      const groupCounts = groups.map((arr) =>
        Math.floor(arr.length / duration)
      );
      return { date, value: sum(groupCounts) };
    }),
  };
};

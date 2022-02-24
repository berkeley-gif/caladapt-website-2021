// Node modules
import { merge, rollups, sum, mean, cumsum } from "d3-array";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

// Helpers
import config from "~/helpers/api-config";
import {
  handleXHR,
  fetchData,
  parseDateIso,
  getWaterYear,
} from "~/helpers/utilities";
import { OBSERVED, PRIORITY_10_MODELS } from "../_common/constants";
import { DEFAULT_WATERYEAR, NUM_OF_RECORDS } from "./_constants";

const { apiEndpoint } = config.env.production;
const monthFormat = timeFormat("%b");

/**
 * Tranform API response to an array of objects by water year

 * @param {object} response - json object
 * @return {array} values
 */
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
    return { ...d, date, wateryear: getWaterYear(date) };
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
  const params = { pagesize: NUM_OF_RECORDS };
  return { params, method: "GET" };
}

/**
 * The streamflow data request is returned from the API as monthly timeseries spanning 151 years for
 * GCMS (1950-2100) and 95 years for Observed (1921-2005).
 * Both indicators (Total Annual for selected months) & (Monthly Average for selected period) are
 * calculated by filtering and aggregating the monthly timeseries in different ways. New data is fetched
 * from the API only if the user changes the location, scenario or list of models.
 * The following functions are used to perform the filtering and aggregation of the monthly timeseries.
 **/

/**
 * Filter a monthly timeseries by month indexes
 * @param {array} data
 * @param {array} monthIds
 * @return {array}
 */
export const filterDataByMonths = (data, monthIds) => {
  return data.map((series) => {
    const filteredValues = series.values.filter(({ date }) =>
      monthIds.includes(+date.getUTCMonth())
    );
    return { ...series, values: filteredValues };
  });
};

/**
 * Group a monthly timeseries by water year, calculate sum of all months for each wateryear
 * @param {array} data
 * @return {array}
 */
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

/**
 * Filter a monthly timeseries by range of water years
 * @param {array} data
 * @param {number} start water year
 * @param {number} end water year
 * @return {array}
 */
export const filterDataByPeriod = (data, start, end) => {
  return data.map((series) => {
    const filteredValues = series.values.filter(
      ({ wateryear }) => wateryear >= start && wateryear <= end
    );
    return { ...series, values: filteredValues };
  });
};

/** A "water year" is defined as the 12-month period October 1, for any given year
 * through September 30, of the following year. For the Monthly Averages data
 * presented in the streamflow tool, after filtering data for time period of interest,
 * the data is aggregated by month. The
 **/

/**
 * Group a monthly timeseries by month, calculate average of all water years for each month.
 * DEFAULT_WATERYEAR is used to create dates for the monthly data so the months
 * can be plotted with the LineArea chart component which uses d3's scaleTime() to
 * create the x-axis.
 * @param {array} data
 * @return {array}
 */
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

/**
 * Calculate Runoff Midpoint for each timeseries. The runoff midpoint is the point in
 * time by which half of the total water that runs off in a given year has done so.
 * This value is used in the Stat Panel for Monthly Average Streamflow indicator.
 * @param {array} data
 * @return {array}
 */
export const calculateRunoffMidPoint = (data) => {
  return data.map((series) => {
    const { id, label, values } = series;
    if (!values.length) {
      return {
        id,
        label: `${label}<br/>No Data`,
        value: null,
      };
    }
    const cumulativeRunoff = cumsum(values, (d) => d.value);
    const totalRunoff = sum(values, (d) => d.value);
    const midpoint = cumulativeRunoff.findIndex((d) => d >= totalRunoff / 2);
    const midpointDate = values[midpoint].date;
    const newLabel = `${label}<br/>${monthFormat(midpointDate)}`;
    return {
      id,
      label: newLabel,
      value: cumulativeRunoff[midpoint],
    };
  });
};

/**
 * Format data for export to csv
 * @param {array}
 * @return {array}
 */
export function formatMonthlyDataForExport(_arr) {
  return _arr.map((item) => {
    const row = {};
    row.month = monthFormat(item.date);
    item.values.forEach((d) => {
      row[d.label] = d.value;
    });
    return row;
  });
}

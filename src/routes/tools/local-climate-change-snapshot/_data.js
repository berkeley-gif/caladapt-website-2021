import { group, merge, mean } from "d3-array";

// Helpers
import config from "~/helpers/api-config";
import { handleXHR, fetchData, transformResponse } from "~/helpers/utilities";
import { buildEnvelope, convertAnnualRateToSum } from "../_common/helpers";

// Constants
import {
  OBSERVED_FILTER_YEAR,
  DEFAULT_STAT_PERIODS,
} from "../_common/constants";
import {
  DEFAULT_PROJECTIONS_SLUG_EXP,
  DEFAULT_OBSERVED_SLUG_EXP,
  DEFAULT_POLYGON_AGGREGATE_FUNCTION,
  ENVELOPE_SEARCH_EXP,
  AVERAGE_SEARCH_EXP,
  OBSERVED,
  SERIES,
  RANGES,
} from "./_constants";

const { apiEndpoint } = config.env.production;

/**
 * Fetches a list of series for an indicator from Cal-Adapt API that match the regex
 * @param {string} exp - regex string
 * @return {array} list of urls
 */
const fetchUrls = async (exp) => {
  const [response, error] = await handleXHR(
    fetchData(`${apiEndpoint}/series/`, { slug_re: exp })
  );
  if (error) {
    throw new Error(error.message);
  }
  return response.results.map((d) => d.url);
};

/**
 * Fetches data from the events endpoint in Cal-Adapt API
 * Input parameters:
 * url - url of raster series in API
 * params - object with props for geometry, stat, units, etc.
 * method - default is GET, POST used for user uploaded boundaries
 * isAnnualRate - boolean value that indicates if indicator should be converted from annual rate to annual total
 * @param {object}
 * @return {array}
 */
const fetchEvents = async ({
  url,
  params,
  method = "GET",
  isAnnualRate = true,
}) => {
  const [response, error] = await handleXHR(
    fetchData(`${url}events/`, params, method)
  );
  if (error) {
    throw new Error(error.message);
  }
  // Add slug to keep track of which timeseries the data comes from
  const slug = url.split("series/")[1];
  const values = isAnnualRate
    ? transformResponse(response).map((d) => ({
        date: d.date,
        value: convertAnnualRateToSum(d),
      }))
    : transformResponse(response);
  // For livneh, remove data values after 2006
  // because there are QA/QC issues with the data
  if (slug.includes("livneh")) {
    return {
      slug,
      values: values.filter(
        (d) => d.date.getUTCFullYear() < OBSERVED_FILTER_YEAR
      ),
    };
  }
  return { slug, values };
};

/**
 * Filter data to find timseries that correspond to ensemble avg
 * Add additional props (e.g. id, color, label, type)
 * @param {array} - array of all timeseries
 * @return {array} - average timeseries for 3 scenarios (historical, rcp45, rcp85)
 */
const createAverages = (_data) => {
  const avgData = _data.filter(
    ({ slug }) => slug.search(AVERAGE_SEARCH_EXP) > 0
  );
  return avgData.map(({ slug, values }) => {
    const props = SERIES.find(({ id }) => slug.includes(id));
    return { ...props, type: "line", values };
  });
};

/**
 * Filter data to find timseries that correspond to ensemble min & max
 * Add additional props (e.g. id, color, label, type)
 * Group the ensemble min & max timeseries by id
 * Create a new ensemble timeseries for envelope
 * @param {array} - array of all timeseries
 * @return {array} - ensemble timeseries with min & max values for 3 scenarios (historical, rcp45, rcp85)
 */
const createRanges = (_data) => {
  const rangeData = _data
    .filter(({ slug }) => slug.search(ENVELOPE_SEARCH_EXP) > 0)
    .map(({ slug, values }) => {
      // id in the RANGES array are in the form "[scenario]_range". The slug
      // only has [scenario] part. So use only part of the id to search
      const props = RANGES.find(({ id }) => slug.includes(id.split("_")[0]));
      return { ...props, type: "area", values };
    });
  // Group the ensemble min & max for each scenario
  const groupByIds = Array.from(group(rangeData, (d) => d.id));
  return groupByIds.map(([groupId, _arrays]) => {
    const values = merge(_arrays.map(({ values }) => values));
    const envelope = buildEnvelope(values);
    // return props common to both ensemble min & max (id, label, color, type)
    // and a new values array
    return {
      ..._arrays[0],
      values: envelope,
    };
  });
};

/**
 * Get observed data for chart
 * @param {object} config - props describing climate indicator.
 * @param {object} params - props for for geometry, stat, units, etc.
 * @param {string} method - default is GET, POST for uploaded boundaries
 * @return {array}
 */
export async function getObserved(
  config,
  params,
  method = "GET",
  searchStr = DEFAULT_OBSERVED_SLUG_EXP
) {
  try {
    const { indicatorId, isAnnualRate } = config;
    const exp = searchStr.replace("indicator", indicatorId);
    const urls = await fetchUrls(exp);
    const promises = urls.map((url) =>
      fetchEvents({ url, params, isAnnualRate })
    );
    const data = await Promise.all(promises);
    return data.map(({ slug, values }) => {
      // Add additional props for timeseries (e.g. id, color, label, type)
      const props = OBSERVED.find(({ id }) => slug.includes(id));
      return { ...props, type: "line", values };
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get projected data for chart
 * @param {object} config - props describing climate indicator.
 * @param {object} params - props for for geometry, stat, units, etc.
 * @param {string} method - default is GET, POST for uploaded boundaries
 * @return {array}
 */
export async function getProjections(
  config,
  params,
  method = "GET",
  searchStr = DEFAULT_PROJECTIONS_SLUG_EXP
) {
  try {
    const { indicatorId, isAnnualRate } = config;
    const exp = searchStr.replace("indicator", indicatorId);
    const urls = await fetchUrls(exp);
    const promises = urls.map((url) =>
      fetchEvents({ url, params, isAnnualRate })
    );
    const data = await Promise.all(promises);
    const ranges = createRanges(data);
    const averages = createAverages(data);
    return [...averages, ...ranges];
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
  stat,
  months,
}) {
  // months param is only used for April SWE
  const params = { imperial, stat, ...(months && { months }) };
  let method = "GET";
  switch (boundary.id) {
    case "locagrid":
      params.g = `Point(${location.center[0]} ${location.center[1]})`;
      delete params.stat;
      break;
    case "custom":
      params.g = JSON.stringify(location.geometry);
      method = "POST";
      break;
    default:
      params.ref = `/api/${boundary.id}/${location.id}/`;
  }
  return { params, method };
}

/**
 * Calculate 30 year average for each scenario & period combination
 * @param {array} scenarios
 * @param {array} periods
 * @return {array} series & period combinations that have a valid 30 year avg value
 */
export function calc30yAvgByPeriod(scenarios, periods = DEFAULT_STAT_PERIODS) {
  const data = scenarios.map((d) => {
    const { values, id: scenarioId, label: scenarioLabel } = d;
    const dataByPeriods = periods.map((period) => {
      const { id: periodId, label: periodLabel, start, end } = period;
      const filteredValues = values.filter(
        ({ date }) =>
          date.getUTCFullYear() >= start && date.getUTCFullYear() <= end
      );
      let avg = null;
      if (filteredValues.length) {
        avg = mean(filteredValues, (d) => d.value);
      }
      return { periodId, periodLabel, scenarioId, scenarioLabel, avg };
    });
    return [...dataByPeriods];
  });
  return merge(data).filter(({ avg }) => avg);
}

/**
 * Map 30 year extent for each scenario & period combination
 * @param {array} series
 * @param {array} periods
 * @return {array} series & period combination that have a valid 30 year extent
 */
export function map30yExtentByPeriod(
  scenarios,
  periods = DEFAULT_STAT_PERIODS
) {
  const data = scenarios.map((d) => {
    const { values, id: scenarioId, label: scenarioLabel } = d;
    const dataByPeriods = periods.map((period) => {
      const { id: periodId, label: periodLabel, start, end } = period;
      const filteredValues = values.filter(
        ({ date }) =>
          date.getUTCFullYear() >= start && date.getUTCFullYear() <= end
      );
      let min = null;
      let max = null;
      if (filteredValues.length && filteredValues.length === 1) {
        min = filteredValues[0].min;
        max = filteredValues[0].max;
      }
      return { periodId, periodLabel, scenarioId, scenarioLabel, min, max };
    });
    return [...dataByPeriods];
  });
  return merge(data).filter(({ min, max }) => min && max);
}

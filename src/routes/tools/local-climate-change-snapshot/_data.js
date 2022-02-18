import { group, merge } from "d3-array";

// Helpers
import config from "~/helpers/api-config";
import { handleXHR, fetchData, transformResponse } from "~/helpers/utilities";
import { buildEnvelope, convertAnnualRateToSum } from "../_common/helpers";

// Constants
import { OBSERVED_FILTER_YEAR } from "../_common/constants";
import {
  DEFAULT_PROJECTIONS_SLUG_EXP,
  DEFAULT_OBSERVED_SLUG_EXP,
  DEFAULT_POLYGON_AGGREGATE_FUNCTION,
  ENVELOPE_SEARCH_EXP,
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
 * Identify ensemble min & max series, these will be used to calculate the envelope/range
 * Input parameters:
 * url - url of raster series in API
 * name - describes the series. It is used later to separate out avg/min/max for a scenario
 * params - object with props for geometry, stat, units, etc.
 * method - default is GET, POST used for user uploaded boundaries
 * @param {object}
 * @return {array}
 */
const fetchEvents = async ({
  url,
  name,
  params,
  method = "GET",
  isRate = false,
}) => {
  const [response, error] = await handleXHR(
    fetchData(`${url}events/`, params, method)
  );
  if (error) {
    throw new Error(error.message);
  }
  const values = isRate
    ? transformResponse(response).map((d) => ({
        date: d.date,
        value: convertAnnualRateToSum(d),
      }))
    : transformResponse(response);
  const isRange = url.search(ENVELOPE_SEARCH_EXP) > 0 ? true : false;
  // For livneh, remove data values after 2006
  // because there are QA/QC issues with the data
  if (name === "livneh") {
    return {
      name,
      isRange,
      values: values.filter(
        (d) => d.date.getUTCFullYear() < OBSERVED_FILTER_YEAR
      ),
    };
  }
  return { name, isRange, values };
};

/**
 * Add additional props for series (e.g. color, label, type)
 * @param {array} - one min series & one max series for each scenario
 * @return {array} - one series for each scenario with min & max values
 */
const createAverages = (_data) => {
  return _data.map(({ name, values }) => {
    const props = SERIES.find(({ id }) => name === id);
    return { ...props, type: "line", values };
  });
};

/**
 * Group the ensemble min & max timeseries by name (corresponds to scenario in this case)
 * Create a new single series with type "area" for each scenario using min & max values
 * Add additional props for series (e.g. color, label, type)
 * @param {array} - one min series & one max series for each scenario
 * @return {array} - one series for each scenario with min & max values
 */
const createRanges = (_data) => {
  const groupByScenarios = Array.from(group(_data, (d) => d.name));
  return groupByScenarios.map(([name, _arrays]) => {
    const values = merge(_arrays.map(({ values }) => values));
    const envelope = buildEnvelope(values);
    const props = RANGES.find(({ id }) => id.includes(name));
    return {
      ...props,
      type: "area",
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
export async function getObserved(config, params, method = "GET") {
  try {
    const { indicatorId, isRate } = config;
    const exp = DEFAULT_OBSERVED_SLUG_EXP.replace("indicator", indicatorId);
    const urls = await fetchUrls(exp);
    const promises = urls.map((url) => {
      const { id } = OBSERVED.find(({ id }) => url.includes(id));
      return fetchEvents({ url, name: id, params, isRate });
    });
    const data = await Promise.all(promises);
    return data.map(({ name, values }) => {
      // Add additional props for observed (e.g. color, label, type)
      const props = OBSERVED.find(({ id }) => id === name);
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
export async function getProjections(config, params, method = "GET") {
  try {
    const { indicatorId, isRate } = config;
    const exp = DEFAULT_PROJECTIONS_SLUG_EXP.replace("indicator", indicatorId);
    const urls = await fetchUrls(exp);
    const promises = urls.map((url) => {
      const { id } = SERIES.find(({ id }) => url.includes(id));
      return fetchEvents({ url, name: id, params, isRate });
    });
    const data = await Promise.all(promises);
    const ranges = createRanges(data.filter(({ isRange }) => isRange));
    const averages = createAverages(data.filter(({ isRange }) => !isRange));
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
export function getQueryParams({ location, boundary, imperial = true, stat }) {
  const params = { imperial, stat };
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

// Helpers
import config from "~/helpers/api-config";
import { handleXHR, fetchData, transformResponse } from "~/helpers/utilities";
import { buildEnvelope, convertAnnualRateToSum } from "../_common/helpers";

// Constants
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
 * Fetches a list of series from Cal-Adapt API that match the regex
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
 * params - object with props for geometry, stat, units, etc.
 * method - default is GET, POST used for user uploaded boundaries
 * @param {object}
 * @return {array}
 */
const fetchEvents = async ({
  url,
  id,
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
  let values;
  if (isRate) {
    values = transformResponse(response).map(({ date, value }) => ({
      date,
      value: convertAnnualRateToSum({ date, value }),
    }));
  } else {
    values = transformResponse(response);
  }
  const isRange = url.search(ENVELOPE_SEARCH_EXP) > 0 ? true : false;
  return { id, isRange, values };
};

/**
 * Get data for chart
 * @param {object} config - prop for climate indicator.
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
      return fetchEvents({ url, id, params, isRate });
    });
    const data = await Promise.all(promises);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get data for chart
 * @param {object} config - prop for climate indicator.
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
      return fetchEvents({ url, id, params, isRate });
    });
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

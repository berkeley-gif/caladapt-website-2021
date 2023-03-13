// Helpers
import config from "~/helpers/api-config";
import { handleXHR, fetchData, transformResponse } from "~/helpers/utilities";
import { convertAnnualRateToSum } from "../_common/helpers";
import { slugRegExp } from "./_helpers";

// Constants
import { OBSERVED_FILTER_YEAR } from "../_common/constants";
import { DEFAULT_OBSERVED_SLUG_EXP, OBSERVED, SCENARIOS } from "./_constants";

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
  const values = isAnnualRate
    ? transformResponse(response).map((d) => ({
        date: d.date,
        value: convertAnnualRateToSum(d),
      }))
    : transformResponse(response);
  // Add slug to keep track of which ensemble series the data comes from
  let slug;
  const regExpResult = slugRegExp.exec(url);
  if (!regExpResult) {
    throw new Error("slug not found in url");
  } else {
    slug = regExpResult[0];
  }
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
 * Get observed data for tool
 * @param {object} config - props describing climate indicator.
 * @param {object} params - props for for geometry, stat, units, etc.
 * @param {string} method - optional, use POST for uploaded boundaries
 * @param {string} searchStr - optional, regex string for searching the API
 * @return {array}
 */
export async function getObserved({
  config,
  params,
  method = "GET",
  searchStr = DEFAULT_OBSERVED_SLUG_EXP,
}) {
  try {
    const { indicatorId, isAnnualRate } = config;
    const exp = searchStr.replace("indicator", indicatorId);
    const urls = await fetchUrls(exp);
    const promises = urls.map((url) =>
      fetchEvents({ url, params, method, isAnnualRate })
    );
    const data = await Promise.all(promises);
    return data.map(({ slug, values }) => {
      // Add additional props for timeseries (e.g. id, color, label)
      const props = OBSERVED.find(({ id }) => slug.includes(id));
      return { slug, ...props, values };
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get projected data for tool
 * @param {object} config - props describing climate indicator.
 * @param {object} params - props for for geometry, stat, units, etc.
 * @param {string} method - optional, use POST for uploaded boundaries
 * @param {string} searchStr - optional, regex string for searching the API
 * @return {array}
 */
export async function getProjections({
  config,
  params,
  method = "GET",
  searchStr,
}) {
  try {
    if (!searchStr) return [];
    const { indicatorId, isAnnualRate } = config;
    const exp = searchStr.replace("indicator", indicatorId);
    const urls = await fetchUrls(exp);
    const promises = urls.map((url) =>
      fetchEvents({ url, params, method, isAnnualRate })
    );
    const data = await Promise.all(promises);
    return data.map(({ slug, values }) => {
      // Add additional props for timeseries (e.g. id, color, label)
      const props = SCENARIOS.find(({ id }) => slug.includes(id));
      return { slug, ...props, values };
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
 * @param {string} stat - spatial aggregation function
 * @param {number} months - used only for April SWE
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

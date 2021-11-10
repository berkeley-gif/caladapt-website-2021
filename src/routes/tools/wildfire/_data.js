// Node modules
import { merge } from "d3-array";
import { leftPad } from "~/helpers/utilities";

// Helpers
import config from "~/helpers/api-config";
import { handleXHR, fetchData, transformResponse } from "~/helpers/utilities";
import { PRIORITY_4_MODELS } from "../_common/constants";

const { apiEndpoint } = config.env.production;

export const getStateBoundary = async () => {
  try {
    const res = await fetch(
      `${apiEndpoint}/states/1/?format=geojson&srs=4326&precision=4`
    );
    return res.json();
  } catch (error) {
    console.error(error.message);
  }
};

export const getImgOverlayPath = ({
  climvarId,
  modelId,
  scenarioId,
  yearStart,
  yearEnd,
  monthNumber,
}) => {
  const slug =
    yearEnd < 2010
      ? `${climvarId}_month_livneh`
      : `${climvarId}_month_${modelId}_${scenarioId}`;
  return `${apiEndpoint}/series/${slug}/${yearStart}-${yearEnd}/${monthNumber}.png`;
};

const getClimvarStr = (climvarId, simulation) =>
  climvarId === "fire" ? `${climvarId}_${simulation}` : `${climvarId}_10y`;

const getBauStr = (climvarId, simulation, monthNumber) =>
  climvarId === "fire"
    ? "bau_mu"
    : simulation === "month"
    ? `bau_${getPaddedMonth(monthNumber)}`
    : "bau";

const getPaddedMonth = (monthNumber) => leftPad(`${monthNumber}`, 2, "0");

const getModelSeries = ({
  climvarId,
  scenarioId,
  modelIds,
  simulation,
  monthNumber,
}) => {
  return PRIORITY_4_MODELS.filter((d) => modelIds.includes(d.id)).map((d) => {
    const slugs = [
      `${getClimvarStr(climvarId, simulation)}_${
        d.id
      }_${scenarioId}_${getBauStr(climvarId, simulation, monthNumber)}`,
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
  return transformResponse(response, false);
};

/**
 * Fetches data for a single observed/model/ensemble series
 * Each series can have 1 or more slugs
 * @param {object} series - a distinct timeseries obj
 * @param {object} params - props for for geometry, stat, units, etc.
 * @param {string} method - default is GET, POST for uploaded boundaries
 * @return {array}
 */
const fetchSeries = async ({
  series,
  params,
  method = "GET",
  indicatorId,
  monthIds,
  isEnsemble,
}) => {
  try {
    const { slugs } = series;
    const promises = slugs.map((slug) =>
      fetchEvents({ slug, params, method, indicatorId, monthIds, isEnsemble })
    );
    const responses = await Promise.all(promises);
    const mergedResponses = merge(responses);
    const values = mergedResponses.map(({ date, value }) => ({
      date: new Date(Date.UTC(date.getUTCFullYear(), 0, 1)),
      value,
    }));
    return { ...series, values };
  } catch (error) {
    throw new Error(`${series.id}: ${error.message}`);
  }
};

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
  simulation,
  monthNumber,
  imperial = false,
  climvar,
}) {
  const params = {
    imperial,
    // countnd: true,
    ...(simulation === "month" && { months: monthNumber }),
  };
  let method;
  switch (boundary.id) {
    case "locagrid":
      params.g = `Point(${location.center[0]} ${location.center[1]})`;
      method = "GET";
      return { params, method };
    case "custom":
      params.g = JSON.stringify(location.geometry);
      params.stat = climvar === "fire" ? "sum" : "mean";
      method = "POST";
      return { params, method };
    default:
      params.ref = `/api/${boundary.id}/${location.id}/`;
      params.stat = climvar === "fire" ? "sum" : "mean";
      method = "GET";
      return { params, method };
  }
}

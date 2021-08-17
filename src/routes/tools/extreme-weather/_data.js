// Node modules
import { timeParse } from "d3-time-format";
import { quantile, max, min } from "d3-array";
import { format } from "d3-format";

// Helpers
import config from "../../../helpers/api-config";
import {
  handleXHR,
  fetchData,
  transformResponse,
  pipe,
  closest,
} from "../../../helpers/utilities";

const { apiEndpoint } = config.env.production;
const dateParse = timeParse("%Y-%m-%d");

const fetchTimeseries = async ({ slug, params, method }) => {
  const url = `${apiEndpoint}/series/${slug}/events/`;
  const [response, error] = await handleXHR(fetchData(url, params, method));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

const transformReturnLevels = (response) => {
  const returnlevels = response.returnlevels.map((d) => {
    const begin = dateParse(d.begin);
    const end = dateParse(d.end);
    const beginYear = +begin.getFullYear();
    const endYear = +end.getFullYear();
    let timestep;
    if (beginYear < 2000) {
      timestep = `Baseline (${beginYear}-${endYear})`;
    } else if (beginYear > 2000 && beginYear < 2060) {
      timestep = `Mid-Century (${beginYear}-${endYear})`;
    } else {
      timestep = `End-Century (${beginYear}-${endYear})`;
    }
    return { ...d, timestep, begin, end };
  });
  return returnlevels;
};

export async function getObservedValues(config, params, method) {
  try {
    const { climvarId } = config;
    const slug = `${climvarId}_day_hadisd`;
    const promise = pipe(
      fetchTimeseries,
      transformResponse
    )({ slug, params, method });
    const values = await promise;
    if (values.length === 0) {
      throw new Error("No Data");
    }
    return values;
  } catch (error) {
    throw new Error(`Observed: ${error.message}`);
  }
}

export async function getObservedReturnLevels(config, params, method) {
  try {
    const { climvarId } = config;
    const slug = `${climvarId}_day_hadisd/ams`;
    const promise = pipe(
      fetchTimeseries,
      transformReturnLevels
    )({ slug, params, method });
    const values = await promise;
    if (values.length === 0) {
      throw new Error("No Data");
    }
    return values;
  } catch (error) {
    throw new Error(`Observed: ${error.message}`);
  }
}

export function getBaselineStats(_data, extremes) {
  const { low, high, stats } = _data;
  let percentiles;
  if (extremes === "high") {
    percentiles = stats.filter((d) => d.percentile > 45);
  } else {
    percentiles = stats.filter((d) => d.percentile < 55);
  }
  return {
    low,
    high,
    percentiles,
  };
}

export function getThreshold(_data, extremes) {
  if (extremes === "high") {
    const percentile = _data.percentiles.find((d) => d.percentile === 90);
    return {
      bound: percentile.value,
      text: "Number must be >= 90th percentile value",
    };
  }
  const percentile = _data.percentiles.find((d) => d.percentile === 10);
  return {
    bound: percentile.value,
    text: "Number must be <= 10th percentile value",
  };
}

export function getReturnPeriod(_data, threshold) {
  const { gevisf, timestep } = _data;
  const gevisfMap = new Map(Object.entries(gevisf));
  const valuesArr = Object.keys(gevisf).map((d) => +d);
  const closestValue = closest(+threshold, valuesArr);
  const probability = +gevisfMap.get(String(closestValue));
  const rp = +format(".0f")(1 / probability);
  let label;
  if (rp > 50) {
    label = "Extreme";
  } else if (rp >= 5 && rp < 50) {
    label = "Rare";
  } else {
    label = "Common";
  }
  return {
    timestep,
    probability: +format(".0f")(probability * 100),
    rp,
    label,
  };
}

export function formatDataForExport(_data) {
  return _data;
}

export async function getForecastData({ lng, lat }) {
  const url = `https://api.weather.gov/points/${lat},${lng}`;
  const [response, error] = await handleXHR(fetchData(url, {}));
  if (error) {
    throw new Error(error.message);
  }
  const forecastUrl = response.properties.forecast;
  const [data, dataError] = await handleXHR(fetchData(forecastUrl, {}));
  if (error) {
    throw new Error(dataError.message);
  }
  return data.properties.periods.map((d) => {
    let label;
    if (d.name.includes(["This", "Tonight"])) {
      label = "Today";
    } else {
      label = d.name.substring(0, 3);
    }
    return { ...d, label };
  });
}

export function filterForecast(climvarId, forecast) {
  if (climvarId === "tasmin") {
    return forecast.filter((d) => d.isDaytime === false);
  }
  return forecast.filter((d) => d.isDaytime === true);
}

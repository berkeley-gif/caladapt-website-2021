// Node modules
import { timeParse, timeFormat } from "d3-time-format";
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
const startTimeParse = timeParse("%Y-%m-%dT%H:%M:%S%Z");
const startTimeFormat = timeFormat("%m/%d");

const fetchTimeseries = async ({ slug, params }) => {
  const url = `${apiEndpoint}/series/${slug}/events/`;
  const [response, error] = await handleXHR(fetchData(url, params));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

const transformReturnLevels = (response) => {
  const returnlevels = response.returnlevels.map((d) => {
    const { threshold, gevisf, levels, begin, end } = d;
    const beginDate = dateParse(begin);
    const endDate = dateParse(end);
    const beginYear = beginDate.getFullYear();
    const endYear = endDate.getFullYear();
    let timestep;
    if (beginYear < 2000) {
      timestep = `Baseline (${beginYear}-${endYear})`;
    } else if (beginYear > 2000 && beginYear < 2060) {
      timestep = `Mid-Century (${beginYear}-${endYear})`;
    } else {
      timestep = `End-Century (${beginYear}-${endYear})`;
    }
    return {
      threshold,
      gevisf,
      levels,
      timestep,
      begin: {
        day: beginDate.getDate(),
        month: beginDate.getMonth(),
        year: beginYear,
      },
      end: {
        day: endDate.getDate(),
        month: endDate.getMonth(),
        year: endYear,
      },
    };
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

export async function getObservedReturnLevels(config, params) {
  try {
    // TODO: remove cache busting param v=2
    params.v = 2;
    const { climvarId } = config;
    const slug = `${climvarId}_day_hadisd/ams`;
    const promise = pipe(
      fetchTimeseries,
      transformReturnLevels
    )({ slug, params });
    const values = await promise;
    if (values.length === 0) {
      throw new Error("No Data");
    }
    return values;
  } catch (error) {
    throw new Error(`Observed: ${error.message}`);
  }
}

export function calcBaselineStats(_data, extremes) {
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

export function calcThreshold(_data, extremes) {
  if (extremes === "high") {
    const percentile = _data.percentiles.find((d) => d.percentile === 90);
    return {
      bound: percentile.value,
      invalidText: "Number must be >= 90th percentile value",
    };
  }
  const percentile = _data.percentiles.find((d) => d.percentile === 10);
  return {
    bound: percentile.value,
    invalidText: "Number must be <= 10th percentile value",
  };
}

export function calcReturnPeriod(_data, threshold) {
  const { gevisf, timestep } = _data;
  const { probabilities, values } = gevisf;
  const valuesArr = values.map((d) => +d);
  const closestValue = closest(+threshold, valuesArr);
  const probability = probabilities[closestValue.index];
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

export async function getForecastData({ lng, lat }) {
  const url = `https://api.weather.gov/points/${lat},${lng}`;
  const [response, error] = await handleXHR(fetchData(url, {}));
  if (error) {
    throw new Error(error.message);
  }
  const forecastUrl = response.properties.forecast;
  const [data, dataError] = await handleXHR(fetchData(forecastUrl, {}));
  if (error) {
    throw new Error(dataError);
  }
  return data.properties.periods.map((d) => {
    const startTime = startTimeParse(d.startTime);
    const label = startTimeFormat(startTime);
    return { ...d, label };
  });
}

export function filterForecast(climvarId, forecast) {
  if (climvarId === "tasmin") {
    return forecast.filter((d) => d.isDaytime === false);
  }
  return forecast.filter((d) => d.isDaytime === true);
}

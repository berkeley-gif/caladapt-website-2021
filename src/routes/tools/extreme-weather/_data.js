// Node modules
import { timeParse, timeFormat } from "d3-time-format";
import { format } from "d3-format";
import { timeDay } from "d3-time";

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
        date: beginDate.getDate(),
        month: beginDate.getMonth(),
        year: beginYear,
      },
      end: {
        date: endDate.getDate(),
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

export function filterPercentiles(percentiles, extremes) {
  if (extremes === "high") {
    return percentiles.filter((d) => d.percentile > 45);
  }
  return percentiles.filter((d) => d.percentile < 55);
}

export function filterThreshold(percentiles, extremes) {
  if (extremes === "high") {
    const percentile = percentiles.find((d) => d.percentile === 90);
    return percentile.value;
  }
  const percentile = percentiles.find((d) => d.percentile === 10);
  return percentile.value;
}

export function getThresholdText(_data, extremes) {
  if (extremes === "high") {
    return "Number must be >= 90th percentile value";
  }
  return "Number must be <= 10th percentile value";
}

export function calcThresholdProbability({ gevisf, threshold }) {
  const { probabilities, values } = gevisf;
  const valuesArr = values.map((d) => +d);
  const closestValue = closest(+threshold, valuesArr);
  const probability = +probabilities[closestValue.index];
  const rp = +format(".0f")(1 / probability);
  let label;
  if (probability <= 0.01) {
    label = "Extreme";
  } else if (probability > 0.01 && probability < 0.25) {
    label = "Rare";
  } else {
    label = "Common";
  }
  const value = +format(".2f")(probability * 100);
  let append;
  if (value === 50) {
    append = "at least";
  } else if (value === 0.1) {
    append = "less than";
  } else {
    append = "";
  }
  return {
    append,
    value,
    label,
    rp,
  };
}

export function calcThresholdExceedances({ values, threshold, extremes }) {
  if (extremes === "high") {
    return values.filter((d) => d > threshold).length;
  }
  return values.filter((d) => d < threshold).length;
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
  const periods = data.properties.periods.map((d) => {
    const { startTime, isDaytime, windSpeed } = d;
    const windSpeedArr = windSpeed.match(/\d+/g).map((d) => +d);
    const date = startTimeParse(startTime);
    const dateLabel = startTimeFormat(date);
    return {
      ...d,
      date,
      label: isDaytime ? `${dateLabel} AM` : `${dateLabel} PM`,
      windSpeedArr,
    };
  });
  return periods.sort((a, b) => b.date - a.date);
}

export function filterForecast(climvarId, forecast) {
  switch (climvarId) {
    case "tasmin":
      return forecast
        .filter((d) => !d.isDaytime)
        .map(({ label, temperature, temperatureUnit }) => ({
          label,
          value: temperature,
          valueLabel: `${temperature} °${temperatureUnit}`,
        }));
    case "tasmax":
      return forecast
        .filter((d) => d.isDaytime)
        .map(({ label, temperature, temperatureUnit }) => ({
          label,
          value: temperature,
          valueLabel: `${temperature} °${temperatureUnit}`,
        }));
    default:
      return forecast.map(
        ({ label, windSpeedArr, windSpeed, windDirection }) => ({
          label,
          value: windSpeedArr,
          valueLabel: `${windSpeed} ${windDirection}`,
        })
      );
  }
}

export async function getMeasuredData({ stationId, startDate, endDate }) {
  const params = {
    dataset: "daily-summaries",
    stations: stationId,
    startDate,
    endDate,
    dataTypes: "TMAX,TMIN",
    units: "standard",
    format: "json",
  };
  const url = `https://www.ncei.noaa.gov/access/services/data/v1`;
  const [response, error] = await handleXHR(fetchData(url, params));
  if (error) {
    throw new Error(error.message);
  }
  const dateRange = timeDay.range(dateParse(startDate), dateParse(endDate));
  const data = response.map((d) => ({
    ...d,
    date: dateParse(d.DATE),
    label: startTimeFormat(dateParse(d.DATE)),
  }));
  const records = dateRange.map((d) => {
    const match = data.find((item) => item.date.getTime() === d.getTime());
    if (!match) {
      return {
        date: d,
        label: startTimeFormat(d),
        TMAX: null,
        TMIN: null,
      };
    }
    return match;
  });
  return records.sort((a, b) => b.date - a.date);
}

export function filterMeasured(climvarId, measured) {
  if (climvarId === "tasmin") {
    return measured.map((d) => ({ label: d.label, value: +d.TMIN }));
  }
  return measured.map((d) => ({ label: d.label, value: +d.TMAX }));
}

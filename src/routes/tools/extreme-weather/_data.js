// Node modules
import { timeParse, timeFormat } from "d3-time-format";
import { timeDay } from "d3-time";

// Helpers
import config from "../../../helpers/api-config";
import {
  handleXHR,
  fetchData,
  transformResponse,
  pipe,
} from "../../../helpers/utilities";

const { apiEndpoint } = config.env.production;
const dateParse = timeParse("%Y-%m-%d");
const startTimeParse = timeParse("%Y-%m-%dT%H:%M:%S%Z");
const startTimeFormat = timeFormat("%m/%d");
const numberFormat = timeFormat("%j");

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
      label: isDaytime ? `${dateLabel} am` : `${dateLabel} pm`,
      windSpeedMax: windSpeedArr[windSpeedArr.length - 1],
    };
  });
  return periods.sort((a, b) => b.date - a.date);
}

export async function getRecentObsData({ stationId, startDate, endDate }) {
  const params = {
    dataset: "daily-summaries",
    stations: stationId,
    startDate,
    endDate,
    dataTypes: "TMAX,TMIN,WSF2,WDF2",
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
        TMAX: undefined,
        TMIN: undefined,
        WSF2: undefined,
        WDF2: undefined,
      };
    }
    return match;
  });
  return records.sort((a, b) => b.date - a.date);
}

/**
 * Creates the param object used to fetch data from API
 * @param {object} location
 * @param {object} boundary - obj representing a mapbox layer
 * @param {boolean} imperial - represents units
 * @return {object} params
 * @return {string} method
 */
export function getQueryParams({ location, doy, extype }) {
  const params = {
    g: `POINT(${location.geometry.coordinates[0]} ${location.geometry.coordinates[1]})`,
    doy: numberFormat(doy),
    imperial: true,
    extype,
  };
  return { params, method: "GET" };
}

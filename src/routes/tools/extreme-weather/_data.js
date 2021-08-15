// Node modules
import { timeParse, timeFormat } from "d3-time-format";
import { quantile, ascending } from "d3-array";
import { format } from "d3-format";

// Helpers
import config from "../../../helpers/api-config";
import {
  handleXHR,
  transformResponse,
  fetchData,
  pipe,
  closest,
} from "../../../helpers/utilities";
import { seriesList, classifyTemperatures } from "./_helpers";

const { apiEndpoint } = config.env.production;
const dateParse = timeParse("%Y-%m-%d");
const dateFormat = timeFormat("%b %e, %Y");

const fetchReturnLevels = async ({ slug, params, method }) => {
  const url = `${apiEndpoint}/series/${slug}/ams/`;
  const [response, error] = await handleXHR(fetchData(url, params, method));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

const addSeriesInfo = (series) => {
  const item = seriesList.find((d) => d.key === series.key);
  return { ...series, ...item, visible: true };
};

const transformReturnLevels = (response) => {
  const returnlevels = response.returnlevels.map((d) => {
    const begin = +dateParse(d.begin).getFullYear();
    const end = +dateParse(d.end).getFullYear();
    let timestep;
    if (begin < 2000) {
      timestep = `Baseline (${begin}-${end})`;
    } else if (begin > 2000 && begin < 2060) {
      timestep = `Mid-Century (${begin}-${end})`;
    } else {
      timestep = `End-Century (${begin}-${end})`;
    }
    return { ...d, timestep };
  });
  return returnlevels;
};

export async function addModel(config, params, method, modelId) {
  try {
    const { climvarId, scenarioId } = config;
    const slug = `${climvarId}_day_${modelId}_${scenarioId}`;
    const promise = pipe(
      fetchReturnLevels,
      transformReturnLevels
    )({ slug, params, method });
    const returnlevels = await promise;
    if (returnlevels.length === 0) {
      throw new Error("No Data");
    }
    const series = {
      key: modelId,
      returnlevels,
    };
    return addSeriesInfo(series);
  } catch (error) {
    throw new Error(`${modelId}: ${error.message}`);
  }
}

export async function getStations() {
  const url = `${apiEndpoint}/hadisdstations/`;
  const [response, error] = await handleXHR(fetchData(url, { pagesize: 39 }));
  if (error) {
    throw new Error(error.message);
  }
  return response;
}

function extractHistoricaData(_data) {
  const historicalInfo = seriesList.find((d) => d.key === "historical");
  // Return levels for historical period are same for all models
  // Use the first GCM to filter out return levels for historical period
  const historicalData = _data[0].returnlevels.find(
    (d) => +dateParse(d.begin).getFullYear() < 2000
  );
  // Filter out historical data from all model responses
  const filteredData = _data.map((series) => {
    return {
      ...series,
      returnlevels: series.returnlevels.filter(
        (d) => +dateParse(d.begin).getFullYear() > 2000
      ),
    };
  });
  // Add a new series for historical period
  filteredData.unshift({ ...historicalInfo, returnlevels: [historicalData] });
  return filteredData;
}

export async function getData(config, params, method = "GET") {
  const { modelIds } = config;
  const modelList = modelIds.split(",");
  const modelPromise = modelList.map((modelId) =>
    addModel(config, params, method, modelId)
  );
  const modelData = await Promise.all(modelPromise);
  const data = extractHistoricaData(modelData);
  return data;
}

export async function getObservedData(config, g) {
  const { climvarId } = config;
  const url = `${apiEndpoint}/series/${climvarId}_day_hadisd/events/`;
  const params = {
    g,
    imperial: true,
  };
  const [response, error] = await handleXHR(fetchData(url, params));
  if (error) {
    throw new Error(error.message);
  }
  return transformResponse(response);
}

export function getReturnLevels(_data) {
  const arr = [];
  _data.forEach((series) => {
    series.returnlevels.forEach((group) => {
      const { levels } = group;
      const updatedLevels = levels.map((level) => {
        return {
          ...level,
          timestep: group.timestep,
          key: series.key,
          color: series.color,
          label: series.label,
        };
      });
      arr.push(...updatedLevels);
    });
  });
  return arr;
}

export function getProbabilities(_data) {
  const arr = [];
  _data.forEach((series) => {
    series.returnlevels.forEach((group) => {
      arr.push({
        timestep: group.timestep,
        probabilites: group.gevisf,
        key: series.key,
        color: series.color,
        label: series.label,
      });
    });
  });
  return arr;
}

function getReturnPeriod(returnlevel, level) {
  const { gevisf, timestep } = returnlevel;
  const gevisfMap = new Map(Object.entries(gevisf));
  const valuesArr = Object.keys(gevisf).map((d) => +d);
  const closestValue = closest(+level, valuesArr);
  const probability = +gevisfMap.get(String(closestValue));
  return {
    timestep,
    probability,
    rp: format(".0f")(1 / probability),
  };
}

export function getSeriesReturnPeriods(series, level) {
  const { key, label, color, returnlevels } = series;
  const rps = returnlevels.map((d) => getReturnPeriod(d, level));
  return {
    key,
    label,
    color,
    values: rps,
  };
}

export async function getForecastData(config, g) {
  const { climvarId } = config;
  const parts = g.split(" ");
  const lon = parts[0].replace("POINT(", "");
  const lat = parts[1].replace(")", "");
  const url = `https://api.weather.gov/points/${lat},${lon}`;
  const [response, error] = await handleXHR(fetchData(url, {}));
  if (error) {
    throw new Error(error.message);
  }
  const forecastUrl = response.properties.forecast;
  const [data, dataError] = await handleXHR(fetchData(forecastUrl, {}));
  if (error) {
    throw new Error(dataError.message);
  }
  const periods = data.properties.periods;
  if (climvarId === "tasmin") {
    return periods.filter((d) => d.isDaytime === false);
  }
  return periods.filter((d) => d.isDaytime === true);
}

export function getObservationStats(data, formatFn = (d) => format(".1f")(d)) {
  const sorted = data.sort((a, b) => ascending(a.value, b.value));
  const low = sorted[0];
  const high = sorted[sorted.length - 1];
  return [
    {
      label: `Record Low ${dateFormat(low.date)}`,
      value: +formatFn(low.value),
    },
    {
      label: `Record High ${dateFormat(high.date)}`,
      value: +formatFn(high.value),
    },
  ];
}

export function getBaselineStats(
  data,
  climvar,
  formatFn = (d) => format(".1f")(d)
) {
  const values = data.map((d) => d.value).sort();
  if (climvar === "tasmax") {
    return [
      {
        label: "75th Percentile",
        value: +formatFn(quantile(values, 0.75)),
      },
      {
        label: "90th Percentile",
        value: +formatFn(quantile(values, 0.9)),
      },
      {
        label: "99th Percentile",
        value: +formatFn(quantile(values, 0.99)),
      },
    ];
  } else if (climvar === "tasmin") {
    return [
      {
        label: "25th Percentile",
        value: +formatFn(quantile(values, 0.25)),
      },
      {
        label: "10th Percentile",
        value: +formatFn(quantile(values, 0.1)),
      },
      {
        label: "1st Percentile",
        value: +formatFn(quantile(values, 0.01)),
      },
    ];
  } else {
    return [];
  }
}

export function formatDataForExport() {}

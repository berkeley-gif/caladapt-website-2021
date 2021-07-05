// Node modules
import { timeParse, timeFormat } from 'd3-time-format';
import { group } from 'd3-array';

// Helpers
import config from '../../../helpers/api-config';
import {
  handleXHR,
  fetchData,
  pipe,
} from '../../../helpers/utilities';
import { seriesList } from './_helpers';

const { apiEndpoint } = config.env.production;
const dateParse = timeParse('%Y-%m-%d');

const fetchReturnLevels = async ({slug, params, method}) => {
  const url = `${apiEndpoint}/series/${slug}/ams/`;
  const [response, error] = await handleXHR(fetchData(url, params, method));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

const addSeriesInfo = (series) => {
  const item = seriesList.find(d => d.key === series.key);
  return { ...series, ...item, visible: true, };
}

const transformResponse = (response) => {
  const returnlevels = response.returnlevels.map(d => {
    const begin = +dateParse(d.begin).getFullYear();
    const end = +dateParse(d.end).getFullYear();
    let timestep;
    if (begin < 2000) {
      timestep = `Historical (${begin}-${end})`
    } else if (begin > 2000 && begin < 2060) {
      timestep = `Mid-Century (${begin}-${end})`
    } else {
      timestep = `End-Century (${begin}-${end})`
    }
    return { ...d, timestep };
  });
  return returnlevels;
};

export async function addModel(config, params, method, modelId) {
  try {
    const { climvarId, scenarioId } = config;
    const slug = `${climvarId}_day_${modelId}_${scenarioId}`;
    const promise = pipe(fetchReturnLevels, transformResponse)({slug, params, method});
    const returnlevels = await promise;
    if (returnlevels.length === 0) {
      throw new Error('No Data');
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
  const [response, error] = await handleXHR(fetchData(url, { pagesize:39 }));
  if (error) {
    throw new Error(error.message);
  }
  return response;
}

function extractHistoricaData(_data) {
  const historicalInfo = seriesList.find(d => d.key === 'historical');
  // Return levels for historical period are same for all models
  // Use the first GCM to filter out return levels for historical period
  const historicalData = _data[0].returnlevels.find(d => +dateParse(d.begin).getFullYear() < 2000);
  // Filter out historical data from all model responses
  const filteredData = _data.map((series) => {
    return {
      ...series,
      returnlevels: series.returnlevels.filter(d => +dateParse(d.begin).getFullYear() > 2000)
    }
  });
  // Add a new series for historical period
  filteredData.unshift({ ...historicalInfo, returnlevels: [historicalData] });
  return filteredData;
}

export async function getData(config, params, method) {
  const { modelIds } = config;
  const modelList = modelIds.split(',');
  const modelPromise = modelList.map(modelId => addModel(config, params, method, modelId));
  const modelData = await Promise.all(modelPromise);
  const data = extractHistoricaData(modelData);
  return data;
}

export function getReturnLevels(_data) {
  const arr = [];
  _data.forEach((series) => {
    series.returnlevels.forEach((group) => {
      const { begin, end, levels } = group;
      const updatedLevels = levels.map((level) => {
        return { 
          ...level, 
          timestep: `${begin}:${end}`,
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
      const { begin, end, gevisf, threshold } = group;
      arr.push({
        key: series.key,
        color: series.color,
        label: series.label,
        timestep: `${begin}:${end}`,
        gevisf,
        threshold,
      });
    });
  });
  return arr;
}

export function formatDataForExport(_data) {

}
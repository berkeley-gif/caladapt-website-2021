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
const dateFormat = timeFormat('%Y');

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

const transformResponse = response => response.returnlevels;

export async function addModel(config, params, method, modelId) {
  try {
    const { climvarId, scenarioId } = config;
    const slug = `${climvarId}_day_${modelId}_${scenarioId}`;
    const promise = pipe(fetchReturnLevels, transformResponse)({slug, params, method});
    const values = await promise;
    if (values.length === 0) {
      throw new Error('No Data');
    }
    const series = {
      key: modelId,
      values,
    };
    return addSeriesInfo(series);
  } catch (error) {
    throw new Error(`${modelId}: ${error.message}`);
  }
}

function extractHistoricaData(_data) {
  const historicalInfo = seriesList.find(d => d.key === 'observed');
  // Return levels for historical period are same for all models
  // Use the first GCM to filter out return levels for historical period
  const historicalData = _data[0].values.find(d => +dateParse(d.begin).getFullYear() < 2000);
  // Filter out historical data from all model responses
  const filteredData = _data.map((series) => {
    return {
      ...series,
      values: series.values.filter(d => +dateParse(d.begin).getFullYear() > 2000)
    }
  });
  // Add a new series for historical period
  filteredData.unshift({ ...historicalInfo, values: [historicalData] });
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
    series.values.forEach((group) => {
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
    series.values.forEach((group) => {
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
// Node modules
import { format } from 'd3-format';
import { timeParse } from 'd3-time-format';
import { merge, rollup, sort, min, max } from 'd3-array';

// Helpers
import config from '../../../helpers/api-config';
import {
  handleXHR,
  fetchData,
  transformResponse,
  addPropsToValues,
  createSeriesObject,
  pipe,
  curry,
  sanitizeString,
  serialize,
} from '../../../helpers/utilities';
import { seriesList } from './_helpers';

const { apiEndpoint } = config.env.production;
const coordFormat = format('.4f');
const parseDate = timeParse('%Y-01-01T00:00:00Z');

const fetchTimeseries = async ({slug, params, method}) => {
  const url = `${apiEndpoint}/series/${slug}/events/`;
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

const buildEnvelope = (_data) => {
  const dataMap = rollup(_data, v => v.map(i => i.value), d => d.date.getFullYear());
  const dataArr = Array.from(dataMap);
  return dataArr.map(([key, value]) => {
    const sortedArr = sort(value);
    return {
      date: new Date(key, 0, 1),
      min: sortedArr[0],
      max: sortedArr[1],
    };
  });
}

export async function addModel(config, params, method, modelId) {
  const { climvarId, scenarioId } = config;
  const slugs = [
    `${climvarId}_year_${modelId}_historical`,
    `${climvarId}_year_${modelId}_${scenarioId}`,
  ];
  const promises = slugs.map(slug => {
    return pipe(fetchTimeseries, transformResponse)({slug, params, method})
  });
  return Promise.all(promises)
    .then((results) => {
      const values = merge(results);
      if (values.length === 0) {
        throw new Error('No Data');
      }
      const series = {
        key: modelId,
        type: 'line',
        values,
      };
      return addSeriesInfo(series);
    })
    .catch((error) => {
      throw new Error(`${modelId}: ${error.message}`);
    });
}

export async function getObserved(config, params, method) {
  try {
    const { climvarId } = config;
    const slug = `${climvarId}_year_livneh`;
    const promise = pipe(fetchTimeseries, transformResponse)({slug, params, method});
    const values = await promise;
    if (values.length === 0) {
      throw new Error('No Data');
    }
    const observed = {
      key: 'observed',
      type: 'line',
      values: values.filter(d => d.date.getFullYear() < 2007),
    };
    return addSeriesInfo(observed);
  } catch (error) {
    throw new Error(`Observed: ${error.message}`);
  }
}

export async function getModels(config, params, method) {
  const { modelIds } = config;
  const modelList = modelIds.split(',');
  const modelPromise = modelList.map(modelId => addModel(config, params, method, modelId));
  const modelData = await Promise.all(modelPromise);
  return modelData;
}

export async function getEnvelope(config, params, method) {
  const { climvarId, scenarioId } = config;
  const slugs = [
    `${climvarId}_year_models-min_historical`,
    `${climvarId}_year_models-min_${scenarioId}`,
    `${climvarId}_year_models-max_historical`,
    `${climvarId}_year_models-max_${scenarioId}`,
  ];
  const promises = slugs.map(slug => {
    return pipe(fetchTimeseries, transformResponse)({slug, params, method})
  });
  return Promise.all(promises)
    .then((results) => {
      const values = buildEnvelope(merge(results));
      const series = {
        key: scenarioId,
        type: 'area',
        values,
      };
      return addSeriesInfo(series);
    })
    .catch((error) => {
      throw new Error(`Envelope: ${error.message}`);
    });
}
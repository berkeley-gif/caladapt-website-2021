// Node modules
import { format } from 'd3-format';
import { timeParse } from 'd3-time-format';
import { merge, rollup } from 'd3-array';

// Helpers
import config from '../../../helpers/api-config';
import {
  handleXHR,
  fetchData,
  transformCounts,
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

const fetchTimeseries = async ({slug, params}) => {
  const url = `${apiEndpoint}/series/${slug}/events/`;
  const [response, error] = await handleXHR(fetchData(url, params));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

const countByYear = (values) => {
  const counts = rollup(values, v => v.length, d => d.date.getFullYear());
  return counts;
};

const addSeriesInfo = (series) => {
  const item = seriesList.find(d => d.key === series.key);
  return { ...series, ...item, visible: true, };
}

export async function get98pThreshold(climvar, queryParams) {
  try {
    const url = `${apiEndpoint}/series/${climvar}_day_livneh/exheat/?${serialize(queryParams)}`;
    const data = await fetch(url);
    const json = await data.json();
    const thresh98p = +json['98p'].toFixed(1);
    return thresh98p;
  } catch (error) {
    throw new Error(`Default Threshold: ${error.message}`);
  }
}

export async function addModel(config, params, modelId) {
  const { climvarId, scenarioId } = config;
  const slugs = [
    `${climvarId}_day_${modelId}_historical`,
    `${climvarId}_day_${modelId}_${scenarioId}`,
  ];
  const promises = slugs.map(slug => {
    return pipe(fetchTimeseries, transformResponse)({slug, params})
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

export async function getObserved(config, params) {
  try {
    const { climvarId } = config;
    const slug = `${climvarId}_day_livneh`;
    const promise = pipe(fetchTimeseries, transformResponse)({slug, params});
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

export async function getModels(config, params) {
  const { modelIds } = config;
  const modelList = modelIds.split(',');
  const modelPromise = modelList.map(modelId => addModel(config, params, modelId));
  const modelData = await Promise.all(modelPromise);
  return modelData;
}
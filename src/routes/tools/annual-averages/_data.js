// Node modules
import { merge, rollup, sort, group } from 'd3-array';

// Helpers
import config from '../../../helpers/api-config';
import {
  handleXHR,
  fetchData,
  transformResponse,
  pipe,
} from '../../../helpers/utilities';
import { seriesList } from './_helpers';

const { apiEndpoint } = config.env.production;

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
      date: new Date(key, 11, 31),
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

export  function flattenData(_data) {
  return _data.reduce((acc, series) => {
    const seriesValues = series.values.map(d => {
      return {
        ...d,
        year: +d.date.getFullYear(),
        key: series.key,
        label: series.label,
      };
    });
    acc.push(...seriesValues);
    return acc;
  }, []);
}

export function getDataByDate(_arr) {
  return Array.from(group(_arr, (d) => d.year), ([year, values]) => {
    const date = new Date(year, 11, 31);
    const rows = values.map(d => {
      if (d.min) {
        return {
          key: d.key,
          label: d.label,
          value: [d['min'], d['max']],
        };
      } else {
        return {
          key: d.key,
          label: d.label,
          value: d.value,
        };
      }
    });
    return { date, values:rows };
  });
}

export function formatDataForExport(_arr) {
  return _arr.map((item) => {
    const row = {};
    row.year = item.date.getFullYear();
    item.values.forEach((d) => {
      if (Array.isArray(d.value)) {
        row[`${d.label} Min`] = d.value[0];
        row[`${d.label} Max`] = d.value[1];
      } else {
        row[d.label] = d.value;
      }
    });
    return row;
  })
}
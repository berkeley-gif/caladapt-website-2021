// Node modules
import { timeParse } from 'd3-time-format';

// Helpers
import config from '../../../helpers/api-config';
import {
  handleXHR,
  transformResponse,
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

const transformReturnLevels = (response) => {
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
    const promise = pipe(fetchReturnLevels, transformReturnLevels)({slug, params, method});
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

export async function getStationData(config, g, begin, end) {
  const { climvarId } = config;
  const url = `${apiEndpoint}/series/${climvarId}_day_hadisd/events/`;
  const [response, error] = await handleXHR(fetchData(url, { g }));
  if (error) {
    throw new Error(error.message);
  }
  const data = transformResponse(response);
  // Get start and end dates to filter observed data
  // TODO: check if API can provide subset instead of filtering client side
  const beginDate = dateParse(begin);
  const beginYear = +beginDate.getFullYear();
  const endDate = dateParse(end);
  const endYear = +endDate.getFullYear();

  // Filter by 30 day period around selected date
  const filterBy30DayPeriod = data.filter(d => {
    const year = d.date.getFullYear();
    const s = new Date(beginDate.setYear(year))
    const e = new Date(endDate.setYear(year))
    if ((d.date.getTime() >= s.getTime()) && (d.date.getTime() <= e.getTime())) {
      return true
    }
    return false
  });

  // Filter by baseline period (30 years)
  return filterBy30DayPeriod.filter(d => {
    if ((+d.date.getFullYear() >= beginYear) && (+d.date.getFullYear() <= endYear)) {
      return true
    }
    return false
  })
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
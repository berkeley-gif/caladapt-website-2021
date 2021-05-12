import { range } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import models from '../../../helpers/climate-models';
import scenarios from '../../../helpers/climate-scenarios';
import boundaries from '../../../helpers/mapbox-layers';
import climvars from '../../../helpers/climate-variables';
import { tools } from '../../../../content/tools/data';

export const climvarList = climvars
  .filter(d => ['swe'].includes(d.id))
  .map((d) => {
    const title = `Snow Water Equivalent`;
    return { ...d, title };
  });

// List of series used in tool with additional props for
// symbolyzing these lines
const series = [
  {
    key: 'observed',
    label: 'Observed',
    color: 'rgba(110, 110, 110, 1)',
    mark: 'line',
  },
];

models.forEach((d) => {
  let label;
  if (d.text) {
    label =  `${d.id} (${d.text})`;
  } else {
    label = d.id;
  }
  series.push({
    key: d.id,
    label,
    color: d.color,
    mark: 'line',
  });
});

export const seriesList = series;

export const monthsList = range(0, 12).map((d) => {
  const day = new Date(2020, d, 1);
  return { id: parseInt(d), label: timeFormat('%B')(day) };
});

export const boundaryList = boundaries
  .filter(d => d.metadata.group === 'Boundaries')
  .map(d => {
    let text;
    if (d.id === 'locagrid') {
      text = 'None';
    } else {
      text = d.metadata.title;
    }
    return { ...d, text };
  });

export const modelList = models
  .map((d) => {
    let text;
    if (d.text) {
      text =  `${d.id} (${d.text})`;
    } else {
      text = d.id;
    }
    return {
      ...d,
      text,
    }
  });

export const scenarioList = scenarios
  .filter(d => ['rcp45', 'rcp85'].includes(d.id));

const toolsList =   ['Extreme Precipitation', 'Streamflow', 'Annual Averages'];
const caladaptTools = tools.filter((tool) => {
  if (toolsList.includes(tool.title)) {
    tool.category = 'caladapt';
    return true;
  }
});

export const resources = [
  ...caladaptTools,
  {
    title: 'Get started with Cal-Adapt',
    category: 'help',
    link: '/help/get-started/',
    icon: 'get-started',
  },
  {
    title: 'Tutorials & Webinars',
    category: 'help',
    link: '/help/tutorials/',
    icon: 'tutorials',
  },
  {
    title: 'Frequently Asked Questions',
    category: 'help',
    link: '/help/faqs/',
    icon: 'faqs',
  },
  {
    title: "California's Adaptation Clearinghouse",
    link: 'https://resilientca.org',
    category: 'other',
    image: 'logos/EJ_JRC_ccc_simulation-7094.jpg',
    desc: `The Adaptation Clearinghouse is the State of California’s consolidated searchable 
    database of resources for local, regional and statewide climate adaptation planning 
    and decision-making.`,
  },
  {
    title: "Regional Reports: California's 4th Climate Change Assessment",
    link: 'https://www.climateassessment.ca.gov/regions/',
    category: 'other',
    image: 'logos/ccc4a.jpg',
    desc: `California’s Fourth Climate Change Assessment provides information to 
    build resilience to climate impacts, including temperature, wildfire, water, 
    sea level rise, and governance. The assessment includes reports for nine regions 
    of the state to support action at local and regional scales.`,
  },
];

export function getMapImages({ model, ticks, scenario, month }) {
  console.log('getmapimages', model);
  const urls = ticks.map((tick) => {
    const start = parseInt(tick);
    const end = start + 9;
    const useScenario = tick < 2000 ? 'historical': scenario;
    return {
      id: start,
      text: `${start}-${end}`,
      src: `https://api.cal-adapt.org/api/series/swe_month_${model}_${useScenario}/${start}-${end}/${month}.png?style=swe&scale=10`,
    };
  });
  return urls;
}


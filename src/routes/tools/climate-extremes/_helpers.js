import models from '../../../helpers/climate-models';
import scenarios from '../../../helpers/climate-scenarios';
import boundaries from '../../../helpers/mapbox-layers';
import climvars from '../../../helpers/climate-variables';
import { tools } from '../../../../content/tools/data';

export const climvarList = climvars
  .filter(d => ['tasmax', 'tasmin'].includes(d.id))
  .map((d) => {
    const title = `Annual Average ${d.label}`;
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

export const caladaptTools = tools.filter((tool) => {
  if (['Maps of Projected Change', 'Extreme Heat'].includes(tool.title)) {
    tool.category = 'caladapt';
    return true;
  }
});

export const resources = [
  ...caladaptTools,
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


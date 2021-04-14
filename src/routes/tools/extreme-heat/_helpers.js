import { Sun } from '../../../components/icons';
import models from '../../../helpers/climate-models';
import scenarios from '../../../helpers/climate-scenarios';
import boundaries from '../../../helpers/mapbox-layers';
import { LineAreaChart, ScatterChart, HeatmapChart } from '../../../components/tools/Charts';

// Create a new climvarList instead of using the default one
// Needs to be an export so it can be used to intitialize SelectClimvar component
// instead of the default climavarList
export const climvarList = [
  {
    id: 'tasmax',
    title: 'Extreme Heat Days',
    desc: `Days in a year when daily maximum temperature is above a threshold temperature`,
    icon: Sun,
  },
  {
    id: 'tasmin',
    title: 'Warm Nights',
    desc: 'Nights in a year when daily minimum temperature is above a threshold temperature',
    icon: Sun,
  },
];

// List of indicators (or chart views) used for Extreme Heat Tool
export const indicatorList = [
  {
    id: 'frequency',
    name: 'Frequency',
    title: 'Number of Extreme Heat Days per year',
    helperText: `Days in a year when daily maximum temperature is above a threshold temperature`,
    units: 'days per year',
    decimals: 0,
    icon: Sun,
    component: LineAreaChart,
  },
  {
    id: 'timing',
    name: 'Timing',
    title: 'Timing of Extreme Heat Days per year',
    helperText: `Days in a year when the daily maximum temperature is above a threshold temperature`,
    units: '',
    decimals: 0,
    icon: Sun,
    component: HeatmapChart,
  },
  {
    id: 'duration',
    name: 'Duration',
    title: 'Longest stretch of consecutive Extreme Heat Days per year',
    helperText: `The longest stretch of consecutive days when daily maximum temperatures are above a threshold temperature`,
    units: 'days per year',
    decimals: 0,
    icon: Sun,
    component: ScatterChart,
  },
  {
    id: 'waves',
    name: 'Heat Waves',
    title: 'Number of Heat Wave Events per year',
    helperText: `Number of heat wave events in a year when daily maximum temperatures are above a threshold temperature`,
    units: 'events per year',
    decimals: 0,
    icon: Sun,
    component: ScatterChart,
  },
];

// List of series used in Extreme heat tool with additional props for
// symbolyzing these lines
const series = [
  {
    key: 'observed',
    label: 'Observed',
    color: 'rgba(110, 110, 110, 1)',
    mark: 'line',
  },
  {
    key: 'rcp45',
    label: 'Modeled RCP 4.5 Range',
    color: 'rgba(129, 140, 158, 1)',
    mark: 'area',
  },
  {
    key: 'rcp85',
    label: 'Modeled RCP 8.5 Range',
    color: 'rgba(129, 140, 158, 1)',
    mark: 'area',
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
  .filter(d => ['locagrid', 'counties', 'censustracts', 'hydrounits'].includes(d.id))
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
import models from '../../../helpers/climate-models';
import scenarios from '../../../helpers/climate-scenarios';
import boundaries from '../../../helpers/mapbox-layers';
import climvars from '../../../helpers/climate-variables';

export const climvarList = climvars
  .filter(d => ['tasmax', 'tasmin', 'pr'].includes(d.id))
  .map((d) => {
    let title;
    if (d.id === 'pr') {
      title = `Annual Total ${d.label}`;
    } else {
      title = `Annual Average ${d.label}`;
    }
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
  {
    key: 'rcp45',
    label: 'Modeled RCP 4.5 Range',
    color: 'rgba(218, 222, 225, 1)',
    mark: 'area',
  },
  {
    key: 'rcp85',
    label: 'Modeled RCP 8.5 Range',
    color: 'rgba(218, 222, 225, 1)',
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


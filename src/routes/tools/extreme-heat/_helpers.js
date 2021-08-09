import { Sun } from "../../../components/icons";
import climvars from "../../../helpers/climate-variables";
import models from "../../../helpers/climate-models";
import scenarios from "../../../helpers/climate-scenarios";
import boundaries from "../../../helpers/mapbox-layers";
import { MinMaxAvg, MonthsCount } from "../../../components/tools/Stats";
import {
  LineAreaChart,
  ScatterChart,
  HeatmapChart,
} from "../../../components/tools/Charts";
import { tools } from "../../../../content/tools/data";

// Create a new climvarList instead of using the default one
// Needs to be an export so it can be used to intitialize SelectClimvar component
// instead of the default climavarList
export const climvarList = climvars.filter((d) =>
  ["tasmax", "tasmin"].includes(d.id)
);

// List of indicators (or chart views) used for Extreme Heat Tool
export const indicatorList = [
  {
    id: "frequency",
    label: "Frequency",
    title: "Number of Extreme Heat Days per Year",
    helperText: `Days in a year when daily maximum temperature is above a threshold temperature`,
    units: "days/year",
    decimals: 0,
    icon: Sun,
    chartComponent: LineAreaChart,
    statsComponent: MinMaxAvg,
  },
  {
    id: "timing",
    label: "Timing",
    title: "Timing of Extreme Heat Days per Year",
    helperText: `Days in a year when the daily maximum temperature is above a threshold temperature`,
    units: "",
    decimals: 0,
    icon: Sun,
    chartComponent: HeatmapChart,
    statsComponent: MonthsCount,
  },
  {
    id: "duration",
    label: "Duration",
    title: "Longest Stretch of Consecutive Extreme Heat Days per Year",
    helperText: `The longest stretch of consecutive days when daily maximum temperatures are above a threshold temperature`,
    units: "days/year",
    decimals: 0,
    icon: Sun,
    chartComponent: ScatterChart,
    statsComponent: MinMaxAvg,
  },
  {
    id: "waves",
    label: "Heat Waves",
    title: "Number of Heat Wave Events per Year",
    helperText: `Number of heat wave events in a year when daily maximum temperatures are above a threshold temperature`,
    units: "events/year",
    decimals: 0,
    icon: Sun,
    chartComponent: ScatterChart,
    statsComponent: MinMaxAvg,
  },
];

// List of series used in Extreme heat tool with additional props for
// symbolyzing these lines
const series = [
  {
    key: "observed",
    label: "Observed",
    color: "rgba(110, 110, 110, 1)",
    mark: "line",
  },
  {
    key: "rcp45",
    label: "Modeled RCP 4.5 Range",
    color: "rgba(129, 140, 158, 1)",
    mark: "area",
  },
  {
    key: "rcp85",
    label: "Modeled RCP 8.5 Range",
    color: "rgba(129, 140, 158, 1)",
    mark: "area",
  },
];

models.forEach((d) => {
  let label;
  if (d.text) {
    label = `${d.id} (${d.text})`;
  } else {
    label = d.id;
  }
  series.push({
    key: d.id,
    label,
    color: d.color,
    mark: "line",
  });
});

export const seriesList = series;

export const boundaryList = boundaries
  .filter((d) =>
    ["locagrid", "counties", "censustracts", "hydrounits"].includes(d.id)
  )
  .map((d) => {
    let text;
    if (d.id === "locagrid") {
      text = "None";
    } else {
      text = d.metadata.title;
    }
    return { ...d, text };
  });

export const modelList = models.map((d) => {
  let text;
  if (d.text) {
    text = `${d.id} (${d.text})`;
  } else {
    text = d.id;
  }
  return {
    ...d,
    text,
  };
});

export const scenarioList = scenarios.filter((d) =>
  ["rcp45", "rcp85"].includes(d.id)
);

const toolsList = [
  "Annual Averages",
  "Cooling Degree Days and Heating Degree Days",
];
const caladaptTools = tools.filter((tool) => {
  if (toolsList.includes(tool.title)) {
    tool.category = "caladapt";
    return true;
  }
});
export const resources = [
  ...caladaptTools,
  {
    title:
      "Blog Post: Explore warm nights and heat waves with the Extreme Heat Tool on Cal-Adapt",
    category: "help",
    link: "/blog/extreme-heat-tool-updates/",
    icon: "blog",
  },
  {
    title: "Get started with Cal-Adapt",
    category: "help",
    link: "/help/get-started/",
    icon: "get-started",
  },
  {
    title: "Frequently Asked Questions",
    category: "help",
    link: "/help/faqs/",
    icon: "faqs",
  },
  {
    title: "California Heat Assessment Tool",
    link: "https://www.cal-heat.org/",
    category: "other",
    image: "logos/chat.jpg",
    desc: `The California Heat Assessment Tool is a new tool funded by the Fourth 
    Assessment to inform the planning efforts of local public health officials. The tool 
    provides health-informed heat thresholds for communities across California and 
    examines how the frequency and severity of local heat waves are expected to change 
    over time due to climate change.`,
  },
  {
    title: "California's Adaptation Clearinghouse",
    link: "https://resilientca.org",
    category: "other",
    image: "logos/EJ_JRC_ccc_simulation-7094.jpg",
    desc: `The Adaptation Clearinghouse is the State of California’s consolidated searchable 
    database of resources for local, regional and statewide climate adaptation planning 
    and decision-making.`,
  },
  {
    title: "Regional Reports: California's 4th Climate Change Assessment",
    link: "https://www.climateassessment.ca.gov/regions/",
    category: "other",
    image: "logos/ccc4a.jpg",
    desc: `California’s Fourth Climate Change Assessment provides information to 
    build resilience to climate impacts, including temperature, wildfire, water, 
    sea level rise, and governance. The assessment includes reports for nine regions 
    of the state to support action at local and regional scales.`,
  },
];

import {
  LineAreaChart,
  ScatterChart,
  HeatmapChart,
} from "~/components/tools/Charts";
import { AvgRange, MonthTiming } from "~/components/tools/Stats";

export const TOOL_SLUG = "extreme-heat";

export const CLIMATE_VARIABLES = ["tasmax", "tasmin"];
export const CLIMATE_INDICATORS = [
  {
    id: "frequency",
    label: "Frequency",
    title: "Number of Extreme Heat Days per Year",
    units: "days/yr",
    decimals: 0,
    chartComponent: LineAreaChart,
    statsComponent: AvgRange,
    description: `<p>The colored lines on this visualization represent 
    a timeseries of number of extreme heat days from individual downscaled GCMs. 
    The historical observed data is represented by 
    a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries.</p>`,
  },
  {
    id: "timing",
    label: "Timing",
    title: "Timing of Extreme Heat Days per Year",
    units: "",
    decimals: 0,
    chartComponent: HeatmapChart,
    statsComponent: MonthTiming,
    description: `<p>This chart shows a heatmap of extreme heat days for an 
    individual GCM or for the historical observed data.</p><p>Click on any of 
    the legend keys to highlight corresponding timeseries.</p>`,
  },
  {
    id: "duration",
    label: "Maximum Duration",
    title: "Longest Stretch of Consecutive Extreme Heat Days per Year",
    units: "days/yr",
    decimals: 1,
    chartComponent: ScatterChart,
    statsComponent: AvgRange,
    description: `<p>The colored dots on this visualization represent 
    the longest stretch of consecutive extreme heat days from individual downscaled GCMs. 
    The historical observed data is represented by 
    a gray dots from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries.</p>`,
  },
  {
    id: "waves",
    label: "Heat Waves",
    title: "Number of Heat Wave Events per Year",
    units: "events/yr",
    decimals: 1,
    chartComponent: ScatterChart,
    statsComponent: AvgRange,
    description: `<p>The colored dots on this visualization represent 
    the number of heat wave events from individual downscaled GCMs. 
    The historical observed data is represented by 
    a gray dots from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries. Change the duration of heat wave event in the Settings panel.</p>`,
  },
];

export const DEFAULT_CLIMATE_VARIABLE = CLIMATE_VARIABLES[0];
export const DEFAULT_CLIMATE_INDICATOR = "frequency";
export const DEFAULT_DURATION = 4;

export const HEATMAP_COLOR_SCALE = ["#fed976", "#fd8d3c", "#e31a1c", "#800026"];

export const DEFAULT_THRESHOLDS = [100, 65];

export const INDICATOR_DESCRIPTION = `
<p>Indicators presented in this tool examine projected trends in four key characteristics of 
Extreme Heat Days and Warm Nights:</p>
<ul>
  <li><strong>Frequency</strong>: The number of Extreme Heat Days/Warm Nights that occur every year.</li>
  <li><strong>Timing</strong>: The length of the season between the first Extreme Heat Day/Warm 
  Night and the last.</li>
  <li><strong>Maximum Duration</strong>: The length of the longest heat wave.</li>
  <li><strong>Heat Waves</strong>: The number of Heat Wave events that occur every year. The duration 
  (number of days) of a Heat Wave event can be set by the user.</li>
</ul>`;

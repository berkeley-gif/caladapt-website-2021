import {
  LineAreaChart,
  ScatterChart,
  HeatmapChart,
  DotAndWhiskerChart,
} from "~/components/tools/Charts";
import { AvgRange, MonthTiming } from "~/components/tools/Stats";

export const TOOL_SLUG = "extreme-precipitation";

export const CLIMATE_VARIABLES = ["pr"];
export const CLIMATE_INDICATORS = [
  {
    id: "intensity",
    label: "Intensity",
    title: "Estimated Intensity of Extreme Precipitation Events",
    units: "",
    decimals: 0,
    chartComponent: DotAndWhiskerChart,
    statsComponent: AvgRange,
    description: `<p>The colored lines on this visualization represent
    a timeseries of number of extreme precipitation events from individual downscaled GCMs.
    The historical observed data is represented by
    a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight
    corresponding timeseries.</p>`,
  },
  {
    id: "frequency",
    label: "Frequency",
    title: "Number of Extreme Precipitation Events per Water Year",
    units: "events/yr",
    decimals: 0,
    chartComponent: LineAreaChart,
    statsComponent: AvgRange,
    description: `<p>The colored lines on this visualization represent 
    a timeseries of number of extreme precipitation events from individual downscaled GCMs. 
    The historical observed data is represented by 
    a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries.</p>`,
  },
  {
    id: "timing",
    label: "Timing",
    title: "Timing of Extreme Precipitation Events per Water Year",
    units: "",
    decimals: 0,
    chartComponent: HeatmapChart,
    statsComponent: MonthTiming,
    description: `<p>This chart shows a heatmap of extreme precipitation events for an 
    individual GCM or for the historical observed data.</p><p>Click on any of 
    the legend keys to highlight corresponding timeseries.</p>`,
  },
  {
    id: "duration",
    label: "Maximum Duration",
    title:
      "Longest Stretch of Consecutive Extreme Precipitation Events per Water Year",
    units: "days/yr",
    decimals: 0,
    chartComponent: ScatterChart,
    statsComponent: AvgRange,
    description: `<p>The colored dots on this visualization represent 
    the longest stretch of consecutive extreme precipitation events from individual downscaled GCMs. 
    The historical observed data is represented by 
    a gray dots from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries.</p>`,
  },
];

export const THRESHOLD_TYPES = [
  {
    id: "max",
    label: "Lowest Annual Max",
  },
  {
    id: "90",
    label: "90th Percentile",
  },
  {
    id: "95",
    label: "95th Percentile",
  },
  {
    id: "99",
    label: "99th Percentile",
  },
];

export const RETURN_PERIODS = [2, 5, 10, 20, 50, 100];

export const DEFAULT_CLIMATE_VARIABLE = "pr";
export const DEFAULT_CLIMATE_INDICATOR = "intensity";
export const DEFAULT_DURATION = 2;
export const DEFAULT_THRESHOLD_TYPE = "max";
export const DEFAULT_RETURN_PERIOD = 20;

export const HEATMAP_COLOR_SCALE = ["#19cdbb", "#368ce1", "#6d41ab"];

export const INDICATOR_DESCRIPTION = `
<p>Indicators presented in this tool examine projected trends in four key characteristics of 
Extreme Precipitation Events:</p>
<ul>
  <li><strong>Frequency</strong>: The number of Extreme Precipitation Events that occur every year.</li>
  <li><strong>Timing</strong>: The length of the season between the first Extreme Heat Day/Warm 
  Night and the last.</li>
  <li><strong>Maximum Duration</strong>: The length of the longest heat wave.</li>
</ul>`;

export const THRESHOLD_TYPE_DESCRIPTION = "Describe types of threshold";

export const RETURN_PERIOD_DESCRIPTION = "Describe return periods";

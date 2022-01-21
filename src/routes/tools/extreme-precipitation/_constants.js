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
    description: `<p>The colored dots on this visualization represent
    the estimated intensity (return levels) of extreme precipitation events from individual downscaled GCMs.
    The historical observed data is represented by a gray dot. The width of the whiskers (light gray lines) span 
    the 95% confidence interval.</p><p>Click on any of the legend keys to highlight
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
    units: "events/yr",
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
    id: "ams_low",
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
export const DEFAULT_THRESHOLD_TYPE = "ams_low";
export const DEFAULT_THRESHOLD_PRECISION = 2;
export const DEFAULT_RETURN_PERIOD = 20;
export const DEFAULT_ROLLING_FUNCTION = "sum";
export const DEFAULT_POLYGON_AGGREGATE_FUNCTION = "max";

export const HEATMAP_COLOR_SCALE = ["#19cdbb", "#368ce1", "#6d41ab"];

export const INDICATOR_DESCRIPTION = `
<p>Indicators presented in this tool examine projected trends in four characteristics of 
Extreme Precipitation Events:</p>
<ul>
  <li><strong>Intensity</strong>: The estimated intensity (Return Level) of Extreme Precipitation Events.</li>
  <li><strong>Frequency</strong>: The number of Extreme Precipitation Events per water year.</li>
  <li><strong>Timing</strong>: The length of the season between the first Extreme Precipitation Events and the last.</li>
  <li><strong>Maximum Duration</strong>: The length of the longest stretch of consecutive Extreme Precipitation Events.</li>
</ul>`;

export const THRESHOLD_TYPE_DESCRIPTION = `The extreme threshold sets the conditions for which a precipitation event 
is considered “extreme“. The threshold value is calculated from observed precipitation accumulation in the historical record (1961 to 1990). 
By default, the threshold is set to the Lowest Annual Maximum value. Other alternatives are 90th, 95th and 99th percentiles. 
Selecting too high a threshold (in arid locations) or too low a threshold can decrease the reliability of the estimates.`;

export const RETURN_PERIOD_DESCRIPTION =
  "The Return Period estimates the average time between extreme events. This is sometimes worded as a “1 in x years” event.";

export const DURATION_DESCRIPTION =
  "Event duration is the number of days over which precipitation falls that contribute to a single event. Changing this value will change the extreme threshold.";

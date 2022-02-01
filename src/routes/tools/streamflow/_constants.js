import layers from "~/helpers/mapbox-layers";
import { LineAreaChart } from "~/components/tools/Charts";
import { AvgRange } from "~/components/tools/Stats";
import { DEFAULT_STAT_PERIODS } from "../_common/constants";

export const TOOL_SLUG = "streamflow";

export const DEFAULT_STATION_LAYER = layers.find(
  (d) => d.metadata.title === "Central Valley Subbasins"
);
export const DEFAULT_STATION_ID = 1;

export const CLIMATE_VARIABLES = ["streamflow"];
export const CLIMATE_INDICATORS = [
  {
    id: "annual",
    label: "Annual Total by Months",
    title: "Annual Total Unimpaired Flows",
    units: "cfs",
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
    id: "monthly",
    label: "Monthly Average by Period",
    title: "Monthly Average Unimpaired Flows",
    units: "cfs",
    decimals: 0,
    chartComponent: LineAreaChart,
    statsComponent: AvgRange,
    description: `<p>This chart shows a heatmap of extreme heat days for an 
    individual GCM or for the historical observed data.</p><p>Click on any of 
    the legend keys to highlight corresponding timeseries.</p>`,
  },
];

export const DEFAULT_CLIMATE_VARIABLE = CLIMATE_VARIABLES[0];
export const DEFAULT_CLIMATE_INDICATOR = "monthly";

export const DEFAULT_SELECTED_MONTHS = [2, 3, 4];

export const PERIOD_LIST = DEFAULT_STAT_PERIODS.map((d) => ({
  ...d,
  text: d.label,
}));
export const DEFAULT_SELECTED_PERIOD = "baseline";

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

export const SELECT_STATION_DESCRIPTION = `<p>You can select another weather station on 
the map or search for the nearest station to your area of interest.</p>`;

export const DEFAULT_WATERYEAR = new Date().getUTCFullYear();

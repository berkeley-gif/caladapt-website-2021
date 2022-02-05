import layers from "~/helpers/mapbox-layers";
import { AvgRange, ModelSummary } from "~/components/tools/Stats";
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
    label: "Annual",
    title: "Annual Total Unimpaired Flows",
    units: "cfs",
    decimals: 0,
    statsComponent: AvgRange,
    description: `<p>The colored lines on this visualization represent 
    a timeseries of estimated annual total unimpaired flow for selected months from individual downscaled GCMs for selected months.
    The historical observed data is represented by a gray line from 1950-2006.</p>
    <p>Click on any of the legend keys to highlight corresponding timeseries.</p>`,
  },
  {
    id: "monthly",
    label: "Monthly",
    title: "Average Monthly Unimpaired Flows",
    units: "cfs",
    decimals: 0,
    statsComponent: ModelSummary,
    description: `<p>The colored lines on this visualization represent 
    a monthly average unimpaired flow for selected periods from individual downscaled GCMs.
    The historical observed data is represented by a gray line for the historical period.</p>
    <p>Click on any of the legend keys to highlight corresponding timeseries.</p>`,
  },
];

export const DEFAULT_CLIMATE_VARIABLE = CLIMATE_VARIABLES[0];
export const DEFAULT_CLIMATE_INDICATOR = "annual";
export const DEFAULT_CLIMATE_SCENARIO = "rcp45";

export const DEFAULT_SELECTED_MONTHS = [2, 3, 4];

export const PERIOD_LIST = DEFAULT_STAT_PERIODS.map((d) => ({
  ...d,
  text: d.label,
}));
export const DEFAULT_SELECTED_PERIOD = "baseline";

export const LEARN_MORE_INDICATOR = `
<p>Unimpaired flows are flows that would have been observed in the absence of human activities.</p>
<ul>
  <li><strong>Annual</strong>: The total annual unimpaired flow by water year.</li>
  <li><strong>Monthly</strong>: The monthly average unimpaired flow for a range of water years.</li>
</ul>`;

export const LEARN_MORE_SELECT_MONTH = `<p>Select one or more months to explore the Annual Total Unimpaired Streamflow per water year for those months.</p>`;

export const LEARN_MORE_SELECT_PERIOD = `<p>Select a period to explore observed or projected changes in Monthly Average Streamflow.</p>`;

export const SELECT_STATION_DESCRIPTION = `<p>You can select another streamflow location on 
the map or search for the closest location to your area of interest.</p>`;

export const DEFAULT_WATERYEAR = new Date().getUTCFullYear();

export const DEFAULT_MONTHLY_STAT_GROUPS = [
  {
    id: "observed",
    label: "Historical Runoff Midpoint",
    historical: true,
  },
  {
    id: "modeled-projections",
    label: "Projected Runoff Midpoint",
    historical: false,
  },
];

// The Cal-Adapt API responses are paginated
// This param sets the pagesize to get all features of the monthly timeseries
// 12 months * 151 years = 1812
export const NUM_OF_EVENTS = 1812;

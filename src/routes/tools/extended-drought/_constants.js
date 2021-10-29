export const CLIMATE_VARIABLES = [
  "tasmax",
  "tasmin",
  "pr",
  "et",
  "swe",
  "baseflow",
  "runoff",
];
export const DEFAULT_SELECTED_CLIMVAR = "tasmax";

export const CLIMATE_SCENARIOS = ["early_century", "late_century"];
export const DEFAULT_SELECTED_SCENARIO = "late_century";

export const DEFAULT_MODEL = "HadGEM2-ES";

export const TOOL_SLUG = "extended-drought";

export const LEARN_MORE_YEARLY_PERIOD = `<p>Select a period to view maps showing projected 
changes in monthly Snow Water Equivalent averaged over 10 or 5 years</p>`;

export const EXPLAIN_CHART = `<p>The colored lines on this visualization 
represent a time series of monthly average values of Snow Water Equivalent from 
individual downscaled GCMs. The gray shaded region in the background 
represents the range of projections from all 32 downscaled GCMs. The 
historical observed data is represented by a gray line from 1950-2006.</p><p>
Click on any of the legend keys to highlight corresponding time series.</p>`;

export const TIME_DURATIONS = [
  { id: "A-SEP", label: "Water Year" },
  { id: "A", label: "Calendar Year" },
];
export const DEFAULT_SELECTED_DURATION = "A-SEP";

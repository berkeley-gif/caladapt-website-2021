export const CLIMATE_VARIABLES = [
  "tasmax",
  "tasmin",
  "pr",
  "tair",
  "et",
  "swe",
  "baseflow",
  "runoff",
];
export const DEFAULT_SELECTED_CLIMVAR = "tasmax";
export const CLIMATE_VARIABLES_VIC = [
  "tair",
  "et",
  "swe",
  "baseflow",
  "runoff",
];
export const CLIMATE_VARIABLES_HYDRO = [
  "pr",
  "et",
  "swe",
  "baseflow",
  "runoff",
];

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

export const TIME_PERIODS = [
  { id: "wateryear", label: "Water Year", freq: "A-SEP" },
  { id: "year", label: "Calendar Year", freq: "A" },
];
export const DEFAULT_SELECTED_PERIOD = "wateryear";

export const ENSEMBLES = [
  {
    id: "rcp85_range",
    label: "Modeled RCP 8.5 Range",
    color: "rgba(218, 222, 225, 1)",
    org: "Geospatial Innovation Facility",
  },
];

export const DEFAULT_EMISSION_SCENARIO = "rcp85";

export const DEFAULT_YEARS_BEFORE = 7;
export const DEFAULT_YEARS_AFTER = 6;
export const DEFAULT_BASELINE = [1961, 1990];

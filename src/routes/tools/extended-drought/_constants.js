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

export const TIME_PERIODS = [
  { id: "wateryear", label: "Water Year", freq: "A-SEP" },
  { id: "year", label: "Year", freq: "AS" },
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

export const DEFAULT_STAT_PERIODS = [
  {
    id: "baseline",
    label: "Baseline (1961-1990)",
    start: 1961,
    end: 1990,
    historical: true,
  },
  {
    id: "late_century",
    label: "Late 21st Century Drought (2051–2070)",
    start: 2051,
    end: 2070,
    historical: false,
  },
  {
    id: "early_century",
    label: "Early 21st Century Drought (2023–2042)",
    start: 2023,
    end: 2042,
    historical: false,
  },
];

export const EXPLAIN_CHART = `<p>The colored lines on this visualization 
represent a time series of monthly average values of Snow Water Equivalent from 
individual downscaled GCMs. The gray shaded region in the background 
represents the range of projections from all 32 downscaled GCMs. The 
historical observed data is represented by a gray line from 1950-2006.</p><p>
Click on any of the legend keys to highlight corresponding time series.</p>`;

export const LEARN_MORE_PERIODS = `<p>Select a period to view charts showing projected changes in selected 
climate variables.</p>
<p><strong>Water Year</strong> is the period between October 1st of one year and September 30th of 
the next. The water year is designated by the calendar year in which it ends</p>
<p><strong>Year</strong> is the calendar year between January 1st and December 31st.</p>`;

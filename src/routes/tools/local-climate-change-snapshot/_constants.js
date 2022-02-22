import chroma from "chroma-js";
import { INITIAL_CONFIG } from "../_common/constants";

export const TOOL_SLUG = "local-climate-change-snapshot";

/** Regex can be used to search the Cal-Adapt API to get a list of slugs using
 * Replace the text "indicator" in SLUG_EXP with indicator id before searching.
 * https://api.cal-adapt.org/api/series/?slug_re=^tasmax_(year|month).*ens32
 * https://api.cal-adapt.org/api/series/?slug_re=^tasmax_30y.*ens32
 **/
// This search exp is used to fetch all projected data for an indicator including
// ensemble average, ensemble min & ensemble max
export const DEFAULT_PROJECTIONS_SLUG_EXP = "^indicator_(year|month).*ens32";
// This search exp is used to fetch observed data for an indicator
// Observed data consists of just 1 value per year
export const DEFAULT_OBSERVED_SLUG_EXP = "^indicator_(year|month).*livneh";
export const DEFAULT_SNAPSHOT_SLUG_EXP = "^indicator_30y.*ens32";
// This search exp is used to separate timeseries with ens32avg from ens32min/ens32max
// The envelope/range is created from the ensemble min & max & plotted as area,
// while the ensemble avg is plotted as lines
export const ENVELOPE_SEARCH_EXP = /ens32min|ens32max/;
export const AVERAGE_SEARCH_EXP = /ens32avg/;
/** Chart and Table data for the Area Burned indicator is assembled from the 4 GCMs.
 * There is no ensemble equivalent in the API.
 **/
export const AREABURNED_TIMESERIES_SLUG_EXP = "^fire_year.*bau";

// The list of climate categories and indicators is in content/tools/local-climate-change-snapshot/
export const DEFAULT_CLIMATE_CATEGORY = "temperature";
export const DEFAULT_CLIMATE_INDICATOR = "tasmax";
// Precipitation indicator has values as rates e.g. mm/year
// These should be converted to annual sum by multiplying by number of days in the year
export const INDICATORS_WITH_VALUES_AS_RATES = ["pr"];

export const DEFAULT_INITIAL_CONFIG = {
  ...INITIAL_CONFIG,
  indicator: DEFAULT_CLIMATE_INDICATOR,
};

export const DEFAULT_POLYGON_AGGREGATE_FUNCTION = "mean";
export const AREABURNED_POLYGON_AGGREGATE_FUNCTION = "sum";

export const COLOR_livneh = chroma(110, 110, 110);
export const COLOR_rcp45 = chroma(59, 153, 167);
export const COLOR_rcp85 = chroma(131, 87, 170);
export const COLOR_historical = chroma(170, 144, 60);

export const OBSERVED = [
  {
    id: "livneh",
    label: "Observed",
    color: COLOR_livneh.hex(),
  },
];
export const SERIES = [
  {
    id: "rcp45",
    label: "Medium Emissions (RCP 4.5)",
    color: COLOR_rcp45.hex(),
  },
  {
    id: "rcp85",
    label: "High Emissions (RCP 8.5)",
    color: COLOR_rcp85.hex(),
  },
  {
    id: "historical",
    label: "Modeled Historical",
    color: COLOR_historical.hex(),
  },
];
export const RANGES = [
  {
    id: "rcp45_range",
    label: "Medium Emissions Range",
    color: COLOR_rcp45.alpha(0.3).hex(),
  },
  {
    id: "rcp85_range",
    label: "High Emissions Range",
    color: COLOR_rcp85.alpha(0.3).hex(),
  },
  {
    id: "historical_range",
    label: "Modeled Historical Range",
    color: COLOR_historical.alpha(0.3).hex(),
  },
];

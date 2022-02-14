import { INITIAL_CONFIG } from "../_common/constants";

export const TOOL_SLUG = "local-climate-change-snapshot";

/** Regex can be used to search the Cal-Adapt API to get a list of slugs using
 * Replace the text "indicator" in SLUG_EXP with indicator id before searching.
 * https://api.cal-adapt.org/api/series/?slug_re=^tasmax_(year|month).*ens32
 * https://api.cal-adapt.org/api/series/?slug_re=^tasmax_30y.*ens32
 **/
export const DEFAULT_TIMESERIES_SLUG_EXP = "^indicator_(year|month).*ens32";
export const DEFAULT_SNAPSHOT_SLUG_EXP = "^indicator_30y.*ens32";

/** Chart and Table data for the Area Burned indicator is assembled from the 4 GCMs.
 * There is no ensemble equivalent in the API.
 **/
export const AREABURNED_TIMESERIES_SLUG_EXP = "^fire_year.*bau";

export const SERIES = [
  {
    id: "observed",
    label: "Observed",
    color: "rgba(110, 110, 110, 1)",
    org: "University of Colorado Boulder",
  },
  {
    id: "rcp45",
    label: "Medium Emissions (RCP 4.5)",
    color: "rgba(59, 153, 167, 1)",
    org: "Geospatial Innovation Facility",
  },
  {
    id: "rcp85",
    label: "High Emissions (RCP 8.5)",
    color: "rgba(131, 87, 170, 1)",
    org: "Geospatial Innovation Facility",
  },
  {
    id: "historical",
    label: "Modeled Historical",
    color: "rgba(170, 144, 60, 1)",
    org: "Geospatial Innovation Facility",
  },
];

// The list of climate categories and indicators is in content/tools/local-climate-change-snapshot/
export const DEFAULT_CLIMATE_CATEGORY = "temperature";
export const DEFAULT_CLIMATE_INDICATOR = "tasmax";

export const DEFAULT_INITIAL_CONFIG = {
  ...INITIAL_CONFIG,
  indicator: DEFAULT_CLIMATE_INDICATOR,
};

export const DEFAULT_POLYGON_AGGREGATE_FUNCTION = "mean";
export const AREABURNED_POLYGON_AGGREGATE_FUNCTION = "sum";

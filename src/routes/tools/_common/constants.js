import { range } from "d3-array";
import { timeFormat } from "d3-time-format";

import { MODELED_FUTURE_PROJECTIONS_YEAR } from "~/helpers/app-constants";

import models from "~/helpers/climate-models";
import scenarios from "~/helpers/climate-scenarios";
import boundaries from "~/helpers/mapbox-layers";

export const DEFAULT_LOCATION = {
  id: 37907,
  title: "LOCA Grid Cell 38.59375, -121.46875",
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-121.5, 38.625],
        [-121.4375, 38.625],
        [-121.4375, 38.5625],
        [-121.5, 38.5625],
        [-121.5, 38.625],
      ],
    ],
  },
  center: [-121.4688, 38.5938],
  bbox: [-121.5, 38.5625, -121.4375, 38.625],
};

export const DEFAULT_LOCAGRIDCELL_TITLE = "LOCA Grid Cell";

export const DEFAULT_SCENARIOS = scenarios.filter((d) =>
  ["rcp45", "rcp85"].includes(d.id)
);

export const DEFAULT_BOUNDARIES = boundaries
  .filter((d) => d.metadata.group === "Boundaries")
  .map((d) => {
    return {
      ...d,
      label: d.id === "locagrid" ? "None" : d.metadata.title,
    };
  });

export const PERMITTED_BOUNDARY_TYPES = new Set(
  DEFAULT_BOUNDARIES.map((d) => d.id)
);

export const SMALL_SCALE_BOUNDARIES = boundaries
  .filter((d) =>
    [
      "locagrid",
      "counties",
      "censustracts",
      "hydrounits",
      "place",
      "cdistricts",
    ].includes(d.id)
  )
  .map((d) => {
    return {
      ...d,
      label: d.id === "locagrid" ? "None" : d.metadata.title,
    };
  });

export const PRIORITY_10_MODELS = models.map((d) => {
  return {
    ...d,
    label: d.text,
  };
});

export const PRIORITY_4_MODELS = models
  .filter((d) => d.priority)
  .map((d) => {
    return {
      ...d,
      label: d.text,
    };
  });

export const ENSEMBLES = [
  {
    id: "rcp45_range",
    label: "Modeled RCP 4.5 Range",
    color: "rgba(218, 222, 225, 1)",
    org: "Geospatial Innovation Facility",
  },
  {
    id: "rcp85_range",
    label: "Modeled RCP 8.5 Range",
    color: "rgba(218, 222, 225, 1)",
    org: "Geospatial Innovation Facility",
  },
];

export const OBSERVED = [
  {
    id: "livneh",
    label: "Observed",
    color: "rgba(110, 110, 110, 1)",
    org: "University of Colorado Boulder",
  },
];

// For livneh, typically we remove data values after 2006
// because there are QA/QC issues with the data
export const OBSERVED_FILTER_YEAR = MODELED_FUTURE_PROJECTIONS_YEAR;

export const INITIAL_CONFIG = {
  boundary: "locagrid",
  scenario: "rcp45",
  climvar: "tasmax",
  models: ["HadGEM2-ES", "CNRM-CM5", "CanESM2", "MIROC5"],
  lat: 38.58,
  lng: -121.46,
  fid: 37907,
  imperial: true,
};

export const MONTHS_LIST = range(0, 12).map((d) => ({
  id: parseInt(d),
  text: timeFormat("%B")(new Date(2020, d, 1)),
}));

export const SELECT_LOCATION_DESCRIPTION = `<p>Change location 
to get data for your area of interest. You can get data for 
a grid cell or aggregate data over a boundary e.g. county boundary.
You can also upload your own boundary for 
spatial aggregation (see <a href="/help/faqs/can-i-get-data-for-my-aoi/"
target="_blank">FAQs</a>)</p>`;

export const DEFAULT_STAT_GROUPS = [
  {
    id: "modeled-historical",
    label: "Modeled Historical",
    historical: true,
  },
  {
    id: "observed",
    label: "Observed Historical",
    historical: true,
  },
  {
    id: "modeled-projections",
    label: "Future Projections",
    historical: false,
  },
];

export const DEFAULT_STAT_PERIODS = [
  {
    id: "baseline",
    label: "Baseline (1961-1990)",
    start: 1961,
    end: 1990,
    historical: true,
  },
  {
    id: "mid-century",
    label: "Mid-Century (2035-2064)",
    start: 2035,
    end: 2064,
    historical: false,
  },
  {
    id: "end-century",
    label: "End-Century (2070-2099)",
    start: 2070,
    end: 2099,
    historical: false,
  },
];

export const DEFAULT_COMPASS_QUADRANTS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];
export const DEFAULT_COMPASS_QUADRANT_ANGLE = 22.5;

export const DEFAULT_X_MIN = new Date(Date.UTC(1950, 0, 1));
export const DEFAULT_X_MAX = new Date(Date.UTC(2099, 0, 1));
export const DEFAULT_Y_MIN = 0;
export const DEFAULT_Y_MAX = 10;

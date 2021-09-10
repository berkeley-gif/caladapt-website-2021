import models from "~/helpers/climate-models";
import scenarios from "~/helpers/climate-scenarios";
import boundaries from "~/helpers/mapbox-layers";

export const DEFAULT_LOCATION = {
  id: "37907",
  title: "240 32nd Street, Sacramento, California 95816",
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

export const DEFAULT_SCENARIOS = scenarios.filter((d) =>
  ["rcp45", "rcp85"].includes(d.id)
);

export const ALL_BOUNDARIES = boundaries
  .filter((d) => d.metadata.group === "Boundaries")
  .map((d) => {
    let label;
    if (d.id === "locagrid") {
      label = "None";
    } else {
      label = d.metadata.title;
    }
    return { ...d, label };
  });

export const SMALL_BOUNDARIES = boundaries
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
    let label;
    if (d.id === "locagrid") {
      label = "None";
    } else {
      label = d.metadata.title;
    }
    return { ...d, label };
  });

export const PRIORITY_10_MODELS = models.map((d) => {
  let label;
  if (d.text) {
    label = `${d.id} (${d.text})`;
  } else {
    label = d.id;
  }
  return {
    ...d,
    label,
  };
});

export const PRIORITY_4_MODELS = models
  .filter((d) => d.priority)
  .map((d) => {
    let label;
    if (d.text) {
      label = `${d.id} (${d.text})`;
    } else {
      label = d.id;
    }
    return {
      ...d,
      label,
    };
  });

export const ENSEMBLES = [
  {
    id: "rcp45",
    label: "Modeled RCP 4.5 Range",
    color: "rgba(218, 222, 225, 1)",
    org: "Geospatial Innovation Facility",
  },
  {
    id: "rcp85",
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

export const INITIAL_CONFIG = {
  boundaryId: "locagrid",
  scenarioId: "rcp45",
  climvarId: "tasmax",
  modelIds: "HadGEM2-ES,CNRM-CM5,CanESM2,MIROC5",
  lat: 38.58,
  lng: -121.46,
};

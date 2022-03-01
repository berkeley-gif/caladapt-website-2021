export const DL_Cosmos = "cosmos";
export const DL_Calflod5m = "calflod3dtfs_5m";
export const DL_Calflod50m = "calflod3dtfs_50m";

export const VISIBLE = "visible";
export const NONE = "none";

export const LAYER_COLORS = new Map([
  ["rsgreen", "#5DFA25"],
  ["rsblue", "#25C7FA"],
]);

export const DEFAULT_FLOOD_SCENARIO = "med";
export const DEFAULT_TIME_FRAME = "[2020,2040]";
export const DEFAULT_MAP_BBOX = [-122.9204, 37.5257, -121.5595, 38.1288];

export const DEFAULT_MAP_LNG = -122.24;
export const DEFAULT_MAP_LAT = 37.8279;
export const DEFAULT_MAP_ZOOM = 9;

export const DEFAULT_MAP_VIEW = {
  lng: DEFAULT_MAP_LNG,
  lat: DEFAULT_MAP_LAT,
  zoom: DEFAULT_MAP_ZOOM,
  bbox: DEFAULT_MAP_BBOX,
};

export const DATA_LAYERS = [
  {
    id: DL_Cosmos,
    label: "CoSMoS",
    checked: true,
    disabled: false,
    color: "rsgreen", // #5DFA25
  },
  {
    id: DL_Calflod5m,
    label: "CalFloD3D-TFS (5m)",
    checked: true,
    disabled: false,
    color: "rsblue", // #25C7FA
  },
  {
    id: DL_Calflod50m,
    label: "CalFloD3D-TFS (50m)",
    checked: true,
    disabled: false,
    color: "rsblue", // #25C7FA
  },
];

export const DEFAULT_INITIAL_CONFIG = {
  floodScenario: DEFAULT_FLOOD_SCENARIO,
  timeFrame: DEFAULT_TIME_FRAME,
  dataLayers: DATA_LAYERS,
  ...DEFAULT_MAP_VIEW,
};

export const TIME_PERIODS = [
  {
    id: "[2020,2040]",
    label: "2020–2040",
  },
  {
    id: "[2080,2100]",
    label: "2080–2100",
  },
];

export const FLOOD_SCENARIOS = [
  {
    id: "min",
    label: "minimum",
  },
  {
    id: "med",
    label: "median",
  },
  {
    id: "max",
    label: "maximum",
  },
];

export const RASTER_METADATA = {
  [DL_Calflod5m]: [],
  [DL_Calflod50m]: [],
  [DL_Cosmos]: [],
};

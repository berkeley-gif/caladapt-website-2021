export const DEFAULT_CENTER = [-122.2813, 37.7813];
export const DEFAULT_FLOOD_SCENARIO = "med";
export const DEFAULT_TIME_FRAME = "[2020,2040]";

export const DEFAULT_INITIAL_CONFIG = {
  boundaryId: "locagrid",
  floodScenario: DEFAULT_FLOOD_SCENARIO,
  timeFrame: DEFAULT_TIME_FRAME,
  lng: DEFAULT_CENTER[0],
  lat: DEFAULT_CENTER[1],
  imperial: false,
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
    label: "Minimum",
  },
  {
    id: "med",
    label: "Median",
  },
  {
    id: "max",
    label: "Maximum",
  },
];

export const DATA_LAYERS = [
  {
    id: "cosmos",
    label: "CoSMoS",
    checked: true,
    disabled: false,
    color: "rsgreen",
  },
  {
    id: "calflod3dtfs",
    label: "CalFloD3D-TFS (5m)",
    checked: true,
    disabled: false,
    color: "rsblue",
  },
  {
    id: "calflod3dtfs_50m",
    label: "CalFloD3D-TFS (50m)",
    checked: false,
    disabled: false,
    color: "rsblue",
  },
];

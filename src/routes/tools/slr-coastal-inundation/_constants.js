import { DEFAULT_BOUNDARIES } from "../_common/constants";

export const DEFAULT_CENTER = [-122.2813, 37.7813];
export const DEFAULT_FLOOD_SCENARIO = "med";
export const DEFAULT_TIME_FRAME = "[2020,2040]";

export const DEFAULT_INITIAL_CONFIG = {
  boundaryId: "place",
  floodScenario: DEFAULT_FLOOD_SCENARIO,
  timeFrame: DEFAULT_TIME_FRAME,
  lng: DEFAULT_CENTER[0],
  lat: DEFAULT_CENTER[1],
  imperial: false,
};

export const BOUNDARIES = DEFAULT_BOUNDARIES.filter((d) =>
  ["counties", "censustracts", "hydrounits", "place"].includes(d.id)
);

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

export const DL_Cosmos = "cosmos";
export const DL_Calflod5m = "calflod3dtfs";
export const DL_Calflod50m = "calflod3dtfs_50m";

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
    checked: false,
    disabled: false,
    color: "rsblue", // #25C7FA
  },
];
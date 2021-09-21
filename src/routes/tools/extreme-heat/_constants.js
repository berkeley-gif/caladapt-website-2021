import {
  LineAreaChart,
  ScatterChart,
  HeatmapChart,
} from "~/components/tools/Charts";
import { RangeAvg, MonthsCount } from "~/components/tools/Stats";

export const TOOL_SLUG = "extreme-heat";

export const CLIMATE_VARIABLES = ["tasmax", "tasmin"];
export const CLIMATE_INDICATORS = [
  {
    id: "frequency",
    label: "Frequency",
    title: "Number of Extreme Heat Days per Year",
    units: "days/yr",
    decimals: 0,
    chartComponent: LineAreaChart,
    statsComponent: RangeAvg,
  },
  {
    id: "timing",
    label: "Timing",
    title: "Timing of Extreme Heat Days per Year",
    units: "",
    decimals: 0,
    chartComponent: HeatmapChart,
    statsComponent: MonthsCount,
  },
  {
    id: "duration",
    label: "Duration",
    title: "Longest Stretch of Consecutive Extreme Heat Days per Year",
    units: "days/yr",
    decimals: 1,
    chartComponent: ScatterChart,
    statsComponent: RangeAvg,
  },
  {
    id: "waves",
    label: "Heat Waves",
    title: "Number of Heat Wave Events per Year",
    units: "events/yr",
    decimals: 1,
    chartComponent: ScatterChart,
    statsComponent: RangeAvg,
  },
];

export const DEFAULT_CLIMATE_VARIABLE = CLIMATE_VARIABLES[0];
export const DEFAULT_CLIMATE_INDICATOR = "frequency";
export const DEFAULT_DURATION = 4;

import { range } from "d3-array";
import { timeFormat } from "d3-time-format";

export const DEFAULT_CLIMVAR = "fire";
export const DEFAULT_CENTER = [-122.46, 38.59];
export const DEFAULT_SELECTED_MONTH = 7;
export const DEFAULT_SELECTED_PERIOD = "year";
export const DEFAULT_SELECTED_YEAR = 1960;
export const DEFAULT_SELECTED_MODEL_SINGLE = "CanESM2";

export const TOOL_SLUG = "wildfire";

export const LEARN_MORE_SELECT_MONTH = `<p>Select a month to explore the monthly simulation of Area Burned or Decadal Wildfire Probability for that month.</p>`;

export const LEARN_MORE_YEARLY_PERIOD = `<p>View data averaged over a year or individual month.</p>`;

export const LEARN_MORE_TIME_SLIDER = `<p>Drag the slider to view maps showing projected changes in annual/monthly simulations of average Area Burned averaged over 10 years or annual/monthly simulations of Decadal Fire probability, for selected month, GCM, and scenario. You can also use the Play/Pause button to autoplay the animation.</p>`;

export const EXPLAIN_CHART = `<p>The colored lines on this visualization represent a time series of annual/monthly simulations of average Area Burned/Decadal Wildfire Probability from individual downscaled GCMs.</p><p>Click on any of the legend keys to highlight corresponding time series.</p>`;

export const MISSING_DATA_MSG = `This area may contain locations outside the combined fire state and federal protection responsibility areas. 
Locations outside the combined fire state and federal protection responsibility areas were excluded from these wildfire simulations and have no climate projections.`;
export const NO_DATA_MSG = `No data is available for this area. Locations outside the combined fire state and federal protection responsibility areas were excluded from these wildfire simulations and have no climate projections.`;

export const TIME_PERIODS = [
  { id: "year", label: "Annually" },
  { id: "month", label: "Monthly" },
];

export const CLIMATE_VARIABLES = [
  {
    id: "fire",
    label: "Modeled area burned",
  },
  {
    id: "fireprob",
    label: "Decadal wildfire probability",
  },
];

export const MONTHS_LIST_ONE_INDEXED = range(0, 12).map((d) => ({
  id: d + 1,
  label: timeFormat("%B")(new Date(new Date().getUTCFullYear(), d, 1, 0, 0, 0)),
}));

export const DEFAULT_OVERLAY_BOUNDS = [
  [-124.5625, 42.75],
  [-113.75, 42.75],
  [-113.75, 31.5625],
  [-124.5625, 31.5625],
];

export const colorRampFire = [
  "#ffffcc",
  "#fed976",
  "#fd8d3c",
  "#e31a1c",
  "#800026",
];
export const colorRampFireprob = [
  "#f7f4f9",
  "#d4b9da",
  "#df65b0",
  "#ce1256",
  "#67001f",
];

export const colorValuesFire = [1, ...range(25, 101, 25)];
export const colorValuesFireprob = [0.1, ...range(0.25, 1.1, 0.25)];

import { range } from "d3-array";
import { timeFormat } from "d3-time-format";

export const DEFAULT_CLIMVAR = "fire";
export const DEFAULT_CENTER = [-122.46, 38.59];
export const DEFAULT_SELECTED_MONTH = 7;
export const DEFAULT_SELECTED_PERIOD = "year";
export const DEFAULT_SELECTED_YEAR = 1960;
export const DEFAULT_SELECTED_MODEL_SINGLE = "CanESM2";

export const TOOL_SLUG = "wildfire";

export const LEARN_MORE_SELECT_MONTH = `<p>Select a month to explore the average [fire/fireprob] per year for that month.</p>`;

export const LEARN_MORE_YEARLY_PERIOD = `<p>Select a period to view maps showing projected changes in monthly [fire/fireprob] averaged over 10 or 5 years</p>`;

export const LEARN_MORE_TIME_SLIDER = `<p>Drag the slider to view maps showing projected changes in monthly [fire/fireprob] averaged over 10 or 5 years for selected month, GCM and scenario. The maps for the period between 1960-2010 display the observed historical monthly [fire/fireprob] for the selected month. You can also use the Play/Pause button to autoplay the animation.</p>`;

export const EXPLAIN_CHART = `<p>The colored lines on this visualization represent a time series of monthly average values of [fire/fireprob] from individual downscaled GCMs. The gray shaded region in the background represents the range of projections from all 32 downscaled GCMs. The historical observed data is represented by a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight corresponding time series.</p>`;

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
export const colorRampFireprob = [];

export const colorValuesFire = [1, ...range(25, 101, 25)];
export const colorValuesFireprob = range(0.1, 1.1, 0.1);

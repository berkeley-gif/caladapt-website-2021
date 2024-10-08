import { range } from "d3-array";
import { timeFormat } from "d3-time-format";

export const DEFAULT_CLIMVAR = "swe";
export const DEFAULT_CENTER = [-119.96, 38.9];
export const DEFAULT_FEATURE_ID = 37118;
export const DEFAULT_SELECTED_MONTH = 4;
export const DEFAULT_SELECTED_DURATION = 10;
export const DEFAULT_SELECTED_YEAR = 1960;
export const DEFAULT_SELECTED_MODEL_SINGLE = "HadGEM2-ES";

export const TOOL_SLUG = "snowpack";

export const LEARN_MORE_SELECT_MONTH = `<p>Select a month to explore the average Snow Water Equivalent per year for that month.</p>`;

export const LEARN_MORE_YEARLY_PERIOD = `<p>Select a period to view maps showing projected changes in monthly Snow Water Equivalent averaged over 10 or 5 years</p>`;

export const LEARN_MORE_TIME_SLIDER = `<p>Drag the slider to view maps showing projected changes in monthly Snow Water Equivalent averaged over 10 or 5 years for selected month, GCM and scenario. The maps for the period between 1960-2010 display the observed historical monthly Snow Water Equivalent for the selected month. You can also use the Play/Pause button to autoplay the animation.</p>`;

export const EXPLAIN_CHART = `<p>The colored lines on this visualization represent a time series of monthly average values of Snow Water Equivalent from individual downscaled GCMs. The gray shaded region in the background represents the range of projections from all 32 downscaled GCMs. The historical observed data is represented by a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight corresponding time series.</p>`;

export const TIME_DURATIONS = [
  { id: 10, label: "Ten years" },
  { id: 5, label: "Five years " },
];

export const MONTHS_LIST_ONE_INDEXED = range(0, 12).map((d) => ({
  id: d + 1,
  label: timeFormat("%B")(new Date(new Date().getUTCFullYear(), d, 1, 0, 0, 0)),
}));

export const colorRamp = [
  "var(--gray-10)",
  "#ffffcc",
  "#d9f0ca",
  "#b3e1c8",
  "#8dd3c7",
  "#67c4c5",
  "#41b6c4",
  "#3a95b8",
  "#3375ac",
  "#2c54a0",
  "#253494",
  "#00001d",
];

export const colorValues = [
  "0-1",
  "1-4",
  "4-8",
  "8-12",
  "12-16",
  "16-20",
  "20-24",
  "24-28",
  "28-32",
  "32-36",
  "36–40",
  ">40",
];

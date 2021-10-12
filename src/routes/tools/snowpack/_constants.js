import { range } from "d3-array";
import { timeFormat } from "d3-time-format";

export const DEFAULT_CLIMVAR = "swe";
export const DEFAULT_CENTER = [-119.96, 38.9];
export const DEFAULT_SELECTED_MONTH = 3;
export const DEFAULT_SELECTED_DURATION = 10;
export const DEFAULT_SELECTED_YEAR = 1960;

export const TOOL_SLUG = "snowpack";

export const LEARN_MORE_SELECT_MONTH = `<p>TODO: something about why selecting a single
month for Snowpack.</p>`;

export const TIME_DURATIONS = [
  { id: 10, label: "Ten years" },
  { id: 5, label: "Five years " },
];

export const MONTHS_LIST_ONE_INDEXED = range(0, 12).map((d) => ({
  id: d + 1,
  label: timeFormat("%B")(new Date(new Date().getFullYear(), d, 1, 0, 0, 0)),
}));

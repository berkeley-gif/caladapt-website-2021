import {
  group,
  groups,
  merge,
  mean,
  rollups,
  min,
  max,
  extent,
} from "d3-array";

// Helpers
import { buildEnvelope, convertAnnualRateToSum } from "../_common/helpers";

// Constants
import { DEFAULT_STAT_PERIODS } from "../_common/constants";
import {
  ENVELOPE_SEARCH_EXP,
  AVERAGE_SEARCH_EXP,
  OBSERVED,
  SERIES,
  RANGES,
  SCENARIOS,
} from "./_constants";

/**
 * Filter data to find timseries that correspond to ensemble min & max
 * Add additional props (e.g. id, color, label, type)
 * Group the ensemble min & max timeseries by id
 * Create a new ensemble timeseries for envelope
 * @param {array} - array of all timeseries
 * @return {array} - ensemble timeseries with min & max values for 3 scenarios (historical, rcp45, rcp85)
 */
export const createRanges = (_data) => {
  const rangeData = _data
    .filter(({ slug }) => slug.search(ENVELOPE_SEARCH_EXP) > 0)
    .map(({ slug, values }) => {
      // id in the RANGES array are in the form "[scenario]_range". The slug
      // only has [scenario] part. So use only part of the id to search
      const props = RANGES.find(({ id }) => slug.includes(id.split("_")[0]));
      return { ...props, type: "area", values };
    });
  // Group the ensemble min & max for each scenario
  const groupByIds = Array.from(group(rangeData, (d) => d.id));
  return groupByIds.map(([groupId, _arrays]) => {
    const values = merge(_arrays.map(({ values }) => values));
    const envelope = buildEnvelope(values);
    // return props common to both ensemble min & max (id, label, color, type)
    // and a new values array
    return {
      ..._arrays[0],
      values: envelope,
    };
  });
};

/**
 * Filter data to find timseries that correspond to ensemble avg
 * Add additional props (e.g. id, color, label, type)
 * @param {array} - array of all timeseries
 * @return {array} - average timeseries for 3 scenarios (historical, rcp45, rcp85)
 */
export const createAverages = (_data) => {
  const avgData = _data.filter(
    ({ slug }) => slug.search(AVERAGE_SEARCH_EXP) > 0
  );
  return avgData.map(({ slug, values }) => {
    const props = SERIES.find(({ id }) => slug.includes(id));
    return { ...props, type: "line", values };
  });
};

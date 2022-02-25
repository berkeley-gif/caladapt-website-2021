import { groups, merge, mean } from "d3-array";

// Helpers
import { buildEnvelope } from "../_common/helpers";

// Constants
import { DEFAULT_STAT_PERIODS } from "../_common/constants";
import {
  ENVELOPE_SEARCH_EXP,
  AVERAGE_SEARCH_EXP,
  OBSERVED,
  SCENARIOS,
  SCENARIO_RANGES,
} from "./_constants";

/**
 * Observed data does not need to be averaged
 * Add extra prop for plotting (type)
 * @param {array} - all observed timeseries
 * @return {array} - all observed timeseries
 */
const createObservedSeries = (_data) => {
  return _data.map((series) => {
    const { slug, ...rest } = series;
    return { ...rest, type: "line" };
  });
};

/**
 * Filter data to find timseries that correspond to ensemble avg
 * Add extra prop for plotting (type)
 * @param {array} - array of all timeseries
 * @return {array} - average timeseries for 3 scenarios (historical, rcp45, rcp85)
 */
const createAverages = (_data) => {
  return _data
    .filter(({ slug }) => slug.search(AVERAGE_SEARCH_EXP) > 0)
    .map((series) => {
      const { slug, ...rest } = series;
      return { ...rest, type: "line" };
    });
};

/**
 * Filter data to find timseries that correspond to ensemble min & max
 * Group the ensemble min & max timeseries by id
 * Create a new ensemble timeseries for envelope
 * Add extra prop for plotting (type)
 * @param {array} - array of all timeseries
 * @return {array} - ensemble timeseries with min & max values for 3 scenarios (historical, rcp45, rcp85)
 */
const createRanges = (_data) => {
  const rangeData = _data.filter(
    ({ slug }) => slug.search(ENVELOPE_SEARCH_EXP) > 0
  );
  // Group the ensemble min & max for each scenario
  const groupByIds = groups(rangeData, (d) => d.id);
  return groupByIds.map(([groupId, _arrays]) => {
    const values = merge(_arrays.map(({ values }) => values));
    const envelope = buildEnvelope(values);
    // Find matching props for scenario range
    // The ranges are plotted as areas and have different id, color & label props
    const props = SCENARIO_RANGES.find(({ id }) => id.includes(groupId));
    return {
      ...props,
      values: envelope,
      type: "area",
    };
  });
};

/**
 * Calculate 30 year average for each scenario & period combination
 * @param {array} scenarios
 * @param {array} periods
 * @return {array} scenario & period combinations that have a valid 30 year avg value
 */
function calc30yAvgByPeriod(series, periods = DEFAULT_STAT_PERIODS) {
  const data = series.map((d) => {
    const { values, id: scenarioId, label: scenarioLabel } = d;
    const dataByPeriods = periods.map((period) => {
      const { id: periodId, label: periodLabel, start, end } = period;
      const filteredValues = values.filter(
        ({ date }) =>
          date.getUTCFullYear() >= start && date.getUTCFullYear() <= end
      );
      let avg = null;
      if (filteredValues.length) {
        avg = mean(filteredValues, (d) => d.value);
      }
      return { periodId, periodLabel, scenarioId, scenarioLabel, avg };
    });
    return [...dataByPeriods];
  });
  return merge(data).filter(({ avg }) => avg !== null);
}

/**
 * Map 30 year extent for each scenario & period combination
 * @param {array} scenarios
 * @param {array} periods
 * @return {array} scenario & period combination that have a valid 30 year extent
 */
function map30yExtentToPeriod(scenarios, periods = DEFAULT_STAT_PERIODS) {
  const data = scenarios.map((d) => {
    const { values, id: scenarioId, label: scenarioLabel } = d;
    const dataByPeriods = periods.map((period) => {
      const { id: periodId, label: periodLabel, start, end } = period;
      const filteredValues = values.filter(
        ({ date }) =>
          date.getUTCFullYear() >= start && date.getUTCFullYear() <= end
      );
      let min = null;
      let max = null;
      if (filteredValues.length && filteredValues.length === 1) {
        min = filteredValues[0].min;
        max = filteredValues[0].max;
      }
      return { periodId, periodLabel, scenarioId, scenarioLabel, min, max };
    });
    return [...dataByPeriods];
  });
  return merge(data).filter(({ min, max }) => min !== null && max !== null);
}

/**
 * Assemble annual timeseries for observed and projections for the the Chart component
 * There are 7 timeseries for all indicators except `fire`
 * `fire` does not have any Observed data
 * 1. Observed
 * 2. Modeled Historical Scenario
 * 3. RCP 4.5 Scenario
 * 4. RCP 8.5 Scenario
 * 5. Modeled Historical Scenario Envelope/Range
 * 6. RCP 4.5 Scenario Envelope/Range
 * 7. RCP 8.5 Scenario Envelope/Range
 **/
export function getDataForChart(_data) {
  const { observed, projections } = _data;
  const observedSeries = createObservedSeries(observed);
  const averages = createAverages(projections);
  const ranges = createRanges(projections);
  return [...observedSeries, ...averages, ...ranges];
}

/**
 * Calculate 30 year stats for observed and ensemble projections by period.
 * This data is used for the Table component.
 * There are 6 possible scenario & period combinations that have valid values
 * except `fire` which does not have any Observed data:
 * 1. Observed & Baseline Period
 * 2. Modeled Historical Scenario & Baseline Period
 * 3. RCP 4.5 Scenario & Mid-Century Period
 * 4. RCP 4.5 Scenario & End-Century Period
 * 5. RCP 8.5 Scenario & Mid-Century Period
 * 6. RCP 8.5 Scenario & End-Century Period
 *
 * The 30 year stats calculated are:
 * avg - average
 * change - change from modeled baseline
 * min - 30 year minimum
 * max - 30 year maximum
 *
 * Calculation method for all indicators except `fire`:
 * avg - 30 year average is calculated using ensemble average values
 * change - change is difference of average from modeled baseline average
 * min - 30 year minimum is pre-calculated and fetched from the API
 * max - 30 year maximum is pre-calculated and fetched from the API
 *
 * Calculation method for `fire`:
 * avg - 30 year average is calculated using ensemble average values
 * change - change is difference of average from modeled baseline average
 * min - 30 year minimum is pre-calculated and fetched from the API
 * max - 30 year maximum is pre-calculated and fetched from the API
 **/
export function getDataForSnapshot(_data) {
  const { observed, projections, projections30y } = _data;

  //** Calculate 30 year average for #1
  // There is no change, min or max for observed data
  const observedStats = calc30yAvgByPeriod(observed);

  //** Calculate 30 year stats for #2-#6
  // Get the annual ensemble average for each scenario
  const ensembleAverages = projections.filter(
    ({ slug }) => slug.search(AVERAGE_SEARCH_EXP) > 0
  );
  // Calculate 30 year average
  const data30yAvg = calc30yAvgByPeriod(ensembleAverages);

  // Create ensemble range for each scenario
  // using 30 year pre-calculated extents from the API
  const ensembleRanges = createRanges(projections30y);
  // Map 30 year pre-calculated extents for each scenario to the periods
  const data30yExtents = map30yExtentToPeriod(ensembleRanges);

  // Find the modeled baseline 30 year average (combination #2)
  const modeledBaseline = data30yAvg.find(
    ({ periodId }) => periodId === "baseline"
  );
  // Combine the 30y avg & 30y extent
  // Calculate change from baseline by subtracting 30 year average for each combination
  // The change from baseline value for combination #2 will obviously be 0. This is represented by
  // a "-" in the Snapshot table.
  const projectionStats = data30yAvg.map((d) => {
    const { scenarioId, periodId, avg } = d;
    const change = modeledBaseline ? avg - modeledBaseline.avg : null;
    const match = data30yExtents.find(
      (c) => c.scenarioId.includes(scenarioId) && c.periodId === periodId
    );
    return { ...match, ...d, change };
  });
  return [...observedStats, ...projectionStats];
}

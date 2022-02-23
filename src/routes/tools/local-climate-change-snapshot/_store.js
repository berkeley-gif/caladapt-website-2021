import { writable, derived } from "svelte/store";
import { makeCustomWritableStore } from "../_common/stores";
import { calc30yAvgByPeriod, map30yExtentByPeriod } from "./_data";

export const categoryListStore = writable(null);
export const indicatorListStore = writable(null);
export const indicatorStore = writable(null);

const DATA = { observed: null, projections: null, projections30y: null };

/**
 * This custom dataStore stores the following data:
 * observed = annual livneh timeseries
 * projections = annual ensembles for
 * 		1. Modeled Historical average & range
 * 		2. RCP 4.5 average & range
 * 		3. RCP 8.5 average & range
 * projections30y = 30 year ensemble extents for
 * 		1. Modeled Historical Mid-Century & End-Century
 * 		2. RCP 4.5 Mid-Century & End-Century
 * 		3. RCP 8.5 Mid-Century & End-Century
 *
 * The data in observed & projections props are used for the Chart.
 * The data in projections30y is used in creating the snapshotProjectionsStore
 **/
export const dataStore = makeCustomWritableStore(DATA, {
  name: "dataStore",
  getters: [
    {
      name: "chartDataStore",
      getter: ($s) => {
        if (!$s.observed || !$s.projections) return null;
        return [...$s.observed, ...$s.projections];
      },
    },
  ],
  updaters: [
    {
      name: "setObserved",
      update: (store) => (_data) =>
        store.update((s) => {
          s.observed = _data;
          return s;
        }),
    },
    {
      name: "setProjections",
      update: (store) => (_data) =>
        store.update((s) => {
          s.projections = _data;
          return s;
        }),
    },
    {
      name: "setProjections30y",
      update: (store) => (_data) =>
        store.update((s) => {
          s.projections30y = _data;
          return s;
        }),
    },
  ],
});

/**
 * Calculate 30 year stats for 3 scenarios and 3 periods for the Snapshot table.
 * There are 5 possible combinations that have valid values:
 * 1. Modeled Historical Scenario & Baseline Period
 * 2. RCP 4.5 Scenario & Mid-Century Period
 * 3. RCP 4.5 Scenario & End-Century Period
 * 4. RCP 8.5 Scenario & Mid-Century Period
 * 5. RCP 8.5 Scenario & End-Century Period
 **/
export const snapshotProjectionsStore = derived(dataStore, ($dataStore) => {
  if (!$dataStore || !$dataStore.projections || !$dataStore.projections30y)
    return;
  // Get the annual ensemble average for each scenario
  const ensembleAverages = $dataStore.projections.filter(
    ({ id }) => !id.includes("range")
  );
  // Calculate 30 year average for the 5 valid scenario & period combinations
  const data30yAvg = calc30yAvgByPeriod(ensembleAverages);
  // Map 30 year extent for each scenario to the periods
  const data30yExtent = map30yExtentByPeriod($dataStore.projections30y);

  // Find the baseline 30 year average (combination #1)
  const baseline = data30yAvg.find(
    ({ scenarioId, periodId }) =>
      scenarioId === "historical" && periodId === "baseline"
  );

  // Combine the 30y avg & 30y extent for the valid combinations
  // Calculate change from baseline by subtracting 30 year average for each combination
  // The change from baseline value for combination #1 will obviously be 0. This is represented by
  // a "-" in the Snapshot table.
  return data30yAvg.map((d) => {
    const { scenarioId, periodId, avg } = d;
    const change = baseline ? avg - baseline.avg : null;
    const match = data30yExtent.find(
      (c) => c.scenarioId.includes(scenarioId) && c.periodId === periodId
    );
    return { ...match, ...d, change };
  });
});

/**
 * Calculate 30 year stats for observed data for the Snapshot Table.
 * There is only 1 possible combination that has valid values:
 * 1. Observed & Baseline Period
 **/
export const snapshotObservedStore = derived(dataStore, ($dataStore) => {
  if (!$dataStore || !$dataStore.observed) return;
  return calc30yAvgByPeriod($dataStore.observed);
});

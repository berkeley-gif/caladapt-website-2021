import { writable, derived } from "svelte/store";
import { makeCustomWritableStore } from "../_common/stores";
import { calcSeries30yAvgByPeriod } from "./_data";

export const categoryListStore = writable(null);
export const indicatorListStore = writable(null);
export const indicatorStore = writable(null);

const DATA = { observed: null, projections: null, projections30y: null };

export const dataStore = makeCustomWritableStore(DATA, {
  name: "dataStore",
  getters: [
    {
      name: "observed",
      getter: ($s) => $s.observed,
    },
    {
      name: "projections",
      getter: ($s) => $s.projections,
    },
    {
      name: "projections30y",
      getter: ($s) => $s.projections30y,
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
 * The Estimated Intensity data consists of return levels and other metrics generated
 * by the API using Peak Over Threshold statistical method for observed/models. These metrics include:
 * - n (number of samples),
 * - ci_lower (lower end of the confidence interval)
 * - ci_upper (upper end of the confidence interval).
 * If any of the observed/models have n < 100 or if any of the confidence intervals are
 * undefined, display a warning message indicating diminished certainty in the estimates.
 **/
export const snapshotProjectionsStore = derived(dataStore, ($dataStore) => {
  if (!$dataStore || !$dataStore.projections) return;
  const ensembleAverages = $dataStore.projections.filter(
    ({ id }) => !id.includes("range")
  );
  return calcSeries30yAvgByPeriod(ensembleAverages);
});

export const snapshotObservedStore = derived(dataStore, ($dataStore) => {
  if (!$dataStore || !$dataStore.observed) return;
  return calcSeries30yAvgByPeriod($dataStore.observed);
});

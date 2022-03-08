import { writable } from "svelte/store";
import { makeCustomWritableStore } from "../_common/stores";
import { getDataForChart, getDataForSnapshot } from "./_helpers";

export const categoryListStore = writable(null);
export const indicatorListStore = writable(null);
export const indicatorStore = writable(null);

/**
 * This custom dataStore stores the following data for all indicators except `fire`:
 * observed = annual timeseries for observed (1)
 * projections = annual timeseries for (9):
 * 		1. Modeled Historical ensemble avg, min, max
 * 		2. RCP 4.5 ensemble avg, min, max
 * 		3. RCP 8.5 ensemble avg, min, max
 * projections30y = 30 year ensemble data for (6):
 * 		1. Modeled Historical min, max
 * 		2. RCP 4.5 min, max
 * 		3. RCP 8.5 min, max
 *
 * For `fire` indicator the data store inlcudes:
 * observed = no data
 * projections = annual timeseries for 4 priority models (4):
 *    1. CNRM-CM5
 *    2. MIROC5
 *    3. CanESM2
 *    4. HadGEM2-ES
 * projections30y = no data
 *
 * isEnsemble is true for all indicators except `fire`
 **/
const DATA = {
  observed: null,
  projections: null,
  projections30y: null,
  isEnsemble: true,
};

export const dataStore = makeCustomWritableStore(DATA, {
  name: "dataStore",
  getters: [
    {
      name: "chartDataStore",
      getter: ($s) => {
        if (!$s.observed || !$s.projections) return null;
        return getDataForChart($s, $s.isEnsemble);
      },
    },
    {
      name: "snapshotDataStore",
      getter: ($s) => {
        if (!$s.projections || !$s.projections30y) return null;
        return getDataForSnapshot($s, $s.isEnsemble);
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
    {
      name: "setEnsembleFlag",
      update: (store) => (bool) =>
        store.update((s) => {
          s.isEnsemble = bool;
          return s;
        }),
    },
  ],
});

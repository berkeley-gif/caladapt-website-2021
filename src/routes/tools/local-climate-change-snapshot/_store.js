import { writable } from "svelte/store";
import { makeCustomWritableStore } from "../_common/stores";

export const categoryListStore = writable(null);
export const indicatorListStore = writable(null);
export const indicatorStore = writable(null);

export const snapshotStore = writable(null);

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

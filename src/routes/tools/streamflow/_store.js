import { writable } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  CLIMATE_VARIABLES,
  CLIMATE_INDICATORS,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_CLIMATE_INDICATOR,
  DEFAULT_SELECTED_MONTHS,
} from "./_constants";
import { makeCustomWritableStore } from "../_common/stores";
import { DEFAULT_STAT_PERIODS } from "../_common/constants";
import {
  filterDataByMonths,
  aggregateMonthlyData,
  filterDataByPeriod,
  aggregateMonthlyData2,
} from "./_data";

// List of climvars used in Annual Averages Tool
export const climvarList = climvars
  .filter((d) => CLIMATE_VARIABLES.includes(d.id))
  .map((d) => {
    const title = `${d.label}`;
    return { ...d, title };
  });

export const climvarStore = makeCustomWritableStore(DEFAULT_CLIMATE_VARIABLE, {
  name: "climvarStore",
  getters: [
    {
      name: "climvar",
      getter: ($s) => climvars.find((d) => d.id === $s),
    },
  ],
});

export const indicatorList = CLIMATE_INDICATORS;

export const indicatorStore = makeCustomWritableStore(
  DEFAULT_CLIMATE_INDICATOR,
  {
    name: "indicatorStore",
    getters: [
      {
        name: "indicator",
        getter: ($s) => indicatorList.find((d) => d.id === $s),
      },
    ],
  }
);

export const selectedMonthsStore = writable(DEFAULT_SELECTED_MONTHS);

const DATA = { events: null, monthIds: DEFAULT_SELECTED_MONTHS };

export const dataStore = makeCustomWritableStore(DATA, {
  name: "dataStore",
  getters: [
    {
      name: "events",
      getter: ($s) => $s.events,
    },
    {
      name: "annual",
      getter: ($s) => {
        if ($s.events && $s.monthIds) {
          return aggregateMonthlyData(
            filterDataByMonths($s.events, $s.monthIds)
          );
        }
      },
    },
    {
      name: "monthly",
      getter: ($s) => {
        if ($s.events) {
          return aggregateMonthlyData2(
            filterDataByPeriod($s.events, 1961, 1990)
          );
        }
      },
    },
  ],
  updaters: [
    {
      name: "setEvents",
      update: (store) => (_data) =>
        store.update((s) => {
          s.events = _data;
          return s;
        }),
    },
    {
      name: "setMonths",
      update: (store) => (_monthIds) =>
        store.update((s) => {
          s.monthIds = _monthIds;
          return s;
        }),
    },
  ],
});

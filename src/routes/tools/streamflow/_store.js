import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import {
  CLIMATE_VARIABLES,
  CLIMATE_INDICATORS,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_CLIMATE_INDICATOR,
  DEFAULT_SELECTED_MONTHS,
  DEFAULT_SELECTED_PERIOD,
  PERIOD_LIST,
} from "./_constants";
import { makeCustomWritableStore } from "../_common/stores";

import {
  filterDataByMonths,
  sumMonthlyDataByWaterYear,
  filterDataByPeriod,
  averageMonthlyDataByPeriod,
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

export const selectedPeriodStore = writable(DEFAULT_SELECTED_PERIOD);

// export const selectedPeriodStore = makeCustomWritableStore(DEFAULT_SELECTED_PERIOD, {
//   name: "selectedPeriodStore",
//   getters: [
//     {
//       name: "period",
//       getter: ($s) => PERIOD_LIST.find((d) => d.id === $s),
//     },
//   ],
// });

export const dataStore = makeCustomWritableStore(
  { events: null },
  {
    name: "dataStore",
    getters: [
      {
        name: "events",
        getter: ($s) => $s.events,
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
    ],
  }
);

// Total annual streamflow
export const totalAnnual = derived(
  [dataStore, selectedMonthsStore],
  ([$dataStore, $selectedMonthsStore]) => {
    if (!$dataStore.events || !$selectedMonthsStore) return null;
    return sumMonthlyDataByWaterYear(
      filterDataByMonths($dataStore.events, $selectedMonthsStore)
    );
  }
);

// Total annual streamflow
export const averageMonthly = derived(
  [dataStore, selectedPeriodStore],
  ([$dataStore, $selectedPeriodStore]) => {
    console.log("from store", $dataStore, $selectedPeriodStore);
    if (!$dataStore.events || !$selectedPeriodStore) return null;
    const period = PERIOD_LIST.find(({ id }) => id === $selectedPeriodStore);
    console.log(period);
    return averageMonthlyDataByPeriod(
      filterDataByPeriod($dataStore.events, period.start, period.end)
    );
  }
);

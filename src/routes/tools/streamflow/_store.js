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
import { makeCustomWritableStore, dataStore } from "../_common/stores";

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

export const selectedPeriodStore = makeCustomWritableStore(
  DEFAULT_SELECTED_PERIOD,
  {
    name: "selectedPeriodStore",
    getters: [
      {
        name: "period",
        getter: ($s) => PERIOD_LIST.find((d) => d.id === $s),
      },
    ],
  }
);

// Calculate total annual streamflow for selected months
export const totalAnnual = derived(
  [dataStore, selectedMonthsStore],
  ([$dataStore, $selectedMonthsStore]) => {
    if (!$dataStore || !$selectedMonthsStore) return null;
    return sumMonthlyDataByWaterYear(
      filterDataByMonths($dataStore, $selectedMonthsStore)
    );
  }
);

// Calculate average monthly streamflow for selected period
export const averageMonthly = derived(
  [dataStore, selectedPeriodStore],
  ([$dataStore, $selectedPeriodStore]) => {
    if (!$dataStore || !$selectedPeriodStore) return null;
    const period = PERIOD_LIST.find(({ id }) => id === $selectedPeriodStore);
    return averageMonthlyDataByPeriod(
      filterDataByPeriod($dataStore, period.start, period.end)
    );
  }
);

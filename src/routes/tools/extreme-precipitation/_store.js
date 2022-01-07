import { writable, derived } from "svelte/store";
import climvars from "~/helpers/climate-variables";
import { makeCustomWritableStore } from "../_common/stores";
import {
  CLIMATE_INDICATORS,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_CLIMATE_INDICATOR,
  DEFAULT_DURATION,
  DEFAULT_RETURN_PERIOD,
  DEFAULT_THRESHOLD_TYPE,
} from "./_constants";

import {
  calcHeatwaveCount,
  calcMaxDuration,
  calcEventsCount,
  groupEventsByWaterYear,
} from "./_data";

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

export const thresholdStore = writable(null);

export const thresholdTypeStore = writable(DEFAULT_THRESHOLD_TYPE);

export const durationStore = writable(DEFAULT_DURATION);

export const returnPeriodStore = writable(DEFAULT_RETURN_PERIOD);

const DATA = { intensity: null, events: null, eventsByYear: null };

export const dataStore = makeCustomWritableStore(DATA, {
  name: "dataStore",
  getters: [
    {
      name: "intensity",
      getter: ($s) => $s.intensity,
    },
    {
      name: "events",
      getter: ($s) => $s.events,
    },
    {
      name: "frequency",
      getter: ($s) =>
        $s.eventsByYear
          ? $s.eventsByYear.map((series) => calcEventsCount(series))
          : null,
    },
    {
      name: "duration",
      getter: ($s) =>
        $s.eventsByYear
          ? $s.eventsByYear.map((series) => calcMaxDuration(series))
          : null,
    },
  ],
  updaters: [
    {
      name: "setIntensity",
      update: (store) => (_data) =>
        store.update((s) => {
          s.intensity = _data;
          return s;
        }),
    },
    {
      name: "setEvents",
      update: (store) => (_data) =>
        store.update((s) => {
          s.events = _data;
          s.eventsByYear = _data.map((series) =>
            groupEventsByWaterYear(series)
          );
          return s;
        }),
    },
  ],
});

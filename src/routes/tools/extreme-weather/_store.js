import { writable, derived, readable } from "svelte/store";
import { timeFormat } from "d3-time-format";
import { timeDay } from "d3-time";
import { format } from "d3-format";
import { quantile, sort, extent } from "d3-array";
import climvars from "~/helpers/climate-variables";
import {
  CLIMATE_VARIABLES,
  DEFAULT_CLIMATE_VARIABLE,
  DEFAULT_PERCENTILES,
  DEFAULT_SELECTED_DAY,
  DEFAULT_STATION,
  DEFAULT_THRESHOLD,
} from "./_constants";
import { closest } from "~/helpers/utilities";

const textFormat = timeFormat("%B %e");
const dateFormat = timeFormat("%B %-e, %Y");
const formatFn = format(".1f");

function formatRecord(d) {
  return {
    value: `${formatFn(d.value)}`,
    date: dateFormat(d.date),
  };
}

export const climvarList = climvars
  .filter((d) => CLIMATE_VARIABLES.includes(d.id))
  .map((d) => {
    const title = d.label;
    return { ...d, title };
  });

export const climvarStore = (() => {
  const store = writable(DEFAULT_CLIMATE_VARIABLE);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get climvar() {
      return derived(store, ($store) => {
        const selected = climvarList.find((d) => d.id === $store);
        return selected;
      });
    },
  };
})();

export const forecastDate = readable(dateFormat(DEFAULT_SELECTED_DAY));

export const measuredDateRange = readable({
  start: timeFormat("%Y-%m-%d")(timeDay.offset(DEFAULT_SELECTED_DAY, -10)),
  end: timeFormat("%Y-%m-%d")(DEFAULT_SELECTED_DAY),
});

export const unitsStore = writable({ imperial: true });

export const extremesStore = writable("high");

export const doyStore = (() => {
  const store = writable(DEFAULT_SELECTED_DAY);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get doyText() {
      return derived(store, ($store) => {
        return textFormat($store);
      });
    },
    get doyRange() {
      return derived(store, ($store) => {
        const dateStart = timeDay.offset($store, -10);
        const dateEnd = timeDay.offset($store, +10);
        return [dateStart, dateEnd];
      });
    },
    get doyRangeStart() {
      return derived(store, ($store) => {
        const date = timeDay.offset($store, -10);
        return textFormat(date);
      });
    },
    get doyRangeEnd() {
      return derived(store, ($store) => {
        const date = timeDay.offset($store, +10);
        return textFormat(date);
      });
    },
  };
})();

export const thresholdStore = writable(DEFAULT_THRESHOLD);

export const locationStore = (() => {
  const store = writable(DEFAULT_STATION);
  const { update, subscribe } = store;
  return {
    subscribe,
    updateLocation: (location) =>
      update((store) => {
        if (!location) return;
        store = location;
        return store;
      }),
    get location() {
      return derived(store, ($store) => {
        return $store;
      });
    },
  };
})();

// Data Store for HadISD observations from Cal-Adapt API
export const hadisdStore = (() => {
  const store = writable();
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get hadisdDateRange() {
      return derived(store, ($store) => {
        if (!$store) return null;
        const dateExtent = extent($store.values, (d) => d.date);
        return `${dateExtent[0].getFullYear()}-${dateExtent[1].getFullYear()}`;
      });
    },
    get gevisf() {
      return derived(store, ($store) => {
        if (!$store) return null;
        return $store.returnLevels.gevisf;
      });
    },
  };
})();

export const forecastStore = writable(null);
export const measuredStore = writable(null);

// Data store for list of datasets used in the tool
export const datasetStore = (() => {
  const store = writable([]);
  const { set, subscribe } = store;
  return {
    set,
    subscribe,
    get titles() {
      return derived(store, ($store) => {
        if (!$store || $store.length === 0) return [];
        return $store.map((d) => d.title);
      });
    },
  };
})();

// DERIVED STORES
// Baseline store
export const baseline = derived(
  [doyStore, hadisdStore],
  ([$doyStore, $hadisdStore]) => {
    if (!doyStore || !$hadisdStore) return;
    // Filter by 20 day period around selected date
    const filterBy20DayPeriod = $hadisdStore.values.filter((d) => {
      const date = d.date.setHours(0, 0, 0);
      const year = d.date.getFullYear();
      const center = new Date(year, $doyStore.getMonth(), $doyStore.getDate());
      const left = timeDay.offset(center, -10);
      const right = timeDay.offset(center, 10);
      if (date >= left && date <= right) {
        return true;
      }
      return false;
    });
    // Calculate min max from entire historical record
    // for the 20 day period in each year
    const sorted = sort(filterBy20DayPeriod, (d) => +d.value);
    const recordLow = formatRecord(sorted[0]);
    const recordHigh = formatRecord(sorted[sorted.length - 1]);

    // Filter by baseline period (30 years, e.g. 1991-2020)
    const filteredData = filterBy20DayPeriod.filter((d) => {
      const year = d.date.getFullYear();
      if (year >= 1991 && year <= 2020) {
        return true;
      }
      return false;
    });

    // Calculate percentiles from 30 year data
    const values = filteredData.map((d) => +d.value).sort();
    const stats = DEFAULT_PERCENTILES.map((d) => {
      return {
        percentile: d,
        label: `p${d}`,
        value: +formatFn(quantile(values, d / 100)),
      };
    });

    return {
      values: filteredData,
      low: recordLow,
      high: recordHigh,
      percentiles: stats,
      dataExtent: extent(values),
    };
  }
);

// Threshold Bounds
export const thresholdBound = derived(
  [extremesStore, baseline, thresholdStore],
  ([$extremesStore, $baseline]) => {
    if (!$extremesStore || !$baseline) return null;
    const { percentiles } = $baseline;
    if ($extremesStore === "high") {
      return percentiles.find((d) => d.percentile === 90).value;
    } else {
      return percentiles.find((d) => d.percentile === 10).value;
    }
  }
);

// Threshold Props
export const thresholdProps = derived(
  [extremesStore, thresholdBound, thresholdStore],
  ([$extremesStore, $thresholdBound, $thresholdStore]) => {
    if (!$extremesStore || !$thresholdBound || !$thresholdStore) {
      return {
        invalid: false,
        invalidText: "",
      };
    }
    if ($extremesStore === "high") {
      return {
        invalid: $thresholdStore < $thresholdBound,
        invalidText: `Value must be >= 90th percentile value of ${$thresholdBound}`,
      };
    } else {
      return {
        invalid: $thresholdStore > $thresholdBound,
        invalidText: `Value must be <= 10th percentile value of ${$thresholdBound}`,
      };
    }
  }
);

export const thresholdExceedances = derived(
  [extremesStore, baseline, thresholdStore],
  ([$extremesStore, $baseline, $thresholdStore]) => {
    if (!$extremesStore || !$baseline || !$thresholdStore) return null;
    const { values } = $baseline;
    if ($extremesStore === "high") {
      return values.filter(({ value }) => value > $thresholdStore).length;
    } else {
      return values.filter(({ value }) => value < $thresholdStore).length;
    }
  }
);

// Threshold Stats
export const thresholdProbability = derived(
  [hadisdStore, thresholdStore],
  ([$hadisdStore, $thresholdStore]) => {
    if (!$hadisdStore || !$thresholdStore) {
      return {
        append: "",
        value: "",
        label: "",
        rp: "",
      };
    }
    const { gevisf } = $hadisdStore.returnLevels;
    const { probabilities, values } = gevisf;
    const valuesArr = values.map((d) => +d);
    const closestValue = closest(+$thresholdStore, valuesArr);
    const probability = +probabilities[closestValue.index];
    const rp = +format(".0f")(1 / probability);
    let label;
    if (probability <= 0.01) {
      label = "Extreme";
    } else if (probability > 0.01 && probability < 0.25) {
      label = "Rare";
    } else {
      label = "Common";
    }
    const value = +format(".2f")(probability * 100);
    let append;
    if (value === 50) {
      append = "at least";
    } else if (value === 0.1) {
      append = "less than";
    } else {
      append = "";
    }
    return {
      append,
      value,
      label,
      rp,
    };
  }
);

export const histogramPercentiles = derived(
  [extremesStore, baseline],
  ([$extremesStore, $baseline]) => {
    if (!$extremesStore || !$baseline) {
      return [];
    }
    const { percentiles } = $baseline;
    if ($extremesStore === "high") {
      return percentiles.filter((d) => d.percentile > 45);
    } else {
      return percentiles.filter((d) => d.percentile < 55);
    }
  }
);

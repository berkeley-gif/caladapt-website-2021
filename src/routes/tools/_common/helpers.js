import { rollups, sort, group } from "d3-array";
import {
  DEFAULT_COMPASS_QUADRANTS,
  DEFAULT_COMPASS_QUADRANT_ANGLE,
} from "./constants";

/**
 * Groups data for 2 or more timeseries by year, outputs a single timeseries with
 * min and max value for each year.
 * Used for creating envelopes to represent an ensemble range.
 * This data structure is used as an input to the d3 area function
 * @param {array} _data
 * @return {object}
 */
export function buildEnvelope(_data) {
  const dataArr = rollups(
    _data,
    (v) => v.map((i) => i.value),
    (d) => d.date.getUTCFullYear()
  );
  return dataArr.map(([key, value]) => {
    const sortedArr = sort(value);
    return {
      date: new Date(Date.UTC(key, 11, 31)),
      min: sortedArr[0],
      max: sortedArr[1],
    };
  });
}

/**
 * Flattens an array of series objects of the type:
 * {
 *  id: HadGEM2-ES,
 *  values:[
 *    { date: Date Sun Dec 31 1950, value: 90},
 *    { date: Date Sun Dec 31 1951, value: 95},
 *    { date: Date Sun Dec 31 1952, value: 97},
 *    ...
 *  ]} 
 * to:
   [
 *   { date: Date Sun Dec 31 1950, value: 90, year: 1950, id: HadGEM2-ES, label: HadGEM2-ES (Warm/Dry)},
 *   { date: Date Sun Dec 31 1951, value: 95, year: 1950, id: HadGEM2-ES, label: HadGEM2-ES (Warm/Dry)},
 *   { date: Date Sun Dec 31 1952, value: 97, year: 1950, id: HadGEM2-ES, label: HadGEM2-ES (Warm/Dry)},
 *   ...
 * ] 
 * Used for chart tooltips
 * @param {array} _data - array of series objects
 * @return {array}
 */
export function flattenData(_data) {
  return _data.reduce((acc, series) => {
    const seriesValues = series.values.map((d) => {
      return {
        ...d,
        year: +d.date.getUTCFullYear(),
        id: series.id,
        label: series.label,
      };
    });
    acc.push(...seriesValues);
    return acc;
  }, []);
}

/**
 * Groups a flattened array of objects by year. From:
 *  [
 *   { date: Date Sun Dec 31 1950, value: 90, year: 1950, id: HadGEM2-ES, label: HadGEM2-ES (Warm/Dry)},
 *   { date: Date Sun Dec 31 1951, value: 95, year: 1950, id: HadGEM2-ES, label: HadGEM2-ES (Warm/Dry)},
 *   { date: Date Sun Dec 31 1952, value: 97, year: 1950, id: HadGEM2-ES, label: HadGEM2-ES (Warm/Dry)},
 *   ...
 * ]
 * to:
 * [
 *  {
 *    date: Date Sun Dec 31 1950,
 *    values: [
 *      { id: HadGEM2-ES, label: HadGEM2-ES (Warm/Dry), value: 90 },
 *      { id: MIROC5, label: MIROC5 (Complement), value: 87 },
 *      { id: livneh, label: Observed, value: 92 },
 *      ...
 *    ]
 *  },
 *  ...
 * ]
 * Used for chart tooltips
 * @param {array} _data - array of series objects
 * @return {array}
 */
export function getDataByDate(_arr) {
  return Array.from(
    group(_arr, (d) => d.year),
    ([year, values]) => {
      const date = new Date(Date.UTC(year, 0, 1));
      const rows = values.map((d) => {
        if ("min" in d && "max" in d) {
          return {
            id: d.id,
            label: d.label,
            value: [d["min"], d["max"]],
          };
        } else {
          return {
            id: d.id,
            label: d.label,
            value: d.value,
          };
        }
      });
      return { date, values: rows };
    }
  );
}

/**
 * Formats an array of series objects of the type:
 * {
 *  id: HadGEM2-ES,
 *  values:[
 *    { date: Date Sun Dec 31 1950, value: 90},
 *    { date: Date Sun Dec 31 1951, value: 95},
 *    { date: Date Sun Dec 31 1952, value: 97},
 *    ...
 *  ]}
 * to the following data structure used for csv exports
 * [
 *  {
 *    year: 1950,
      "Modeled RCP 4.5 Range Min": 98,
      "HadGEM2-ES": 90,
      "Observed": 92,
      ...
 *  },
 *  ...
 * ]
 * @param {array} _data - array of series objects
 * @return {array}
 */
export function formatDataForExport(_arr) {
  return _arr.map((item) => {
    const row = {};
    row.year = item.date.getUTCFullYear();
    item.values.forEach((d) => {
      if (Array.isArray(d.value)) {
        row[`${d.label} Min`] = d.value[0];
        row[`${d.label} Max`] = d.value[1];
      } else {
        row[d.label] = d.value;
      }
    });
    return row;
  });
}

/**
 * Converts degrees into the corresponding quadrant
 * on a 16 point compass
 * @param {number}
 * @return {string}
 */
export function getCompassQuadrant(deg) {
  const i = Math.round((deg % 360) / DEFAULT_COMPASS_QUADRANT_ANGLE);
  return DEFAULT_COMPASS_QUADRANTS.get(i);
}

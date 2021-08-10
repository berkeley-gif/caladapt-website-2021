import { utcParse } from "d3-time-format";
import { timeDay } from "d3-time";
import config from "./api-config";
import shp from "shpjs";
import tj from "@mapbox/togeojson";

const { apiEndpoint } = config.env.production;

/**
 * Split and parse location hash string into an object
 *
 * @param {string} paramsStr - e.g. #climatevar=swe&scenario=rcp45
 * @return {object} - key value pair e.g. { climatevar: 'swe', scenario: 'rcp45' }
 */
export function deserialize(paramsStr) {
  const pieces = paramsStr.split("&");
  const params = {};
  let i;
  let parts;
  // process each query pair
  for (i = 0; i < pieces.length; i += 1) {
    parts = pieces[i].split("=");
    if (parts.length < 2) {
      parts.push("");
    }
    params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }
  return params;
}

/**
 * Encodes object as a location hash
 *
 * @param {object} params
 * @return {string}
 */
export function serialize(params) {
  const parts = [];
  Object.keys(params).forEach((key) => {
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  });
  return `${parts.join("&")}`;
}

/**
 * Converts error message from Cal-Adapt API into a user friendly message
 *
 * @param {object} json
 * @return {string} messageStr - error message
 */
function getError(json) {
  let errorStr = "";
  let messageStr = "";
  // Error returned from API can be in various configs
  if (json.g && json.g[0]) {
    [errorStr] = json.g;
  } else if (json.upload && json.upload.length > 0) {
    [errorStr] = json.upload;
  } else if (json.features) {
    [errorStr] = json.features;
  } else if (json.detail) {
    errorStr = json.detail;
  }

  // Generate user friendly error message
  if (errorStr.indexOf("Max area of 5.7 exceeded") > -1) {
    messageStr = `Area of uploaded feature is too large. Maximum
          area supported is 20,000 sq. miles.`;
  } else if (errorStr.indexOf("Upload a valid data source") > -1) {
    messageStr = `File is corrupted or not a valid data source`;
  } else {
    messageStr = errorStr;
  }
  return messageStr;
}

/**
 * Convert http response to json
 *
 * @param {Promise} response
 * @return {object}
 */
export function parseJSON(response) {
  return response.json();
}

/**
 * Checks status of http response, throw an error if needed
 *
 * @param {Promise} response
 * @return {Promise}
 */
export function checkStatus(response) {
  if (response.status >= 300 || response.status < 200) {
    return parseJSON(response)
      .then(getError)
      .then((error) => {
        throw new Error(error);
      });
  }
  return parseJSON(response);
}

/**
 * Utility function for async/await error handling
 * used with await
 *
 * - Example response [ data, undefined ]
 * - Example response [ undefined, Error ]
 *
 *
 * When used with Promise.all([req1, req2, req3])
 * - Example response [ [data1, data2, data3], undefined ]
 * - Example response [ undefined, Error ]
 *
 *
 * When used with Promise.race([req1, req2, req3])
 * - Example response [ data, undefined ]
 * - Example response [ undefined, Error ]
 *
 * @param {Promise} promise
 * @returns {Promise} [ data, undefined ]
 * @returns {Promise} [ undefined, Error ]
 */
export const handleXHR = (promise) => {
  return promise
    .then(checkStatus)
    .then((data) => [data, undefined])
    .catch((error) => Promise.resolve([undefined, error]));
};

export const handle = (promise) => {
  return promise
    .then((data) => [data, undefined])
    .catch((error) => Promise.resolve([undefined, error]));
};

/**
 * Use the Fetch API to get data from Cal-Adapt API using GET or POST

 * @param {string} url - path to the resource
 * @param {object} params - query parameters
 * @return {Promise}
 */
export function fetchData(url, params, method = "GET") {
  let request;
  if (method === "POST") {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });
    request = fetch(url, {
      method,
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
  } else {
    request = fetch(`${url}?${serialize(params)}`, {
      method,
      headers: {
        Accept: "application/json",
      },
    });
  }
  return request;
}

/**
 * Tranform API response to an array of objects

 * @param {object} response - json object
 * @return {array} values
 */
export function transformResponse(response) {
  const parseDate = utcParse("%Y-%m-%dT%H:%M:%S%Z");
  const { columns, index, data } = response;

  if (!data) {
    throw new Error("No data for this location");
  }

  const values = data.map((row, i) => {
    const result = {};
    result.date = parseDate(index[i]);
    if (columns) {
      columns.forEach((colName, j) => {
        result[colName] = row[j];
      });
    } else {
      result.value = row;
    }
    return result;
  });
  return values;
}

/**
 * Tranform API response to an array of objects

 * @param {object} response - json object
 * @return {array} values
 */
export function transformCounts(response) {
  const parseDate = utcParse("%Y-%m-%dT%H:%M:%S%Z");
  const { counts, ...threshold } = response;

  if (!counts) {
    throw new Error("No data for this location");
  }

  const entries = Object.entries(counts);
  const values = entries.map((row) => {
    const result = {};
    result.date = parseDate(row[0]);
    result.value = row[1];
    return result;
  });

  return { values, threshold };
}

/**
 * Combine two arrays to create an array to use with d3's area generator

 * @param {array} minArray
 * @param {array} maxArray
 * @param {string} slug
 * @return {object}
 */
export function makeEnvelope(minArray, maxArray, slug) {
  const values = minArray.map((row, i) => {
    return {
      date: row.date,
      key: row.key,
      min: row.value,
      max: maxArray[i].value,
    };
  });
  return {
    slug,
    values,
  };
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export function createSeriesObject(props, values) {
  if (!props) return values;
  return {
    ...props,
    values,
  };
}

export function addPropsToValues(props, values) {
  if (!props) return values;
  return values.map((d) => {
    return { ...d, ...props };
  });
}

/* eslint-disable */

/**
 * An implementation of the pipe function used in Functional Programming
 * that allows for piping both synchronous and asynchronous functions.
 * https://github.com/jperasmus/pipe-then
 *
 * @param {functions}
 * @return {function}
 */
export const pipe = function pipe() {
  for (
    var _len = arguments.length, functions = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    functions[_key] = arguments[_key];
  }

  return function (input) {
    return functions.reduce(function (chain, func) {
      return chain.then(func);
    }, Promise.resolve(input));
  };
};

/**
 * An implementation of the compose function used in Functional Programming
 * that allows for piping both synchronous and asynchronous functions.
 * https://github.com/jperasmus/compose-then
 *
 * @param {functions}
 * @return {function}
 */
export const compose = function compose() {
  for (
    var _len = arguments.length, functions = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    functions[_key] = arguments[_key];
  }

  return function (input) {
    return functions.reduceRight(function (chain, func) {
      return chain.then(func);
    }, Promise.resolve(input));
  };
};

/**
 * An implementation of the compose function used in Functional Programming
 * that allows for piping both synchronous and asynchronous functions.
 * https://github.com/msn0/dead-simple-curry
 *
 */
export const curry = function (fn) {
  return function curried(...args) {
    return args.length >= fn.length
      ? fn.call(this, ...args)
      : (...rest) => curried.call(this, ...args, ...rest);
  };
};

/**
 * Sort dates, dates will be cast to numbers
 *
 */
export const sortByDateAscending = function (a, b) {
  return a.date - b.date;
};

/**
 * Sort ascending numeric array
 *
 */
export const sortAscending = function (a, b) {
  return a - b;
};

/**
 * Sanitize string
 *
 */
export const sanitizeString = function (str) {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim();
};

/**
 * Get siblings for dom element
 *
 */
export function getSiblings(elem) {
  // Setup siblings array and get the first sibling
  const siblings = [];
  let sibling = elem.parentNode.firstChild;

  // Loop through each sibling and push to the array
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
}

/**
 * Group consecutive dates
 *
 * Takes an array of objects which have a property called date
 * Groups objects with consecutive dates together into an array
 * Objects with non consecutive dates are returned as an array of length 1
 * Returns an array of arrays
 *
 */
export function groupConsecutiveDates(arr) {
  let i = 0;
  const result = arr.reduce((stack, b) => {
    const cur = stack[i];
    const a = cur ? cur[cur.length - 1] : 0;

    if (timeDay.count(a.date, b.date) !== 1) {
      i += 1;
    }

    if (!stack[i]) {
      stack[i] = [];
    }

    stack[i].push(b);
    return stack;
  }, []);
  return result;
}

/**
 * Creates a request to validate geometry in file uploaded by user.
 * The geometry is tested against one of the timeseries.
 *
 * @param {File Object} file
 * @param {Promise}
 */
export async function validateShape(file) {
  const formData = new FormData();
  if (file instanceof File) {
    formData.append("upload", file);
  } else {
    formData.append("g", JSON.stringify(file));
  }
  formData.append("stat", "mean");
  const request = fetch(`${apiEndpoint}/series/tasmax_year_livneh/rasters/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });
  return request;
}

/**
 * Convert geometry in file uploaded by use to GeoJSON.
 *
 * @param {File Object} file
 * @return {JSON} data
 */
export async function convertFileToGeojson(file) {
  const { name } = file;
  const extension = name.split(".")[1];
  let data;
  if (extension === "zip") {
    const archive = await file.arrayBuffer();
    data = await shp(archive);
  } else if (extension === "kml") {
    const text = await file.text();
    const xml = new DOMParser().parseFromString(text, "text/xml");
    data = tj.kml(xml);
  } else {
    const text = await file.text();
    data = JSON.parse(text);
  }
  return data;
}

/**
 * Return closest number in array
 *
 * @param {number} needle
 * @param {array} haystack
 * @return {number}
 */
export function closest(needle, haystack) {
  return haystack.reduce((a, b) => {
    let aDiff = Math.abs(a - needle);
    let bDiff = Math.abs(b - needle);

    if (aDiff == bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * wait` milliseconds.
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

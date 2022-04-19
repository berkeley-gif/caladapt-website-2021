import {
  mapboxGeocodingEndpoint,
  mapboxGeocodeParams,
  caladaptGeocodingEndpoint,
  formatFeature,
} from "~/helpers/geocode";
import { serialize } from "~/helpers/utilities";

export {
  reverseGeocode as reverseGeocodeAddress,
  formatFeature,
} from "~/helpers/geocode";

/**
 * geocodeSearch - gets geographic data for a location search string
 * @param {string} searchStr – string to geocode
 * @param {Object} options - additional options
 * @param {string} options.boundaryType - type of geography, e.g. address, counties, etc.
 * @param {AbortSignal} options.signal - signal object from an AbortController instance
 * @returns {Object} - GeoJSON FeatureCollection
 */
export async function geocodeSearch(searchStr, options = {}) {
  const { boundaryType, signal } = options;
  let url;
  searchStr = sanitizeSearchStr(searchStr, boundaryType);
  if (boundaryType === "locagrid") {
    url = `${mapboxGeocodingEndpoint}/${searchStr}.json?${serialize({
      ...mapboxGeocodeParams,
      autocomplete: true,
      types: "address,postcode,neighborhood",
    })}`;
  } else {
    url = `${caladaptGeocodingEndpoint}/${boundaryType}/?${serialize({
      srs: 4326,
      search: searchStr,
      pagesize: 5,
    })}`;
  }
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    ...(signal && { signal }),
  });
  const result = await response.json();
  return result;
}

/**
 * reverseGeocodeBoundary - handles querying the Cal-Adapt API for a boundary feature
 * @param {[number, number]} coordinates
 * @param {Object} options
 * @param {string} options.boundaryType - type of geography, e.g. address, counties, etc.
 * @param {AbortSignal} options.signal - signal object from an AbortController instance
 * @returns {Object} - GeoJSON FeatureCollection
 */
export async function reverseGeocodeBoundary([lng, lat], options = {}) {
  const { boundaryType, signal } = options;
  const url = `${caladaptGeocodingEndpoint}/${boundaryType}/?${serialize({
    srs: 4326,
    precision: 4,
    intersects: `Point(${lng} ${lat})`,
  })}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    ...(signal && { signal }),
  });
  return await response.json();
}

/**
 * formatSearchResult: formats features returned by the Cal-Adapt and MapBox geocoders.
 * @param {Object} result - the parsed JSON response from the geocoder. Assumes a features property
 * @param {string} boundaryType - the geographic boundary, e.g. "counties", "watershed", etc.
 * @returns {Array} - array of objects of formatted geojson features
 */
export function formatSearchResult(result, boundaryType) {
  if (boundaryType === "locagrid") {
    return result.features.map(({ id, place_name, ...rest }) => ({
      id,
      title: place_name,
      ...rest,
    }));
  } else {
    return result.features.map((feature) =>
      formatFeature(feature, boundaryType)
    );
  }
}

/**
 * sanitizeSearch: removes extraneous words and characters that the cal-adapt
 * geocoding API won't match for a given boundary type.
 * @param {string} searchStr – search string
 * @param {string} boundaryType – geographic boundary type
 * @returns {string}
 */
function sanitizeSearchStr(searchStr, boundaryType) {
  let regex;
  switch (boundaryType) {
    case "counties":
      regex = /\bcounty\b/gi;
      break;
    case "censustracts":
      regex = /\b(?:census|tract)\b/gi;
      break;
    case "hydrounits":
      regex = /\bwatershed\b/gi;
      break;
    default:
  }
  if (regex) {
    searchStr = searchStr.replace(regex, "");
  }
  return searchStr.replace(/,\s\bcalifornia\b/gi, "").trim();
}

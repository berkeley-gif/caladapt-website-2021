// TODO: some of this code was copied from the in-progress work for the LCCS tool migration in the develop branch.
// It should probably be abstracted so that it could be shared between the LCCS and the ChangeLocationStation component,
// once the LCCS tool is migrated and merged into production.
// see: https://github.com/berkeley-gif/caladapt-website-2021/blob/develop/src/routes/tools/local-climate-change-snapshot/_select-location/geocode-search.js
// commented on 2022-05-27

import getBbox from "@turf/bbox";
import {
  mapboxGeocodingEndpoint,
  mapboxGeocodeParams,
  caladaptGeocodingEndpoint,
  formatFeature,
} from "~/helpers/geocode";
import { serialize } from "~/helpers/utilities";

export { formatFeature } from "~/helpers/geocode";

/**
 * handleAbortFetch - used to cancel pending fetch requests
 * @param {AbortController} abortController - AbortController instance
 * @returns {AbortController}
 */
export function handleAbortFetch(abortController) {
  if (abortController) {
    abortController.abort();
  }
  return new AbortController();
}

// in most tools these are the default geocode search passed to the MapBox Geocoding API
const DEFAULT_GEOCODE_SEARCH_TYPES = "address,postcode,neighborhood";

/**
 * geocodeSearch - gets geographic data for a location search string
 * @param {string} searchStr – string to geocode
 * @param {Object} options - additional options
 * @param {string} options.boundaryType - type of geography, e.g. address, counties, etc.
 * @param {boolean} options.isStationLayer - does the boundaryType belong to a "stations" group?
 * @param {AbortSignal} options.signal - signal object from an AbortController instance
 * @returns {Object} - GeoJSON FeatureCollection
 */
export async function geocodeSearch(searchStr, options = {}) {
  const { boundaryType, signal, isStationLayer } = options;
  let url;
  searchStr = sanitizeSearchStr(searchStr, boundaryType);
  if (boundaryType === "locagrid" || isStationLayer) {
    url = `${mapboxGeocodingEndpoint}/${searchStr}.json?${serialize({
      ...mapboxGeocodeParams,
      autocomplete: true,
      types: isStationLayer
        ? DEFAULT_GEOCODE_SEARCH_TYPES.concat(",place,locality")
        : DEFAULT_GEOCODE_SEARCH_TYPES,
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
 * formatSearchResult: formats features returned by the Cal-Adapt and MapBox geocoders.
 * @param {Object} result - the parsed JSON response from the geocoder. Assumes a features property
 * @param {string} boundaryType - the geographic boundary, e.g. "counties", "watershed", etc.
 * @param {boolean} options.isStationLayer - does the boundaryType belong to a "stations" group?
 * @returns {Array} - array of objects of formatted geojson features
 */
export function formatSearchResult(
  result,
  boundaryType,
  isStationLayer = false
) {
  if (boundaryType === "locagrid" || isStationLayer) {
    return result.features.map(formatPointFeature);
  } else {
    return result.features.map((feature) =>
      formatFeature(feature, boundaryType)
    );
  }
}

/**
 * formatPointFeature - formats a GeoJSON feature returned by the MapBox geocoding API
 * @param {Object} feature - a GeoJSON feature
 * @returns {Object} - a GeoJSON feature with additional props
 */
export function formatPointFeature(feature) {
  const { id, place_name, geometry, bbox, ...rest } = feature;
  return {
    id,
    title: place_name
      ? place_name.replace(", United States", "")
      : "Unknown address",
    // note: bbox prop for a point geom is bogus but is added so that the map zoom works
    bbox: bbox || getBbox(geometry),
    geometry,
    ...rest,
  };
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
    case "censustracts":
      regex = /\b(?:census|tract)\b/gi;
      break;
    case "cdistricts":
      regex = /\b(?:congressional|district)\b/gi;
      break;
    case "counties":
      regex = /\bcounty\b/gi;
      break;
    case "hydrounits":
      regex = /\bwatershed\b/gi;
      break;
    case "wecc-load-area":
      regex = /\b(?:wecc|load|area)\b/gi;
      break;
    case "climregions":
      regex = /\b(?:wrcc|climate|region)\b/gi;
      break;
    case "ccc4aregions":
      regex = /\b(?:california's|fourth|assessment|climate|region)\b/gi;
      break;
    case "irwm":
      regex = /\b(?:irwm|region)\b/gi;
      break;
    case "states":
      regex = /\b(?:state|of)\b/gi;
      break;
    case "hadisdstations":
      regex = /\b(?:weather|station|at)\b/gi;
      break;
    default:
  }
  if (regex) {
    searchStr = searchStr.replace(regex, "");
  }
  return searchStr.replace(/,\s\bcalifornia\b/gi, "").trim();
}

import {
  mapboxGeocodingEndpoint,
  mapboxGeocodeParams,
  caladaptGeocodingEndpoint,
} from "~/helpers/geocode";
import { serialize } from "~/helpers/utilities";

/**
 *
 * @param {string} searchStr – string to geocode
 * @param {Object} options - additional options
 * @param {string} options.boundaryType - type of geography, e.g. address, counties, etc.
 * @param {AbortSignal} options.signal - signal object from an AbortController instance
 * @returns Object - result of Response.json()
 */
export async function geocodeSearch(searchStr, options = {}) {
  const { boundaryType, signal } = options;
  let url;
  searchStr = sanitizeSearchStr(searchStr, boundaryType);
  if (boundaryType === "address") {
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
 * sanitizeSearch: removes extraneous words and characters that the cal-adapt
 * geocoding API won't match for a given boundary type.
 * @param {string} searchStr – search string
 * @param {string} boundaryType – geographic boundary type
 * @returns string
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

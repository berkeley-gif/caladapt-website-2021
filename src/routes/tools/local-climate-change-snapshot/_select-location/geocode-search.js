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
    url = `${mapboxGeocodingEndpoint}/${searchStr}.json?${serialize(
      mapboxGeocodeParams
    )}`;
  } else {
    url = `${caladaptGeocodingEndpoint}/${boundaryType}/?${serialize({
      srs: 4326,
      search: searchStr,
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
 * sanitizeSearch: removes extraneous characters that the cal-adapt geocoding API won't match.
 * @param {string} searchStr – search string
 * @param {string} boundaryType – geographic boundary type
 * @returns string
 */
function sanitizeSearchStr(searchStr, boundaryType) {
  let regex;
  switch (boundaryType) {
    case "counties":
      regex = /\scounty/i;
      break;
    case "censustracts":
      regex = /census\stract\s/i;
      break;
    case "hydrounits":
      regex = /\swatershed/i;
      break;
    default:
  }
  if (regex) {
    searchStr = searchStr.replace(regex, "");
  }
  return searchStr.replace(/,\scalifornia/i, "");
}

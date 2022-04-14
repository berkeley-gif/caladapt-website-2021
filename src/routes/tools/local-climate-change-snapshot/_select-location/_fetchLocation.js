import {
  mapboxGeocodingEndpoint,
  mapboxGeocodeParams,
  caladaptGeocodingEndpoint,
} from "~/helpers/geocode";
import { serialize } from "~/helpers/utilities";

export async function geocodeAddress(searchStr, options = {}) {
  const url = `${mapboxGeocodingEndpoint}/${searchStr}.json?${serialize(
    mapboxGeocodeParams
  )}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    ...(options.signal && { signal: options.signal }),
  });
  const result = await response.json();
  return result;
}

export async function geocodeBoundary(searchStr, options = {}) {
  const { boundaryType, signal } = options;
  const searchParams = {
    srs: 4326,
    search: searchStr,
  };
  const url = `${caladaptGeocodingEndpoint}/${boundaryType}/?${serialize(
    searchParams
  )}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    ...(signal && { signal }),
  });
  const result = await response.json();
  return result;
}

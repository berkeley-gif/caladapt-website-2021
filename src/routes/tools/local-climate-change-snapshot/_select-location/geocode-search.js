import {
  mapboxGeocodingEndpoint,
  mapboxGeocodeParams,
  caladaptGeocodingEndpoint,
} from "~/helpers/geocode";
import { serialize } from "~/helpers/utilities";

export async function geocodeSearch(searchStr, options = {}) {
  const { boundaryType, signal } = options;
  let url;
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

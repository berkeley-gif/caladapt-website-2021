import getCenter from "@turf/center";
import getBbox from "@turf/bbox";

import { fetchData, handleXHR } from "./utilities";
import { mapboxgl } from "./mapbox";
import config from "./api-config";
import capoly from "./california-boundary-feature";

const { apiEndpoint } = config.env.production;
const { accessToken } = mapboxgl;
const geocodingService = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export const reverseGeocode = async (coords) => {
  const url = `${geocodingService}/${coords}.json`;
  const geocodeParams = {
    access_token: accessToken,
  };
  const [response, error] = await handleXHR(fetchData(url, geocodeParams));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

export const geocode = async (searchStr) => {
  const url = `${geocodingService}/${searchStr}.json`;
  const geocodeParams = {
    country: "us",
    bbox: "-125,31,-113,44",
    limit: 5,
    proximity: "-122.25038599999999,37.53312300000002",
    types: "postcode,place,locality,neighborhood,address",
    language: "en",
    access_token: accessToken,
  };
  const [response, error] = await handleXHR(fetchData(url, geocodeParams));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

export const searchBoundaryLayer = async (searchStr, boundaryId) => {
  const url = `${apiEndpoint}/${boundaryId}/`;
  const searchParams = {
    srs: 4326,
    search: searchStr,
    v: 1, // cache bust 2022-05-09
  };
  const [response, error] = await handleXHR(fetchData(url, searchParams));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

export const getBoundaryPolygon = async (coords, boundaryId) => {
  const url = `${apiEndpoint}/${boundaryId}/`;
  const searchParams = {
    srs: 4326,
    precision: 4,
    //intersects: `{"type":"Point","coordinates":[${coords[0]},${coords[1]}]}`,
    intersects: `Point(${coords[0]} ${coords[1]})`,
    v: 1, // cache bust 2022-05-09
  };
  const [response, error] = await handleXHR(fetchData(url, searchParams));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

export const getTitle = (feature, layerId, placeName) => {
  switch (layerId) {
    case "locagrid":
      return feature.properties && feature.properties.name
        ? `LOCA Grid Cell ${feature.properties.name}`
        : "LOCA Grid Cell";
    case "counties":
      return `${feature.properties.name} County, ${feature.properties.state_name}`;
    case "censustracts":
      return `Census Tract ${feature.properties.tract}, California`;
    case "hydrounits":
      return `${feature.properties.name} Watershed, California`;
    case "place":
      return `${feature.properties.name}, California`;
    case "cdistricts":
      return `Congressional District ${feature.properties.cd114fp}, California`;
    case "wecc-load-area":
      return `${feature.properties.name}, WECC Load Area`;
    case "climregions":
      return `${feature.properties.name}, WRCC Climate Region`;
    case "ccc4aregions":
      return `${feature.properties.name}, California's Fourth Assessment Climate Region`;
    case "irwm":
      return `${feature.properties.name}, IRWM Region`;
    case "states":
      return `State of ${feature.properties.name}`;
    case "custom":
      return "Custom Boundary";
    case "hadisdstations":
      return `Weather Station at ${feature.properties.name}, ${feature.properties.city}, California`;
    case "evtlocations":
      return `${feature.properties.name}, California`;
    default:
      return placeName;
  }
};

export const formatFeature = (feature, boundaryId, placeName = "") => {
  const center = feature.center || getCenter(feature.geometry);
  const lng = center.geometry.coordinates[0].toFixed(4);
  const lat = center.geometry.coordinates[1].toFixed(4);
  const bbox = getBbox(feature.geometry);
  const title = getTitle(feature, boundaryId, placeName);

  return {
    title,
    geometry: feature.geometry,
    center: [+lng, +lat],
    bbox,
    id: feature.id || "",
    properties: feature.properties,
  };
};

export const getFeature = async (feature, boundaryId) => {
  let location = null;
  if (boundaryId === "ca") {
    location = formatFeature(capoly, boundaryId);
  } else {
    const response = await getBoundaryPolygon(feature.center, boundaryId);
    if (response.features.length > 0) {
      location = formatFeature(
        response.features[0],
        boundaryId,
        feature.place_name
      );
    }
  }
  return location;
};

/**
 * Queries a boundary feature from the Cal-Adapt API using its unique feature id
 * @param {string} boundaryType - locagrid, counties, censustracts, etc.
 * @param {number} featureId - numeric value of feature id
 * @param {object} params - additional parameters
 * @param {number} params.srs - desired reference system to return coordinates in
 * @returns {object} formatted location data on success, Error on failure.
 */
export const getFeatureById = async (
  boundaryType,
  featureId,
  params = { srs: 4326, v: 1 }
) => {
  let location = null;
  const url = `${apiEndpoint}/${boundaryType}/${featureId}/`;
  const [response, error] = await handleXHR(fetchData(url, params));
  if (error) {
    throw new Error(error.message);
  }
  if (response) {
    location = formatFeature(response, boundaryType);
  }
  return location;
};

export const searchFeature = async (searchStr, boundaryId) => {
  const results = [];
  if (boundaryId && boundaryId !== "locagrid") {
    const boundaryResults = await searchBoundaryLayer(searchStr, boundaryId);
    if (boundaryResults.features && boundaryResults.features.length > 0) {
      const data = boundaryResults.features.map((d) =>
        formatFeature(d, boundaryId)
      );
      results.push({
        geocoder: "caladapt",
        data,
      });
    }
  }
  const geocodeResults = await geocode(searchStr);
  if (geocodeResults.features && geocodeResults.features.length > 0) {
    results.push({
      geocoder: "mapbox",
      data: geocodeResults.features.map((d) => ({ ...d, title: d.place_name })),
    });
  } else {
    results.push({
      geocoder: "mapbox",
      data: [],
    });
  }
  return results;
};

/**
 * There are 3 station datasets in the Cal-Adapt API (Feb 2022):
 *  - HadISD weather stations used in Extreme Weather tool
 *  - Drainange basins used in Streamflow tool
 *  - Tide guage stations used in Hourly SLR tool
 * The HadISD weather stations are stored as a separate layer in EPS 4326 (https://api.cal-adapt.org/api/hadisdstations/).
 * The other 2 are stored in Event Location List in EPSG 3857 (https://api.cal-adapt.org/api/evtlocations/1/)
 * A default srs param is used to always request geojson in EPSG 4326 for use in tools
 **/
export const getStationById = async (id, layerId, params = { srs: 4326 }) => {
  const url = `${apiEndpoint}/${layerId}/${id}`;
  const [response, error] = await handleXHR(fetchData(url, params));
  if (error) {
    throw new Error(error.message);
  }
  return formatFeature(response, layerId);
};

export const getNearestFeature = async (lng, lat, layerId) => {
  const url = `${apiEndpoint}/${layerId}/`;
  const params = {
    srs: 4326,
    precision: 4,
    distance_to: `POINT(${lng} ${lat})`,
    v: 1, // cache bust 2022-05-09
  };
  const [response, error] = await handleXHR(fetchData(url, params));
  if (error) {
    throw new Error(error.message);
  }
  return formatFeature(response.features[0], layerId);
};

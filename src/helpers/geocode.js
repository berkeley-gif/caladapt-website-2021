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
  };
  const [response, error] = await handleXHR(fetchData(url, searchParams));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

export const getFeatureById = async (id, layerId) => {
  const url = `${apiEndpoint}/${layerId}/${id}`;
  const [response, error] = await handleXHR(fetchData(url, {}));
  if (error) {
    throw new Error(error.message);
  }
  return response;
};

export const createAdditionalProps = (feature, layerId) => {
  let title;
  let address = "California";
  switch (layerId) {
    case "locagrid":
      title = feature.properties.name;
      break;
    case "counties":
      title = `${feature.properties.name} County`;
      address = feature.properties.state_name;
      break;
    case "censustracts":
      title = `Census Tract ${feature.properties.tract}`;
      break;
    case "hydrounits":
      title = `${feature.properties.name} Watershed`;
      break;
    case "cdistricts":
      title = `Congressional District ${feature.properties.cd114fp}`;
      break;
    case "custom":
      title = "Custom Boundary";
      address = "";
      break;
    case "ca":
      title = "State of California";
      address = "";
      break;
    case "hadisdstations":
      title = `Weather Station: ${feature.properties.name}`;
      address = `${feature.properties.city}, California`;
      break;
    default:
      title = feature.properties.name ? feature.properties.name : "No Title";
  }
  return { title, address };
};

export const getTitle = (feature, layerId, placeName) => {
  switch (layerId) {
    case "locagrid":
      return placeName.replace(", United States", "");
    case "counties":
      return `${feature.properties.name} County, ${feature.properties.state_name}`;
    case "censustracts":
      return `Census Tract ${feature.properties.tract}, California`;
    case "hydrounits":
      return `${feature.properties.name} Watershed, California`;
    case "cdistricts":
      return `Congressional District ${feature.properties.cd114fp}, California`;
    case "custom":
      return "Custom Boundary";
    case "ca":
      return "State of California";
    case "hadisdstations":
      return `Weather Station at ${feature.properties.name}, ${feature.properties.city}, California`;
    default:
      return placeName;
  }
};

export const formatGeocodeResult = (feature) => {
  const placeName = feature.place_name.split(",");
  const address = placeName.splice(1, placeName.length).join(",");
  const bbox = getBbox(feature.geometry);

  return {
    title: placeName[0],
    address: address.trim(),
    geometry: feature.geometry,
    center: [+feature.center[0], +feature.center[1]],
    bbox,
    id: null,
  };
};

export const formatBoundaryPolygon = (feature, boundaryId) => {
  const center = getCenter(feature.geometry);
  const bbox = getBbox(feature.geometry);
  const lng = center.geometry.coordinates[0].toFixed(4);
  const lat = center.geometry.coordinates[1].toFixed(4);
  const { title, address } = createAdditionalProps(feature, boundaryId);

  return {
    title,
    address,
    geometry: feature.geometry,
    center: [+lng, +lat],
    bbox,
    id: feature.id || null,
  };
};

export const getLocation = async (lng, lat, boundaryId) => {
  if (boundaryId === "locagrid") {
    const geocodeResult = await reverseGeocode([lng, lat]);
    if (geocodeResult.features && geocodeResult.features.length > 0) {
      const data = formatGeocodeResult(geocodeResult.features[0]);
      return data;
    }
  } else if (boundaryId === "ca") {
    const data = formatBoundaryPolygon(capoly, boundaryId);
    return data;
  } else {
    const result = await getBoundaryPolygon([lng, lat], boundaryId);
    if (result.features.length > 0) {
      const feature = result.features[0];
      const data = formatBoundaryPolygon(feature, boundaryId);
      return data;
    }
  }
  return null;
};

export const searchLocation = async (searchStr, boundaryId) => {
  if (boundaryId === "locagrid" || !boundaryId) {
    const geocodeResult = await geocode(searchStr);
    if (geocodeResult.features && geocodeResult.features.length > 0) {
      const data = geocodeResult.features.map((d) => formatGeocodeResult(d));
      return data;
    }
  } else {
    const result = await searchBoundaryLayer(searchStr, boundaryId);
    if (result.features && result.features.length > 0) {
      const data = result.features.map((d) =>
        formatBoundaryPolygon(d, boundaryId)
      );
      return data;
    }
  }
  return null;
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

export const getStationById = async (id, layerId) => {
  const url = `${apiEndpoint}/${layerId}/${id}`;
  const [response, error] = await handleXHR(fetchData(url));
  if (error) {
    throw new Error(error.message);
  }
  return formatFeature(response, layerId);
};

export const getNearestStation = async (lng, lat, layerId) => {
  const url = `${apiEndpoint}/${layerId}/`;
  const params = {
    distance_to: `POINT(${lng} ${lat})`,
  };
  const [response, error] = await handleXHR(fetchData(url, params));
  if (error) {
    throw new Error(error.message);
  }
  return formatFeature(response.features[0], layerId);
};

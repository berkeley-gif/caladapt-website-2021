import simplifyGeom from "@turf/simplify";
import { mapboxgl } from "./mapbox";

const defaultOptions = {
  width: 150,
  height: 150,
  zoom: 5,
  style: "cal-adapt/cjivy3e8o6d9y2rnnhsqo0sj0",
  token: mapboxgl.accessToken,
};

// BUG: do not use this for creating static location maps, it is error prone.
export default function getStaticMapUrl(location, options) {
  let geometry = location.geometry;
  // Simplify geometry to shorten API request
  // See https://docs.mapbox.com/api/maps/static-images/#troubleshooting-shorten-static-images-api-requests
  if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
    geometry = simplifyGeom(geometry, { tolerance: 0.01, mutate: true });
  }
  const overlay = encodeURIComponent(JSON.stringify(geometry));
  const [lon, lat] = location.center;
  const { style, zoom, width, height, token } = {
    ...defaultOptions,
    ...options,
  };
  return `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${lon},${lat},${zoom}/${width}x${height}?access_token=${token}`;
}

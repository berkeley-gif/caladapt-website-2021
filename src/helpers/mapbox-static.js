import simplifyGeom from '@turf/simplify';
import { mapboxgl } from './../../../helpers/mapbox';

export function getStaticImgSrc(location, options) {
  const {
    width = 150,
    height = 150,
    zoom = 5,
    style = 'cal-adapt/cjivy3e8o6d9y2rnnhsqo0sj0',
  } = options;

  let geometry = location.geometry;
  if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    geometry = simplifyGeom(geometry, { tolerance: 0.01, mutate: true })
  }
  
  const overlay = encodeURIComponent(JSON.stringify(geometry));
  const lon = location.center[0];
  const lat = location.center[1];
  const src = `https://api.mapbox.com/styles/v1/${style}/
  static/geojson(${overlay})/${lon},${lat},${zoom}/${width}x${height}?
  access_token=${mapboxgl.accessToken}`;
  return src;
}
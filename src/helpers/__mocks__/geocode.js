// This file contains manual mocks for the ../geocode.js module.
// These are intended to be used for unit tests with Jest.
// see: https://jestjs.io/docs/manual-mocks

export function formatFeature(
  feature = {},
  boundaryType = "locagrid",
  placeName = ""
) {
  return {
    title: getTitle(feature, boundaryType, placeName),
    center: [0, 0],
    bbox: [0, 0, 0, 0],
    id: feature.id || 1234,
    geometry: {},
    properties: {},
  };
}

export function getFeature(feature = {}, boundaryId = "locagrid") {
  return new Promise((resolve, reject) => {
    if (!feature || !boundaryId)
      reject({
        error: `Must be called with args for feature and boundaryId`,
      });

    resolve(formatFeature(feature, boundaryId));
  });
}

export function getFeatureById(
  boundaryType = "locagrid",
  featureId = 0,
  params = { srs: 4326 }
) {
  return new Promise((resolve, reject) => {
    if (!boundaryType || !featureId)
      reject({
        error: `Must be called with args for boundaryType and featureId`,
      });

    resolve(formatFeature({ id: featureId }, boundaryType));
  });
}

export function reverseGeocode(coords = [0, 0]) {
  return new Promise((resolve, reject) => {
    if (!coords) {
      reject({
        error: "Must be called with arg for coords",
      });
    }
    resolve({
      type: "FeatureCollection",
      query: coords.slice(),
      features: [
        {
          type: "Feature",
          id: "address.12345",
          place_name: "Somewhere, California",
          properties: {
            accuracy: "street",
          },
          geometry: {
            type: "Point",
            coordinates: coords.slice(),
          },
        },
      ],
    });
  });
}

export function getTitle(feature = {}, boundaryType = "", placeName = "") {
  return "New place name";
}

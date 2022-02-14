import { MapLayerHandler } from "./utils";

describe("MapLayerHandler", () => {
  // mocks the mapboxgl.js Map instance
  let map = Object.assign(
    {},
    jest.fn(() => ({
      addSource: jest.fn(),
      removeSource: jest.fn(),
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
    })),
    { version: "x.x.x" }
  );

  console.log(map);

  // let map = { version: "x.x.x" };
  let beforeId = "foo";
  let layerType = "raster";
  let debug = false;

  test("Instance creation", () => {
    const mapLayerHandler = new MapLayerHandler({
      map,
      beforeId,
      layerType,
      debug,
    });
    expect(mapLayerHandler).toBeInstanceOf(MapLayerHandler);
  });
});

import { MapLayerHandler } from "./MapLayerHandler";

describe("MapLayerHandler", () => {
  let map;
  let beforeId = "settlement-subdivision-label";
  let layerType = "raster";
  let debug = false;

  // convenience factory fn for creating MLH class instances
  const getMlhInstance = (options = {}) =>
    new MapLayerHandler({
      map: options.map || map,
      beforeId: options.beforeId || beforeId,
      layerType: options.layerType || layerType,
      debug: options.debug || debug,
    });

  beforeEach(() => {
    // mocks the mapboxgl.js Map instance
    map = {
      addSource: jest.fn(),
      removeSource: jest.fn(),
      getSource: jest.fn(() => true),
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
      getLayer: jest.fn(() => true),
      version: "x.x.x",
    };
  });

  test("Instance creation", () => {
    const mapLayerHandler = getMlhInstance();
    expect(mapLayerHandler).toBeInstanceOf(MapLayerHandler);
  });

  test("invalid map param", () => {
    expect(() => getMlhInstance({ map: {} })).toThrow();
  });

  test("invalid beforeId", () => {
    expect(() => getMlhInstance({ beforeId: true })).toThrow();
  });

  test("invalid layerType", () => {
    expect(() => getMlhInstance({ layerType: "3d-insanity" })).toThrow();
  });

  test("invalid debug", () => {
    expect(() => getMlhInstance({ debug: 1 })).toThrow();
  });

  test("getSourceId", () => {
    const mapLayerHandler = getMlhInstance();
    const result = mapLayerHandler._getSourceId("foo");
    expect(result).toEqual("foo-source");
  });

  test("getLayerId", () => {
    const mapLayerHandler = getMlhInstance();
    const result = mapLayerHandler._getLayerId("foo");
    expect(result).toEqual("foo-layer");
  });

  test("getSourceDef: tile url", () => {
    const mapLayerHandler = getMlhInstance();
    const url = "https://tiles.com/{z}/{x}/{y}.png";
    const result = mapLayerHandler._getSourceDef(url);
    const expected = {
      tiles: [url],
      tileSize: 256,
      type: "raster",
    };
    expect(result).toStrictEqual(expected);
  });

  test("getSourceDef: geojson", () => {
    const mapLayerHandler = getMlhInstance();
    const result = mapLayerHandler._getSourceDef({ type: "FeatureCollection" });
    const expected = {
      data: { type: "FeatureCollection" },
      type: "geojson",
    };
    expect(result).toStrictEqual(expected);
  });

  test("getLayerDef", () => {
    const mapLayerHandler = getMlhInstance();
    const result = mapLayerHandler._getLayerDef(
      "my-0-layer",
      "my-source",
      {},
      {}
    );
    const expected = {
      id: "my-0-layer",
      source: "my-source",
      type: "raster",
      paint: {},
      layout: {},
    };
    expect(result).toStrictEqual(expected);
  });

  test("addLayer", () => {
    map.getLayer.mockReturnValue(false);
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler._addLayer("my-layer", {}, beforeId);
    expect(mapLayerHandler.map.addLayer).toHaveBeenCalledWith({}, beforeId);
  });

  test("removeLayer", () => {
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler._removeLayer("my-layer");
    expect(mapLayerHandler.map.removeLayer).toHaveBeenCalledWith("my-layer");
  });

  test("addSource", () => {
    map.getSource.mockReturnValue(false);
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler._addSource("my-source", { id: "01" });
    expect(mapLayerHandler.map.addSource).toHaveBeenCalledWith("my-source", {
      id: "01",
    });
  });

  test("removeSource", () => {
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler._removeSource("my-source");
    expect(mapLayerHandler.map.removeSource).toBeCalledWith("my-source");
  });

  test("warn", () => {
    console.warn = jest.fn();
    const mapLayerHandler = getMlhInstance({ debug: true });
    mapLayerHandler._warn("something awful happened!");
    expect(console.warn).toBeCalledWith("something awful happened!");
  });

  test("addMapLayer: addSource", () => {
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler._addSource = jest.fn();
    mapLayerHandler.addMapLayer({
      id: "my",
      asset: "https://tiles.com/{z}/{x}/{y}.png",
      visibility: "visible",
      paintProps: {
        "raster-opacity": 0.5,
      },
    });
    expect(mapLayerHandler._addSource).toBeCalledWith("my-source", {
      tiles: ["https://tiles.com/{z}/{x}/{y}.png"],
      tileSize: 256,
      type: "raster",
    });
  });

  test("addMapLayer: addLayer", () => {
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler._addLayer = jest.fn();
    mapLayerHandler.addMapLayer({
      id: "my",
      asset: "https://tiles.com/{z}/{x}/{y}.png",
      visibility: "visible",
      paintProps: {
        "raster-opacity": 0.5,
      },
    });
    expect(mapLayerHandler._addLayer).toBeCalledWith(
      "my-layer",
      {
        id: "my-layer",
        source: "my-source",
        type: "raster",
        paint: {
          "raster-opacity": 0.5,
        },
        layout: {
          visibility: "visible",
        },
      },
      beforeId
    );
  });

  test("removeMapLayer: removeLayer", () => {
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler._removeLayer = jest.fn();
    mapLayerHandler.removeMapLayer("my");
    expect(mapLayerHandler._removeLayer).toBeCalledWith("my-layer");
  });

  test("removeMapLayer: removeSource", () => {
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler._removeSource = jest.fn();
    mapLayerHandler.removeMapLayer("my");
    expect(mapLayerHandler._removeSource).toBeCalledWith("my-source");
  });

  test("removeMapRef", () => {
    const mapLayerHandler = getMlhInstance();
    mapLayerHandler.removeMapRef();
    expect(mapLayerHandler.map).toBeNull();
  });
});

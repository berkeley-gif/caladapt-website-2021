/**
 * Utility Class for handling adding and removing MapboxGLJS map layers
 * see: routes/tools/slr-coastal-inundation/Map for an example usage.
 */
export class MapLayerHandler {
  /**
   *
   * @param {Object} options
   * @param {Object} options.map - required: the mapboxgl.js map instance
   * @param {string} options.layerType - required: the type of layer, e.g. "raster"
   * @param {string|undefined} options.beforeId - optional: the layer id where
   *  this layer should be inserted below in the layer stacking z-order
   * @param {Object} options.debug - optional: whether or not to log warnings
   */
  constructor({ map, beforeId, layerType, debug }) {
    // limits what types of layers the MapLayerHandler accepts
    this.permittedLayers = new Set(["raster", "fill", "circle"]);

    // enables console.logging for debugging purposes in some methods
    this.debug =
      debug !== undefined ? debug : process.env.NODE_ENV !== "production";

    // note: these properties may also be set outside of the constructor
    // but are not intended to be, doing so may have unintended consequences.
    this.map = map;
    this.beforeId = beforeId;
    this.layerType = layerType;
  }

  _getSourceId(id) {
    return `${id}-source`;
  }

  _getLayerId(id) {
    return `${id}-layer`;
  }

  _getSourceDef(value) {
    let source = {};

    if (typeof value === "string" && value.includes("{z}/{x}/{y}")) {
      source.tiles = [value];
      source.tileSize = 256;
      source.type = "raster";
    }

    if (typeof value === "object" && value.type === "FeatureCollection") {
      source.data = value;
      source.type = "geojson";
    }

    return source;
  }

  _getLayerDef(layerId, sourceId, paint, layout) {
    return {
      id: layerId,
      source: sourceId,
      type: this.layerType,
      paint: paint || {},
      layout: layout || {},
    };
  }

  _addLayer(layerId, layerDef, beforeId) {
    if (!this.map.getLayer(layerId)) {
      this.map.addLayer(layerDef, beforeId);
    } else {
      this._warn(`map layer ${layerId} already exists, skipping`);
    }
  }

  _removeLayer(layerId) {
    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }
  }

  _addSource(sourceId, sourceDef) {
    if (!this.map.getSource(sourceId)) {
      this.map.addSource(sourceId, sourceDef);
    } else {
      this._warn(`map source ${sourceId} already exists, skipping`);
    }
  }

  _removeSource(sourceId) {
    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }
  }

  _warn(message) {
    if (this.debug) {
      console.warn(message);
    }
  }

  addMapLayer({ id, asset, visibility, paintProps }) {
    const layerId = this._getLayerId(id);
    const sourceId = this._getSourceId(id);
    const source = this._getSourceDef(asset);
    const layer = this._getLayerDef(layerId, sourceId, paintProps, {
      visibility,
    });
    this._addSource(sourceId, source);
    this._addLayer(layerId, layer, this.beforeId);
  }

  removeMapLayer(id) {
    if (this.mapStyle) {
      const layerId = this._getLayerId(id);
      const sourceId = this._getSourceId(id);
      this._removeLayer(layerId);
      this._removeSource(sourceId);
    }
  }

  removeMapRef() {
    this._map = null;
  }

  get map() {
    return this._map;
  }

  set map(value) {
    if (typeof value === "object" && typeof value.version === "string") {
      this._map = value;
    } else {
      throw new Error("map must be a mapboxgljs map instance");
    }
  }

  get mapStyle() {
    return this.map && this.map.getStyle();
  }

  get beforeId() {
    return this._beforeId;
  }

  set beforeId(value) {
    if (typeof value === "string" || value === undefined) {
      this._beforeId = value;
    } else {
      throw new Error("invalid beforeId value");
    }
  }

  get layerType() {
    return this._layerType;
  }

  set layerType(value) {
    if (this.permittedLayers.has(value)) {
      this._layerType = value;
    } else {
      throw new Error("Invalid layerType value");
    }
  }

  get debug() {
    return this._debug;
  }

  set debug(value) {
    if (typeof value === "boolean") {
      this._debug = value;
    } else {
      throw new Error("Invalid debug value");
    }
  }
}

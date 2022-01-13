/**
 * Class representing a MapboxGLJS layer
 */
export class MapLayerHandler {
  /**
   *
   * @param {Object} options
   * @param {Object} options.map - the mapboxgl.js map instance
   * @param {string|undefined} options.beforeId - the layer id where this layer should be inserted
   * @param {Object} paintProps - the layer style props
   * @param {string} type - the type of layer, e.g. "raster", "geojson"
   */
  constructor({ map, beforeId, paintProps, type }) {
    this.map = map;
    this.beforeId = beforeId;
    this.paintProps = paintProps;
    this.type = type;
  }

  _getSourceId(id) {
    return `${id}-source`;
  }

  _getLayerId(id, index) {
    return `${id}-${index || 0}-layer`;
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

  _getLayerDef(id, sourceId, paint, layout) {
    const type = this.type;
    return {
      id,
      source: sourceId,
      type,
      paint: paint || {},
      layout: layout || {},
    };
  }

  _addLayer(layerId, layerDef, beforeId) {
    if (!this.map.getLayer(layerId)) {
      this.map.addLayer(layerDef, beforeId);
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
    }
  }

  _removeSource(sourceId) {
    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }
  }

  addMapLayer(id, url, index, visibility) {
    const layerId = this._getLayerId(id, index);
    const sourceId = this._getSourceId(layerId);
    const source = this._getSourceDef(url);
    const layer = this._getLayerDef(layerId, sourceId, this.paintProps, {
      visibility,
    });
    this._addSource(sourceId, source);
    this._addLayer(layerId, layer, this.beforeId);
  }

  removeMapLayer(id, index) {
    const layerId = this._getLayerId(id, index);
    const sourceId = this._getSourceId(layerId);
    this._removeLayer(layerId);
    this._removeSource(sourceId);
  }

  get map() {
    return this._map;
  }

  set map(value) {
    if (typeof value === "object") {
      this._map = value;
    } else {
      throw new Error("map must be a mapboxgljs map instance");
    }
  }

  get beforeId() {
    return this._beforeId;
  }

  set beforeId(value) {
    if (typeof value === "string" || value === undefined) {
      this._beforeId = value;
    } else {
      throw new Error("invalid beforeId");
    }
  }

  get paintProps() {
    return this._paintProps;
  }

  set paintProps(value) {
    if (typeof value === "object") {
      this._paintProps = value;
    } else {
      throw new Error("invalid paintProps");
    }
  }

  get type() {
    return this._type;
  }

  set type(value) {
    if (value === "raster" || value === "geojson") {
      this._type = value;
    } else {
      throw new Error("layer type must be raster or geojson");
    }
  }
}

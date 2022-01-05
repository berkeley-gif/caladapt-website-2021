<script>
  import { onDestroy, getContext } from "svelte";
  import equal from "fast-deep-equal";
  import { contextKey } from "~/helpers/mapbox";

  export let mapStyle;
  export let dataLayers = [];

  let prevRasterLayerProps = [];
  let prevMapStyle = mapStyle;

  const VISIBLE = "visible";
  const NONE = "none";

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const paintProps = {
    "raster-opacity": 0.5,
  };

  const getSourceId = (id) => `${id}-source`;

  const getLayerId = (id, index) => `${id}-${index}`;

  const getSourceDef = (tileUrl) => ({
    type: "raster",
    tiles: [tileUrl],
    tileSize: 256,
  });

  const getLayerDef = (id, sourceId, paint, layout) => ({
    id,
    source: sourceId,
    type: "raster",
    paint,
    layout,
  });

  const addLayer = (layerId, layerDef, beforeId) => {
    if (!map.getLayer(layerId)) {
      map.addLayer(layerDef, beforeId);
    }
  };

  const removeLayer = (layerId) => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  };

  const addSource = (sourceId, sourceDef) => {
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, sourceDef);
    }
  };

  const removeSource = (sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  };

  const addMapRasterLayer = (id, url, index, visibility) => {
    const layerId = getLayerId(id, index);
    const sourceId = getSourceId(layerId);
    const source = getSourceDef(url);
    const layer = getLayerDef(layerId, sourceId, paintProps, {
      visibility,
    });
    addSource(sourceId, source);
    addLayer(layerId, layer, beforeId);
  };

  const removeMapRasterLayer = (id, index) => {
    const layerId = getLayerId(id, index);
    const sourceId = getSourceId(layerId);
    removeLayer(layerId);
    removeSource(sourceId);
  };

  const mapLayersProps = ({ id, checked, color, tileUrls }) => ({
    id,
    tileUrls: tileUrls.map((url) => `${url}?style=${color}`),
    visibility: checked ? VISIBLE : NONE,
  });

  if (map && map.getStyle()) {
    map.on("styledata", handleStyleDataChange);
  }

  $: beforeId =
    mapStyle && mapStyle.includes("satellite")
      ? undefined
      : "settlement-subdivision-label";

  $: rasterLayersProps = dataLayers
    .filter((d) => Array.isArray(d.tileUrls) && d.tileUrls.length)
    .map(mapLayersProps);

  $: if (!equal(rasterLayersProps, prevRasterLayerProps)) {
    removePreviousRasterLayers();
    addRasterLayers();
    prevRasterLayerProps = rasterLayersProps;
  }

  function addRasterLayers() {
    rasterLayersProps.forEach(({ id, tileUrls, visibility }) => {
      tileUrls.forEach((url, index) => {
        addMapRasterLayer(id, url, index, visibility);
      });
    });
  }

  function reapplyRasterLayers() {
    rasterLayersProps.forEach(({ id, tileUrls, visibility }) => {
      tileUrls.forEach((url, index) => {
        removeMapRasterLayer(id, index);
        addMapRasterLayer(id, url, index, visibility);
      });
    });
  }

  function removePreviousRasterLayers() {
    prevRasterLayerProps.forEach(({ id, tileUrls }) => {
      tileUrls.forEach((_url, index) => {
        removeMapRasterLayer(id, index);
      });
    });
  }

  function removeRasterLayers() {
    if (!map.getStyle()) {
      return;
    }
    rasterLayersProps.forEach(({ id, tileUrls }) => {
      tileUrls.forEach((_url, index) => {
        removeMapRasterLayer(id, index);
      });
    });
  }

  // keeps the map layers in sync when the map style changes
  function handleStyleDataChange() {
    if (mapStyle !== prevMapStyle) {
      reapplyRasterLayers();
      prevMapStyle = mapStyle;
    }
  }

  onDestroy(() => {
    map.off("styledata", handleStyleDataChange);
    removeRasterLayers();
  });
</script>

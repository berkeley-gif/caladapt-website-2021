<script>
  import { onDestroy, getContext } from "svelte";
  import equal from "fast-deep-equal";
  import { contextKey } from "~/helpers/mapbox";

  export let mapStyle;
  export let dataLayers = [];

  let prevRasterLayerProps;
  let prevMapStyle = mapStyle;

  const VISIBLE = "visible";
  const VISIBILITY = "visibility";
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

  const isVisible = (id) => map.getLayoutProperty(id, VISIBILITY) === VISIBLE;

  const removeLayer = (id) => {
    if (map.getLayer(id)) {
      map.removeLayer(id);
    }
  };

  const removeSource = (sourceId) => {
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  };

  if (map && map.getStyle()) {
    map.on("styledata", handleStyleDataChange);
  }

  $: beforeId =
    mapStyle && mapStyle.includes("satellite")
      ? undefined
      : "settlement-subdivision-label";

  $: rasterLayersProps = dataLayers
    .filter((d) => Array.isArray(d.tileUrls) && d.tileUrls.length)
    .map(({ id, checked, color, tileUrls }) => ({
      id,
      tileUrl: tileUrls.map((url) => `${url}?style=${color}`),
      visibility: checked ? VISIBLE : NONE,
    }));

  $: dataLayerIds = new Set(rasterLayersProps.map((d) => d.id));

  $: if (rasterLayersProps.length) {
    const { layers } = map.getStyle();
    const rasters = layers.filter((d) => dataLayerIds.has(d.id));

    if (Array.isArray(rasters) && rasters.length) {
      maybeToggleRasterVisibility();
    }

    if (Array.isArray(rasters) && !rasters.length) {
      addRasterLayers();
    }
  }

  $: if (!equal(rasterLayersProps, prevRasterLayerProps)) {
    updateRasterLayers();
    prevRasterLayerProps = rasterLayersProps;
  }

  function addRasterLayers() {
    rasterLayersProps.forEach(({ id, tileUrl, visibility }) => {
      tileUrl.forEach((url, i) => {
        const layerId = getLayerId(id, i);
        const sourceId = getSourceId(layerId);
        const source = getSourceDef(url);
        const layer = getLayerDef(layerId, sourceId, paintProps, {
          visibility,
        });
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, source);
        }
        if (!map.getLayer(layerId)) {
          map.addLayer(layer, beforeId);
        }
      });
    });
  }

  function maybeToggleRasterVisibility() {
    rasterLayersProps.forEach(({ id, tileUrl, visibility }) => {
      tileUrl.forEach((_url, i) => {
        const layerId = getLayerId(id, i);
        // toggle visibility to visible
        if (
          map.getLayer(layerId) &&
          !isVisible(layerId) &&
          visibility === VISIBLE
        ) {
          map.setLayoutProperty(layerId, VISIBILITY, VISIBLE);
        }
        // toggle visibility to none
        if (
          map.getLayer(layerId) &&
          isVisible(layerId) &&
          visibility === NONE
        ) {
          map.setLayoutProperty(layerId, VISIBILITY, NONE);
        }
      });
    });
  }

  function updateRasterLayers() {
    rasterLayersProps.forEach(({ id, tileUrl, visibility }) => {
      tileUrl.forEach((url, i) => {
        const layerId = getLayerId(id, i);
        const sourceId = getSourceId(layerId);
        const source = getSourceDef(url);
        const layer = getLayerDef(layerId, sourceId, paintProps, {
          visibility,
        });
        removeLayer(layerId);
        removeSource(sourceId);
        try {
          map.addSource(sourceId, source);
          map.addLayer(layer, beforeId);
        } catch (error) {
          console.error(error);
        }
      });
    });
  }

  function removeRasterLayers() {
    if (!map.getStyle()) {
      return;
    }
    rasterLayersProps.forEach(({ id, tileUrl }) => {
      tileUrl.forEach((_url, i) => {
        const layerId = getLayerId(id, i);
        const sourceId = getSourceId(layerId);
        removeLayer(id);
        removeSource(sourceId);
      });
    });
  }

  // keeps the map layers in sync when the map style changes
  function handleStyleDataChange() {
    if (mapStyle !== prevMapStyle) {
      for (let id of dataLayerIds) {
        if (!map.getLayer(id)) {
          updateRasterLayers();
          break;
        }
      }
      prevMapStyle = mapStyle;
    }
  }

  onDestroy(() => {
    map.off("styledata", handleStyleDataChange);
    removeRasterLayers();
  });
</script>

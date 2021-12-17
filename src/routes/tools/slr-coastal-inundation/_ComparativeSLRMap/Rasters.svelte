<script>
  import { onDestroy } from "svelte";
  import { getTileUrl } from "../_data";

  export let map;
  export let mapStyle;
  export let dataLayers = [];
  export let scenario;
  export let timeFrame;

  // these props only used to determine if raster layers should be updated
  let curScenario;
  let curTimeFrame;
  let styleDataChangeListenerAdded = false;

  const VISIBLE = "visible";
  const VISIBILITY = "visibility";
  const NONE = "none";

  const paintProps = {
    "raster-opacity": 0.5,
  };

  const getSourceDef = (url) => ({
    type: "raster",
    tiles: [url],
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

  const getSourceId = (id) => `${id}-source`;

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

  if (map && map.getStyle() && !styleDataChangeListenerAdded) {
    map.on("styledata", handleStyleDataChange);
    styleDataChangeListenerAdded = true;
  }

  $: beforeId =
    mapStyle && mapStyle.includes("satellite")
      ? undefined
      : "settlement-subdivision-label";

  $: dataLayerIds = new Set(dataLayers.map((d) => d.id));

  $: rasterLayersProps = dataLayers.map(({ id, checked, color }) => ({
    id,
    tileUrl: getTileUrl(id, scenario, timeFrame, "sfbay", color),
    visibility: checked ? VISIBLE : NONE,
  }));

  $: if (scenario !== curScenario) {
    updateRasterLayers();
    curScenario = scenario;
  }

  $: if (timeFrame !== curTimeFrame) {
    updateRasterLayers();
    curTimeFrame = timeFrame;
  }

  $: if (map && rasterLayersProps.length) {
    const { layers } = map.getStyle();
    const rasters = layers.filter((d) => dataLayerIds.has(d.id));

    if (Array.isArray(rasters) && rasters.length) {
      // update raster layers
      maybeToggleRasterVisibility();
    }

    if (Array.isArray(rasters) && !rasters.length) {
      // add raster layers
      addRasterLayers();
    }
  }

  function addRasterLayers() {
    rasterLayersProps.forEach(({ id, tileUrl, visibility }) => {
      const sourceId = getSourceId(id);
      const source = getSourceDef(tileUrl);
      const layer = getLayerDef(id, sourceId, paintProps, { visibility });
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, source);
      }
      if (!map.getLayer(id)) {
        map.addLayer(layer, beforeId);
      }
    });
  }

  function maybeToggleRasterVisibility() {
    rasterLayersProps.forEach(({ id, visibility }) => {
      // toggle visibility to visible
      if (map.getLayer(id) && !isVisible(id) && visibility === VISIBLE) {
        map.setLayoutProperty(id, VISIBILITY, VISIBLE);
      }
      // toggle visibility to none
      if (map.getLayer(id) && isVisible(id) && visibility === NONE) {
        map.setLayoutProperty(id, VISIBILITY, NONE);
      }
    });
  }

  function updateRasterLayers() {
    rasterLayersProps.forEach(({ id, tileUrl, visibility }) => {
      const sourceId = getSourceId(id);
      const source = getSourceDef(tileUrl);
      const layer = getLayerDef(id, sourceId, paintProps, { visibility });
      removeLayer(id);
      removeSource(sourceId);
      try {
        map.addSource(sourceId, source);
        map.addLayer(layer, beforeId);
      } catch (error) {
        console.error(error);
      }
    });
  }

  function removeRasterLayers() {
    if (!map.getStyle()) {
      return;
    }
    rasterLayersProps.forEach(({ id }) => {
      const sourceId = getSourceId(id);
      removeLayer(id);
      removeSource(sourceId);
    });
  }

  // keeps the map layers in sync when the map style changes
  function handleStyleDataChange() {
    const { name } = map.getStyle();
    const identifier = mapStyle.split("-")[0];
    const shouldUpdate = name.toLowerCase().includes(identifier);
    if (shouldUpdate) {
      for (let id of dataLayerIds) {
        if (!map.getLayer(id)) {
          updateRasterLayers();
          break;
        }
      }
    }
  }

  onDestroy(() => {
    map.off("styledata", handleStyleDataChange);
    removeRasterLayers();
  });
</script>

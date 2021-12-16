<script>
  import { onDestroy } from "svelte";
  import { getTileUrl } from "../_data";

  export let map;
  export let mapStyle;
  export let dataLayers = [];
  export let scenario;
  export let timeFrame;

  let curScenario;
  let curTimeFrame;
  let curMapStyle;

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

  $: beforeId =
    mapStyle && mapStyle.includes("satellite")
      ? undefined
      : "settlement-subdivision-label";
  $: dataLayerIds = new Set(dataLayers.map((d) => d.id));
  $: rasterLayersProps = dataLayers.map(({ id, checked, color }) => ({
    id,
    tileUrl: getTileUrl(id, scenario, timeFrame, "sfbay", color),
    visibility: checked ? "visible" : "none",
  }));
  $: console.log("rasterLayersProps: ", rasterLayersProps);

  $: if (scenario !== curScenario) {
    curScenario = scenario;
    updateRasterLayers();
  }
  $: if (timeFrame !== curTimeFrame) {
    curTimeFrame = timeFrame;
    updateRasterLayers();
  }
  $: if (mapStyle !== curMapStyle) {
    curMapStyle = mapStyle;
    removeRasterLayers();
    addRasterLayers();
  }

  $: if (map && rasterLayersProps.length) {
    const { layers } = map.getStyle();
    const rasters = layers.filter((d) => dataLayerIds.has(d.id));
    console.log(rasters);

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
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, source);
      }
      if (!map.getLayer(id)) {
        map.addLayer(
          getLayerDef(id, sourceId, paintProps, { visibility }),
          beforeId
        );
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
    console.log("updateRasterLayers called");

    rasterLayersProps.forEach(({ id, tileUrl, visibility }) => {
      const sourceId = getSourceId(id);
      const source = getSourceDef(tileUrl);
      const layer = getLayerDef(id, sourceId, paintProps, { visibility });
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
      try {
        map.addSource(sourceId, source);
        map.addLayer(layer, beforeId);
      } catch (error) {
        console.error(error);
      }
    });
  }

  function removeRasterLayers() {
    console.log("removeRasterLayers called");
    rasterLayersProps.forEach(({ id }) => {
      const sourceId = getSourceId(id);
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    });
  }

  onDestroy(() => {
    removeRasterLayers();
  });
</script>

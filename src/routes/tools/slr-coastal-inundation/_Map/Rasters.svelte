<script>
  import { onDestroy, getContext } from "svelte";
  import equal from "fast-deep-equal";
  import { contextKey } from "~/helpers/mapbox";
  import { MapLayerHandler } from "./utils";
  import { VISIBLE, NONE } from "../_constants";

  export let mapStyle;
  export let beforeId;
  export let dataLayers = [];

  let prevRasterLayerProps = [];
  let prevMapStyle = mapStyle;

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const paintProps = {
    "raster-opacity": 0.5,
  };

  const mapLayersProps = ({ id, checked, color, tileUrls }) => ({
    id,
    tileUrls: tileUrls.map((url) => `${url}?style=${color}`),
    visibility: checked ? VISIBLE : NONE,
  });

  if (map && map.getStyle()) {
    map.on("styledata", handleStyleDataChange);
  }

  $: layerHandler = new MapLayerHandler({
    map,
    beforeId,
    layerType: "raster",
  });

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
        layerHandler.addMapLayer({
          id,
          asset: url,
          index,
          visibility,
          paintProps,
        });
      });
    });
  }

  function reapplyRasterLayers() {
    rasterLayersProps.forEach(({ id, tileUrls, visibility }) => {
      tileUrls.forEach((url, index) => {
        layerHandler.removeMapLayer(id, index);
        layerHandler.addMapLayer({
          id,
          asset: url,
          index,
          visibility,
          paintProps,
        });
      });
    });
  }

  function removePreviousRasterLayers() {
    prevRasterLayerProps.forEach(({ id, tileUrls }) => {
      tileUrls.forEach((_url, index) => {
        layerHandler.removeMapLayer(id, index);
      });
    });
  }

  function removeRasterLayers() {
    if (!map.getStyle()) {
      return;
    }
    rasterLayersProps.forEach(({ id, tileUrls }) => {
      tileUrls.forEach((_url, index) => {
        layerHandler.removeMapLayer(id, index);
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

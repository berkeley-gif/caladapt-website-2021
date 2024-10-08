<script>
  import { onDestroy, getContext, afterUpdate } from "svelte";
  import equal from "fast-deep-equal";
  import { contextKey } from "~/helpers/mapbox";
  import { MapLayerHandler } from "~/components/tools/Map";
  import { VISIBLE, NONE } from "../_constants";

  export let mapStyle;
  export let beforeId;
  export let dataLayers = [];

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const paintProps = {
    "raster-opacity": 0.5,
  };

  const mapLayersProps = ({ id, checked, color, tileUrls, slugs }) => ({
    id,
    slugs,
    tileUrls: tileUrls.map((url) => `${url}?style=${color}`),
    visibility: checked ? VISIBLE : NONE,
  });

  let prevRasterLayerProps = [];
  let prevMapStyle = mapStyle;
  let layerHandler = new MapLayerHandler({
    map,
    beforeId,
    layerType: "raster",
  });

  if (map && map.getStyle()) {
    map.on("styledata", handleStyleDataChange);
  }

  $: rasterLayersProps = dataLayers
    .filter((d) => Array.isArray(d.tileUrls) && d.tileUrls.length)
    .map(mapLayersProps);

  afterUpdate(() => {
    const areEqual = equal(rasterLayersProps, prevRasterLayerProps);
    const mapLayersActual = map
      .getStyle()
      .layers.filter((d) => /cosmos|calflod/i.test(d.id));
    if (!areEqual) {
      removePreviousRasterLayers();
      addRasterLayers();
      prevRasterLayerProps = rasterLayersProps;
    }
    if (areEqual && !mapLayersActual.length) {
      reapplyRasterLayers();
    }
  });

  onDestroy(() => {
    removeRasterLayers();
    removePreviousRasterLayers();
    layerHandler.removeMapRef();
    layerHandler = null;
    map.off("styledata", handleStyleDataChange);
  });

  function addRasterLayers() {
    rasterLayersProps.forEach(({ tileUrls, visibility, slugs }) => {
      tileUrls.forEach((url, index) => {
        layerHandler.addMapLayer({
          id: slugs[index],
          asset: url,
          visibility,
          paintProps,
        });
      });
    });
  }

  function reapplyRasterLayers() {
    rasterLayersProps.forEach(({ tileUrls, visibility, slugs }) => {
      tileUrls.forEach((url, index) => {
        const slug = slugs[index];
        layerHandler.removeMapLayer(slug);
        layerHandler.addMapLayer({
          id: slug,
          asset: url,
          visibility,
          paintProps,
        });
      });
    });
  }

  function removePreviousRasterLayers() {
    prevRasterLayerProps.forEach(({ tileUrls, slugs }) => {
      tileUrls.forEach((_url, index) => {
        layerHandler.removeMapLayer(slugs[index]);
      });
    });
  }

  function removeRasterLayers() {
    rasterLayersProps.forEach(({ tileUrls, slugs }) => {
      tileUrls.forEach((_url, index) => {
        layerHandler.removeMapLayer(slugs[index]);
      });
    });
  }

  // keeps the map layers in sync when the map style changes
  function handleStyleDataChange() {
    if (mapStyle !== prevMapStyle) {
      layerHandler.beforeId = beforeId;
      reapplyRasterLayers();
      prevMapStyle = mapStyle;
    }
  }
</script>

<script>
  import { onDestroy, getContext, afterUpdate } from "svelte";
  import equal from "fast-deep-equal";
  import { contextKey } from "~/helpers/mapbox";
  import { MapLayerHandler } from "~/components/tools/Map";
  import { VISIBLE, NONE, LAYER_COLORS } from "../_constants";

  export let mapStyle;
  export let beforeId;
  export let dataLayers = [];
  export let geojsons = new Map();

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const getPaintProps = (color) => ({
    "fill-color": color,
    "fill-opacity": 0.5,
    "fill-outline-color": color,
  });

  const mapLayersProps = ({ id, checked, color }) => ({
    id: `${id}-tile-index`,
    color: LAYER_COLORS.get(color),
    data: geojsons.get(id),
    visibility: checked ? VISIBLE : NONE,
  });

  let prevMapStyle = mapStyle;
  let prevLayerProps = [];
  let layerHandler = new MapLayerHandler({
    map,
    beforeId,
    layerType: "fill",
  });

  if (map && map.getStyle()) {
    map.on("styledata", handleStyleDataChange);
  }

  $: layerProps = Boolean(geojsons.size) && dataLayers.map(mapLayersProps);

  afterUpdate(() => {
    if (layerProps && !equal(layerProps, prevLayerProps)) {
      removePreviousLayers();
      addGeoJsonLayers();
      prevLayerProps = layerProps;
    }
  });

  function addGeoJsonLayers() {
    layerProps.forEach(({ id, visibility, data, color }) => {
      layerHandler.addMapLayer({
        id,
        asset: data,
        visibility,
        paintProps: getPaintProps(color),
      });
    });
  }

  function removeGeoJsonLayers() {
    layerProps.forEach(({ id }) => {
      layerHandler.removeMapLayer(id);
    });
  }

  function removePreviousLayers() {
    prevLayerProps.forEach(({ id }) => {
      layerHandler.removeMapLayer(id);
    });
  }

  function reapplyGeoJsonLayers() {
    layerProps.forEach(({ id, visibility, data, color }) => {
      layerHandler.removeMapLayer(id);
      layerHandler.addMapLayer({
        id,
        asset: data,
        visibility,
        paintProps: getPaintProps(color),
      });
    });
  }

  // keeps the map layers in sync when the map style changes
  function handleStyleDataChange() {
    if (mapStyle !== prevMapStyle) {
      layerHandler.beforeId = beforeId;
      reapplyGeoJsonLayers();
      prevMapStyle = mapStyle;
    }
  }

  onDestroy(() => {
    map.off("styledata", handleStyleDataChange);
    removeGeoJsonLayers();
    removePreviousLayers();
    layerHandler.removeMapRef();
    layerHandler = null;
  });
</script>

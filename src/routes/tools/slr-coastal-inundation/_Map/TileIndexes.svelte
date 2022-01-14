<script>
  import { onMount, onDestroy, getContext } from "svelte";
  import equal from "fast-deep-equal";
  import { contextKey } from "~/helpers/mapbox";
  import { getGeoJson } from "../_data";
  import { MapLayerHandler } from "./utils";
  import { VISIBLE, NONE, LAYER_COLORS } from "../_constants";

  export let mapStyle;
  export let beforeId;
  export let dataLayers = [];

  let prevMapStyle = mapStyle;
  let prevLayerProps = [];
  let geojsons = new Map();

  const layers = dataLayers.map((d) => d.id);

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const getPaintProps = (color) => ({
    "fill-color": color,
    "fill-opacity": 0.5,
    "fill-outline-color": color,
  });

  const mapLayersProps = ({ id, checked, color }) => ({
    id,
    color: LAYER_COLORS.get(color),
    data: geojsons.get(id),
    visibility: checked ? VISIBLE : NONE,
  });

  if (map && map.getStyle()) {
    map.on("styledata", handleStyleDataChange);
  }

  $: layerHandler = new MapLayerHandler({
    map,
    beforeId,
    layerType: "fill",
  });

  $: layerProps = Boolean(geojsons.size) && dataLayers.map(mapLayersProps);

  $: if (layerProps && !equal(layerProps, prevLayerProps)) {
    removePreviousLayers();
    addGeoJsonLayers();
    prevLayerProps = layerProps;
  }

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
      reapplyGeoJsonLayers();
      prevMapStyle = mapStyle;
    }
  }

  onMount(async () => {
    try {
      const data = await getGeoJson(layers);
      geojsons = new Map(data.map((d) => [d.id, d]));
    } catch (error) {
      console.log(error);
    }
  });

  onDestroy(() => {
    map.off("styledata", handleStyleDataChange);
    removeGeoJsonLayers();
    removePreviousLayers();
  });
</script>

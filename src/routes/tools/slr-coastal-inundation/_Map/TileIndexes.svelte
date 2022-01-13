<script>
  import { onMount, getContext } from "svelte";
  import equal from "fast-deep-equal";
  import { contextKey } from "~/helpers/mapbox";
  import { getGeoJson } from "../_data";
  import { MapLayerHandler } from "./utils";
  import { VISIBLE, NONE, LAYER_COLORS } from "../_constants";

  export let mapStyle;
  export let dataLayers = [];

  let prevMapStyle = mapStyle;
  let prevLayerProps = [];
  let geojsons = new Map();

  const layers = dataLayers.map((d) => d.id);

  const { getMap } = getContext(contextKey);
  const map = getMap();

  // to do: colors should be dynamic
  const paintProps = {
    "fill-color": "#25c7fa",
    "fill-opacity": 0.5,
    "fill-outline-color": "#25c7fa",
  };

  const mapLayersProps = ({ id, checked, color }) => ({
    id,
    color: LAYER_COLORS.get(color),
    data: geojsons.get(id),
    visibility: checked ? VISIBLE : NONE,
  });

  if (map && map.getStyle()) {
    map.on("styledata", handleStyleDataChange);
  }

  $: beforeId =
    mapStyle && mapStyle.includes("satellite")
      ? undefined
      : "settlement-subdivision-label";

  $: layerHandler = new MapLayerHandler({
    map,
    beforeId,
    paintProps,
    layerType: "fill",
  });

  $: layerProps = Boolean(geojsons.size) && dataLayers.map(mapLayersProps);

  $: if (layerProps && !equal(layerProps, prevLayerProps)) {
    console.log("adding/updating tile index layers...");
    removePreviousLayers();
    addGeoJsonLayers();
    prevLayerProps = layerProps;
  }

  function addGeoJsonLayers() {
    layerProps.forEach(({ id, visibility, data }) => {
      layerHandler.addMapLayer(id, data, 0, visibility);
    });
  }

  function removeGeoJsonLayers() {
    layerProps.forEach(({ id }) => {
      layerHandler.removeMapLayer(id, 0);
    });
  }

  function removePreviousLayers() {
    prevLayerProps.forEach(({ id }) => {
      layerHandler.removeMapLayer(id, 0);
    });
  }

  function reapplyGeoJsonLayers() {
    layerProps.forEach(({ id, visibility, data }) => {
      layerHandler.removeMapLayer(id, 0);
      layerHandler.addMapLayer(id, data, 0, visibility);
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

    return () => {
      map.off("styledata", handleStyleDataChange);
      removeGeoJsonLayers();
    };
  });
</script>

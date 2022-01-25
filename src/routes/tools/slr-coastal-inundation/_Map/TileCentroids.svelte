<script>
  import { onDestroy, getContext, afterUpdate } from "svelte";
  import equal from "fast-deep-equal";
  import { contextKey } from "~/helpers/mapbox";
  import { MapLayerHandler } from "./utils";
  import { VISIBLE, NONE, LAYER_COLORS } from "../_constants";

  export let mapStyle;
  export let beforeId; // TODO: beforeId should be city labels for low zooms
  export let dataLayers = [];
  export let centroids;

  let prevMapStyle = mapStyle;
  let prevLayerProps = [];

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const paintProps = {
    "circle-color": LAYER_COLORS.get("rsblue"),
  };

  const mapLayersProps = ({ id, checked }) => ({
    id: `${id}-centroids`,
    data: centroids,
    visibility: checked ? VISIBLE : NONE,
  });

  if (map && map.getStyle()) {
    map.on("styledata", handleStyleDataChange);
  }

  $: layerHandler = new MapLayerHandler({
    map,
    beforeId,
    layerType: "circle",
  });

  $: layerProps =
    Boolean(centroids) &&
    dataLayers.filter((d) => d.id.includes("5m")).map(mapLayersProps);

  afterUpdate(() => {
    if (layerProps && !equal(layerProps, prevLayerProps)) {
      removePreviousLayer();
      addCentroidsLayer();
      prevLayerProps = layerProps;
    }
  });

  function addCentroidsLayer() {
    layerProps.forEach(({ id, visibility, data }) => {
      layerHandler.addMapLayer({
        id,
        asset: data,
        visibility,
        paintProps,
      });
    });
  }

  function removeCentroidsLayer() {
    layerProps.forEach(({ id }) => {
      layerHandler.removeMapLayer(id);
    });
  }

  function removePreviousLayer() {
    prevLayerProps.forEach(({ id }) => {
      layerHandler.removeMapLayer(id);
    });
  }

  function reapplyCentroidsLayer() {
    removeCentroidsLayer();
    addCentroidsLayer();
  }

  function handleStyleDataChange() {
    if (mapStyle !== prevMapStyle) {
      reapplyCentroidsLayer();
      prevMapStyle = mapStyle;
    }
  }

  onDestroy(() => {
    removeCentroidsLayer();
    removePreviousLayer();
    map.off("styledata", handleStyleDataChange);
    layerHandler.removeMapRef();
    layerHandler = null;
  });
</script>

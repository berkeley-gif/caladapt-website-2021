<script>
  import { getContext, onMount, onDestroy } from "svelte";
  import { contextKey } from "~/helpers/mapbox";

  export let id = "";
  export let tileURL = "";
  export let paintProps = {};
  export let beforeId = "settlement-subdivision-label";

  let layer;
  let source;
  let sourceId;

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const getSourceDef = (url) => ({
    type: "raster",
    tiles: [url],
    tileSize: 256,
  });

  const getLayerDef = (id, source, paint) => ({
    id,
    source,
    type: "raster",
    paint,
  });

  const addRasterLayer = () => {
    map.addSource(sourceId, source);
    map.addLayer(layer, beforeId);
  };

  const removeRasterLayer = () => {
    map.removeLayer(id);
    map.removeSource(sourceId);
  };

  const hasSource = () =>
    Boolean(map.getSource(sourceId)) && map.isSourceLoaded(sourceId);
  const hasLayer = () => Boolean(map.getStyle()) && Boolean(map.getLayer(id));

  $: if (tileURL && tileURL.length) {
    sourceId = `${id}-source`;
    source = getSourceDef(tileURL);
    layer = getLayerDef(id, sourceId, paintProps);
  }

  $: if (hasSource() && tileURL) {
    removeRasterLayer();
    addRasterLayer();
  }

  onMount(() => {
    addRasterLayer();
  });

  onDestroy(() => {
    if (hasLayer() || hasSource()) {
      removeRasterLayer();
    }
  });
</script>

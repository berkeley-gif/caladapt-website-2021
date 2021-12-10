<script>
  import { getContext, onMount, onDestroy } from "svelte";
  import { contextKey } from "~/helpers/mapbox";

  export let id = "";
  export let tileURL = "";
  export let paintProps = {};
  export let beforeId = "settlement-subdivision-label";

  // TODO: handle source & layer update

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const getSource = (url) => ({
    type: "raster",
    tiles: [url],
    tileSize: 256,
  });

  const getLayer = (id, source, paint) => ({
    id,
    source,
    type: "raster",
    paint,
  });

  let layer;
  let source;
  let sourceId;

  $: if (tileURL && tileURL.length) {
    sourceId = `${id}-source`;
    source = getSource(tileURL);
    layer = getLayer(id, sourceId, paintProps);
  }

  onMount(() => {
    map.addSource(sourceId, source);
    map.addLayer(layer, beforeId);
  });

  onDestroy(() => {
    if (map.getStyle() && map.getLayer(id)) {
      map.removeLayer(id);
      map.removeSource(sourceId);
    }
  });
</script>

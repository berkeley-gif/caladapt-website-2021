<script>
  import { getContext, onMount, onDestroy } from "svelte";
  import { contextKey } from "~/helpers/mapbox";

  export let id = "";
  export let tileURL = "";
  export let beforeId = "settlement-subdivision-label";

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const getLayer = (id, url) => ({
    id,
    type: "raster",
    paint: {},
    source: {
      type: "raster",
      tiles: [url],
      tileSize: 256,
    },
  });

  let layer;

  $: if (tileURL && tileURL.length) {
    layer = getLayer(id, tileURL);
  }

  onMount(() => {
    // add source & layer
    map.addLayer(layer, beforeId);
  });

  onDestroy(() => {
    // remove source & layer
    if (map.getStyle() && map.getLayer(id)) {
      map.removeLayer(id);
    }
  });
</script>

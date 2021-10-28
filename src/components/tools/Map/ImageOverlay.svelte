<script>
  import { getContext, onMount, onDestroy } from "svelte";
  import { contextKey } from "~/helpers/mapbox";

  const { getMap } = getContext(contextKey);
  const map = getMap();

  export let overlay;
  export let coordinates = [
    [-124.60693359374999, 43.723474896114794],
    [-113.291015625, 43.723474896114794],
    [-113.291015625, 31.034108344903512],
    [-124.60693359374999, 31.034108344903512],
  ];
  export let debug = false;
  export let beforeId = undefined;

  $: overlay, updatePath();

  function updatePath() {
    if (debug) console.log("updated overlay", overlay);
    if (map.getSource("animation-layer")) {
      map.getSource("animation-layer").updateImage({ url: overlay });
    }
  }

  let layer = {
    id: "animation-layer",
    type: "raster",
    source: {
      type: "image",
      url: overlay,
      coordinates,
    },
    paint: {
      "raster-fade-duration": 0,
    },
  };

  onMount(() => {
    if (debug) console.log("on mount mapImageOverlay", overlay);
    map.addLayer(layer, beforeId);
  });

  onDestroy(() => {
    if (map.getStyle() && map.getLayer(layer.id)) {
      map.removeLayer(layer);
    }
  });
</script>

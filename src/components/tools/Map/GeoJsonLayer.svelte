<script>
  import { getContext } from "svelte";
  import { contextKey } from "~/helpers/mapbox";

  export let data;
  export let layerName = "geojson-layer";
  export let styleType = "fill";
  export let styleProps = {
    "fill-color": "#333",
    "fill-opacity": 0.8,
  };
  export let layout = {
    visibility: "visible",
  };

  const { getMap } = getContext(contextKey);
  const map = getMap();

  $: if (data && typeof data === "object") {
    map.addSource(layerName, {
      type: "geojson",
      data,
    });

    map.addLayer({
      id: `${layerName}-layer`,
      type: styleType,
      source: layerName,
      layout,
      paint: styleProps,
    });
  }
</script>

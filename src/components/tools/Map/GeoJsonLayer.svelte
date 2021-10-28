<script>
  import { getContext, onDestroy } from "svelte";
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
  export let beforeId = undefined;

  const { getMap } = getContext(contextKey);
  const map = getMap();

  $: sourceName = `${layerName}-source`;

  $: if (data && typeof data === "object") {
    map.addSource(sourceName, {
      type: "geojson",
      data,
    });

    map.addLayer(
      {
        id: layerName,
        type: styleType,
        source: sourceName,
        layout,
        paint: styleProps,
      },
      beforeId
    );
  }

  onDestroy(() => {
    if (map.getStyle() && map.getLayer(layerName)) {
      map.removeLayer(layerName);
      map.removeSource(sourceName);
    }
  });
</script>

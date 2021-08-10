<script>
  import { getContext, onDestroy } from "svelte";
  import { contextKey } from "./../../../helpers/mapbox";

  const { getMap } = getContext(contextKey);
  const map = getMap();

  export let data;
  export let id = "boundary-selection";

  $: if (data) {
    if (map.getLayer(id)) {
      map.getSource(id).setData(data);
    } else {
      map.addLayer({
        id,
        type: "line",
        source: {
          type: "geojson",
          data,
        },
        layout: {},
        paint: {
          "line-opacity": 1,
          "line-width": 3,
          "line-color": "black",
        },
      });
    }
  } else {
    if (map.getLayer(id)) {
      map.removeLayer(id);
      map.removeSource(id);
    }
  }

  onDestroy(() => {
    if (map.getStyle() && map.getLayer(id)) {
      map.removeLayer(id);
      map.removeSource(id);
    }
  });
</script>

<script>
  import { getContext, onDestroy, onMount } from "svelte";
  import { contextKey } from "./../../../helpers/mapbox";

  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapboxgl = getMapbox();

  export let data;
  export let label;

  const popup = new mapboxgl.Popup({ offset: 25 }).setText(label);
  $: if (data) {
    marker.setLngLat(data).setPopup(popup);
  }

  const marker = new mapboxgl.Marker()
    .setLngLat(data)
    .setPopup(popup)
    .addTo(map);

  onDestroy(() => {
    marker.remove();
  });
</script>

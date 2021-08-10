<script>
  import { getContext } from "svelte";
  import { contextKey } from "./../../../../helpers/mapbox.js";

  export let position = "top-left";
  export let options = {};

  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapboxgl = getMapbox();

  const geolocate = new mapboxgl.GeolocateControl(options);
  map.addControl(geolocate, position);
</script>

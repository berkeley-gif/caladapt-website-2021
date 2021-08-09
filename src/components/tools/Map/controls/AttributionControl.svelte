<script>
  import { getContext } from "svelte";
  import { contextKey } from "./../../../../helpers/mapbox.js";

  export let position = "bottom-right";
  export let options = {};

  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapboxgl = getMapbox();

  const attrib = new mapboxgl.AttributionControl(options);
  map.addControl(attrib, position);
</script>

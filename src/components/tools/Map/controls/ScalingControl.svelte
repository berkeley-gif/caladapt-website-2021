<script>
  import { getContext } from "svelte";
  import { contextKey } from "./../../../../helpers/mapbox.js";

  export let position = "bottom-right";
  export let options = {};

  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapboxgl = getMapbox();

  const optionsWithDefaults = Object.assign(
    {
      maxWidth: 80,
      unit: "imperial",
    },
    options
  );

  const scale = new mapboxgl.ScaleControl(optionsWithDefaults);
  map.addControl(scale, position);
</script>

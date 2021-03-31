<script>
  import { getContext } from 'svelte';
  import { contextKey } from './../../../helpers/mapbox';

  const { getMap } = getContext(contextKey);
  const map = getMap();

  export let layer;
  export let show = true;

  map.addLayer(layer);

  $: if (show) {
    layer.layout.visibility = 'visible';
  } else {
    layer.layout.visibility = 'none';
  }
</script>

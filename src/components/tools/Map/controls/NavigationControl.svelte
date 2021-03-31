<script>
	import { getContext } from 'svelte';
  import { contextKey } from './../../../../helpers/mapbox.js';
	
  export let position = 'top-right';
  export let options = {};

  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapboxgl = getMapbox();
  
  const nav = new mapboxgl.NavigationControl(options);
  map.addControl(nav, position);
</script>
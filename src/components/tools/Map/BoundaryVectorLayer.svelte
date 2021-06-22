<script>
  import { getContext } from 'svelte';
  import { contextKey } from './../../../helpers/mapbox';

  const { getMap } = getContext(contextKey);
  const map = getMap();

  export let boundary;

  let lastBoundary = null;

  function removePreviousSelection() {
    if (!lastBoundary) {
      return;
    }
    lastBoundary.layout.visibility = 'none ';
    map.removeLayer(lastBoundary.id);
    if (map.getSource(lastBoundary.id)) {
      map.removeSource(lastBoundary.id);
    }
  }

  function addBoundary() {
    removePreviousSelection();
    if (!boundary || boundary.id === 'locagrid' || boundary.id === 'ca') {
      lastBoundary = null;
      return;
    }
    //boundary.layout.visibility = 'visible';
    map.addLayer(boundary);
    lastBoundary = boundary;
  }

  $: boundary, addBoundary();
</script>

<script>
  import simplifyGeom from '@turf/simplify';
// Helpers
  import { mapboxgl } from './../../../helpers/mapbox';

  // Props
  //-------
  export let width = 150;
  export let height = 150;
  export let location = null;
  export let zoom = 5;
  export let style = 'cal-adapt/cjivy3e8o6d9y2rnnhsqo0sj0';

  $: geometry = location.geometry;
  $: if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    geometry = simplifyGeom(geometry, { tolerance: 0.01, mutate: true })
  }
  $: overlay = encodeURIComponent(JSON.stringify(geometry));
  $: lon = location.center[0];
  $: lat = location.center[1];
  $: src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${lon},${lat},${zoom}/${width}x${height}?access_token=${mapboxgl.accessToken}`;

  let container;

</script>

<div class="static-map" bind:this={container}>
  <img {src} alt="Location map">
</div>
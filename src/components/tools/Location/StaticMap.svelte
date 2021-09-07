<script>
  import simplify from "@turf/simplify";

  // Helpers
  import { mapboxgl } from "./../../../helpers/mapbox";

  // Props
  export let width = 150;
  export let height = 150;
  export let location = null;
  export let style = "mapbox/streets-v11";
  export let padding = 50;
  export let zoom = 8;
  export let alt = "location map";

  let img;
  let src;
  let bounds;
  let geojson;
  let overlay;
  let loading;
  let error;

  function load() {
    loading = true;
    error = false;
    img.src = src;
    img.onload = () => {
      loading = false;
    };
    img.onerror = () => {
      loading = false;
      error = true;
    };
  }

  $: if (location) {
    if (location.geometry.type === "Point") {
      geojson = location.geometry;
      const [lng, lat] = geojson.coordinates;
      // Use zoom for point geometry to prevent returned image from
      // being zoomed all the way in
      bounds = `${lng},${lat},${zoom}`;
      overlay = encodeURIComponent(JSON.stringify(geojson));
      // Padding cannot be used without the auto parameter/bounding box.
      src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?&access_token=${mapboxgl.accessToken}`;
    } else {
      // Add style for non point geometry
      geojson = {
        type: "Feature",
        properties: {
          "fill-opacity": 0,
          "stroke-width": 3,
        },
        geometry: location.geometry,
      };
      const simplifiedGeojson = simplify(geojson, { tolerance: 0.01 });
      bounds = "auto";
      overlay = encodeURIComponent(JSON.stringify(simplifiedGeojson));
      src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?padding=${padding}&access_token=${mapboxgl.accessToken}`;
    }
  }

  $: if (img && src !== undefined) load();
</script>

<style>
  div.static-map {
    position: relative;
    box-shadow: var(--box-shadow);
  }
  img {
    width: 100%;
  }
  img.loading {
    opacity: 0;
  }
  img:not(.loading) {
    opacity: 1;
    transition: opacity 250ms ease-out;
  }
  .hide {
    display: none;
  }
</style>

<div class="static-map">
  {#if loading}
    <span>Loading map of location...</span>
  {/if}
  {#if error}
    <span>Unable to load map</span>
  {/if}
  <img
    {...$$restProps}
    bind:this="{img}"
    class:loading
    class:hide="{error}"
    on:click
    on:mouseover
    on:mouseenter
    on:mouseout
    src="{src}"
    alt="{alt}"
  />
</div>

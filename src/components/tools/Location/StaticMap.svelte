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

  function createPolygonImgSrc({ geometry }) {
    // Add style for non point geometry
    const geojson = {
      type: "Feature",
      properties: {
        "fill-opacity": 0,
        "stroke-width": 3,
      },
      geometry,
    };
    const bounds = "auto";
    // The Static Images API only accepts requests that are 8,192 or fewer characters long. Reduce the length of the geojson overlay or request a static map without the overlay
    let overlay;
    let simplifiedGeojson;
    const geojsonString = JSON.stringify(geojson);

    if (geojsonString.length < 7000) {
      overlay = encodeURIComponent(geojsonString);
    } else {
      // Simplify geometry for more complex shapes
      simplifiedGeojson = simplify(geojson, {
        tolerance: 0.005,
        highQuality: true,
      });
      // Simplify further for even more complex shapes (e.g. state boundaries)
      if (JSON.stringify(simplifiedGeojson).length > 8000) {
        simplifiedGeojson = simplify(geojson, {
          tolerance: 0.1,
          highQuality: false,
        });
      }
      overlay = encodeURIComponent(JSON.stringify(simplifiedGeojson));
    }

    return `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?padding=${padding}&access_token=${mapboxgl.accessToken}`;
  }

  $: if (location) {
    if (location.geometry.type === "Point") {
      const geojson = location.geometry;
      const [lng, lat] = location.center;
      // Set bounds to use zoom instead of auto
      // This prevents static image from being zoomed too detailed
      // Note: Padding cannot be used in conjunction with zoom.
      const bounds = `${lng},${lat},${zoom}`;
      const overlay = encodeURIComponent(JSON.stringify(geojson));
      src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?&access_token=${mapboxgl.accessToken}`;
    } else {
      src = createPolygonImgSrc(location);
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

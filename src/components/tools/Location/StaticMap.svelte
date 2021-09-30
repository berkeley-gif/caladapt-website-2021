<script>
  import simplify from "@turf/simplify";
  import truncate from "@turf/truncate";

  // Helpers
  import { mapboxgl } from "~/helpers/mapbox";
  import { serialize } from "~/helpers/utilities";

  // Props
  export let width = 150;
  export let height = 150;
  export let location = null;
  export let style = "mapbox/streets-v11";
  export let padding = 50;
  export let zoom = 8;
  export let alt = "location map";

  const { accessToken } = mapboxgl;
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

  function createSrcUrl({ overlay, bounds, params }) {
    return `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?${serialize(
      params
    )}`;
  }

  function createOverlay(geojson, tolerance = 0.005) {
    const geojsonString = JSON.stringify(geojson);
    if (geojsonString.length < 7000) {
      return encodeURIComponent(geojsonString);
    }
    const simplifiedGeojson = simplify(geojson, {
      tolerance,
      highQuality: true,
    });
    return createOverlay(simplifiedGeojson, tolerance + 0.05);
  }

  function getPointImgSrc({ geometry, center }) {
    // Set bounds to use zoom instead of auto
    // This prevents static image from being zoomed in too much
    // Note: Padding cannot be used in conjunction with zoom.
    const bounds = `${center[0]},${center[1]},${zoom}`;
    const overlay = createOverlay(geometry);
    const params = { access_token: accessToken };
    return createSrcUrl({ overlay, bounds, params });
  }

  function getPolygonImgSrc({ geometry }) {
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
    const params = { access_token: accessToken, padding };
    // The Mapbox Static Images API only accepts requests that are 8,192 or fewer characters long.
    // Truncate coordinate precision
    const truncatedGeojson = truncate(geojson, { precision: 4 });
    // Simplify geometry
    const overlay = createOverlay(truncatedGeojson);
    return createSrcUrl({ overlay, bounds, params });
  }

  function handleLocation(feature) {
    if (feature.geometry.type === "Point") {
      src = getPointImgSrc(location);
    } else {
      src = getPolygonImgSrc(location);
    }
  }

  $: if (location && location.geometry) handleLocation(location);
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

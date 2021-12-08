<script>
  import { fade } from "svelte/transition";
  import { InlineLoading } from "carbon-components-svelte";
  import simplify from "@turf/simplify";
  import truncate from "@turf/truncate";

  // Helpers
  import { mapboxgl } from "~/helpers/mapbox";
  import { serialize, debounce } from "~/helpers/utilities";

  // Props
  export let height = 150;
  export let location = null;
  export let style = "mapbox/streets-v11";
  export let padding = 50;
  export let zoom = 8;

  const { accessToken } = mapboxgl;
  const MAX_IMG_HEIGHT = 250;

  const image = new Image();
  image.onload = () => {
    loading = false;
    loaded = true;
  };
  image.onerror = () => {
    loading = false;
    error = true;
  };

  let loading = true;
  let loaded = false;
  let error = false;
  let width;
  let src;

  height = Math.min(height, MAX_IMG_HEIGHT);

  $: valid = isValidNumber(width) && isValidNumber(height);
  $: alt = location ? `map of ${location.title}` : "";

  $: if (valid && width && location && location.geometry) {
    handleLocation(location);
  }

  $: if (src) image.src = src;

  $: console.log(src);

  function isValidNumber(value) {
    return typeof value === "number" && !isNaN(value);
  }

  function createSrcUrl({ overlay, bounds, params }) {
    src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?${serialize(
      params
    )}`;
  }

  function createOverlay(geojson, tolerance = 0.005) {
    const overlay = encodeURIComponent(JSON.stringify(geojson));
    if (overlay.length < 7500) {
      return overlay;
    }
    const simplifiedGeojson = simplify(geojson, {
      tolerance,
      highQuality: true,
    });
    return createOverlay(simplifiedGeojson, tolerance + 0.05);
  }

  function getPointImgSrc({ geometry, center }) {
    // Add marker color for point geometry
    const geojson = {
      type: "Feature",
      properties: {
        "marker-color": "#ff005e",
      },
      geometry,
    };
    // Set bounds to use zoom instead of auto
    // This prevents static image from being zoomed in too much
    const bounds = `${center[0]},${center[1]},${zoom}`;
    const overlay = createOverlay(geojson);
    // Padding cannot be used if bounds has zoom.
    const params = { access_token: accessToken };
    createSrcUrl({ overlay, bounds, params });
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
    // Reduce coordinate precision
    const truncatedGeojson = truncate(geojson, { precision: 4 });
    // Simplify geometry
    const overlay = createOverlay(truncatedGeojson);
    createSrcUrl({ overlay, bounds, params });
  }

  const handleLocation = debounce(
    function (feature) {
      if (feature.geometry.type === "Point") {
        getPointImgSrc(location);
      } else {
        getPolygonImgSrc(location);
      }
    },
    200,
    false
  );
</script>

<style>
  button {
    all: unset;
    cursor: pointer;
    border: 1px solid var(--gray-80);
    min-height: 250px;
    height: auto;
    width: 100%;
  }

  button:hover {
    box-shadow: var(--box-shadow);
  }

  button:focus {
    outline: 2px solid var(--gray-100);
  }

  .loading-msg,
  .error-text {
    padding: var(--spacing-32);
  }
</style>

<div bind:clientWidth="{width}">
  <button on:click>
    {#if loading}
      <div class="loading-msg">
        <InlineLoading description="Loading location map..." />
      </div>
    {:else if loaded}
      <img
        {...$$restProps}
        style="{$$restProps.style}"
        width="{width}"
        height="{height}"
        src="{src}"
        alt="{alt}"
        transition:fade
      />
    {:else if error}
      <div class="error-text">An error occurred. Unable to load map.</div>
    {/if}
  </button>
</div>

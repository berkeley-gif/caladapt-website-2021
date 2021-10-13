<script>
  import { fade } from "svelte/transition";
  import { InlineLoading } from "carbon-components-svelte";
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

  const { accessToken } = mapboxgl;
  // Set to `true` when `loaded` is `true` and `error` is false
  let loading = false;
  // Set to `true` when the image is loaded
  let loaded = false;
  // Set to `true` if an error occurs when loading the image
  let error = false;
  let image;

  const loadImage = (url) => {
    image = null;
    loaded = false;
    image = new Image();
    error = false;
    image.src = url;
    image.onload = () => (loaded = true);
    image.onerror = () => (error = true);
  };

  function createSrcUrl({ overlay, bounds, params }) {
    return `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?${serialize(
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
    // Set bounds to use zoom instead of auto
    // This prevents static image from being zoomed in too much
    const bounds = `${center[0]},${center[1]},${zoom}`;
    const overlay = createOverlay(geometry);
    // Padding cannot be used if bounds has zoom.
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
    // Reduce coordinate precision
    const truncatedGeojson = truncate(geojson, { precision: 4 });
    // Simplify geometry
    const overlay = createOverlay(truncatedGeojson);
    return createSrcUrl({ overlay, bounds, params });
  }

  function handleLocation(feature) {
    if (feature.geometry.type === "Point") {
      return getPointImgSrc(location);
    } else {
      return getPolygonImgSrc(location);
    }
  }

  $: src = location && location.geometry ? handleLocation(location) : "";
  $: alt = location ? `map of ${location.title}` : "";
  $: if (src) loadImage(src);
</script>

<style>
  .static-map {
    all: unset;
    cursor: pointer;
  }

  .static-map:hover {
    box-shadow: var(--box-shadow);
  }

  .static-map:focus {
    outline: 1px solid var(--gray-80);
  }

  .error-text {
    padding: var(--spacing-32);
  }
</style>

<button class="static-map" on:click>
  {#if loading}
    <InlineLoading description="Loading location map..." />
  {/if}
  {#if loaded}
    <img
      {...$$restProps}
      style="width: 100%;{$$restProps.style}"
      src="{src}"
      alt="{alt}"
      transition:fade
    />
  {/if}
  {#if error}
    <div class="error-text">An error occurred. Unable to load map.</div>
  {/if}
</button>

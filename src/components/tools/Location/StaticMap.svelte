<script>
  import { ImageLoader, InlineLoading } from "carbon-components-svelte";
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
  let img;
  let src;
  let loading;
  let error;
  let alt;

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
    const overlay = encodeURIComponent(JSON.stringify(geojson));
    if (overlay.length < 11000) {
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
    alt = `map of ${feature.title}`;
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
    box-shadow: var(--box-shadow);
  }

  .error-text {
    padding: var(--spacing-32);
  }
</style>

<div class="static-map">
  <ImageLoader src="{src}" ratio="1x1" alt="{alt}" fadeIn>
    <div slot="loading">
      <InlineLoading description="Loading location map..." />
    </div>
    <div slot="error">
      <span class="error-text">An error occurred. Unable to load map.</span>
    </div>
  </ImageLoader>
</div>

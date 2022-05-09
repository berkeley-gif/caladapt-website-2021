<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { InlineLoading, Button, Tile } from "carbon-components-svelte";
  import simplify from "@turf/simplify";
  import truncate from "@turf/truncate";

  // Helpers
  import { mapboxgl } from "~/helpers/mapbox";
  import { serialize, debounce, isValidNumber } from "~/helpers/utilities";
  import { logException } from "~/helpers/logging";

  // Props
  export let height = 150;
  export let location = null;
  export let style = "mapbox/streets-v11";
  export let padding = 50;
  export let zoom = 8;
  export let useButton = true;

  const { accessToken } = mapboxgl;
  const MAX_IMG_HEIGHT = 250;

  let MapWrapper;
  let image;
  let state = "pending";
  let width;
  let src;

  height = Math.min(height, MAX_IMG_HEIGHT);

  $: valid = isValidNumber(width) && isValidNumber(height);
  $: ariaLabel = useButton && location ? "Change location" : undefined;
  $: altText = location ? `Locator map for ${location.title}` : "";
  $: if (valid && width && location && location.geometry) {
    handleLocation(location);
  }
  $: if (src) image.src = src;
  $: if (location) state = "pending";

  onMount(() => {
    MapWrapper = useButton ? Button : Tile;
    image = new Image();
    image.onload = () => {
      state = "loaded";
    };
    image.onerror = () => {
      state = "error";
      logException(
        `StaticMap image failed for ${location && location.title} at ${
          location && location.center && location.center.join(",")
        }`
      );
    };
  });

  function createSrcUrl({ overlay, bounds, params }) {
    src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?${serialize(
      params
    )}`;
  }

  // FIXME: this creates invalid geometries for some boundaries, e.g. Tehama County
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
    // The Mapbox Static Images API only accepts requests that are 8,192 or
    // fewer characters long. So we...
    // 1. reduce coordinate precision
    const truncatedGeojson = truncate(geojson, {
      precision: 4,
      coordinates: 2,
    });
    // 2. simplify the geometry
    const overlay = createOverlay(truncatedGeojson);
    createSrcUrl({ overlay, bounds, params });
  }

  const handleLocation = debounce(
    (feature) => {
      try {
        if (feature.geometry.type === "Point") {
          getPointImgSrc(location);
        } else {
          getPolygonImgSrc(location);
        }
      } catch (error) {
        console.warn(error);
        state = "error";
      }
    },
    200,
    false
  );
</script>

<style lang="scss">
  div > :global(.bx--btn.bx--btn--primary) {
    all: unset;
    cursor: pointer;
    min-height: 250px;
    height: auto;
    width: 100%;

    &:hover {
      box-shadow: var(--box-shadow);
    }

    &:focus {
      outline: 2px solid var(--gray-100);
    }
  }

  div > :global(.bx--tile) {
    width: 100%;
    height: 100%;
    padding: 0;
  }

  img {
    border: 1px solid var(--gray-40);
  }

  .loading-msg,
  .error-text {
    padding: var(--spacing-32);
  }
</style>

<div bind:clientWidth="{width}" aria-live="polite">
  <svelte:component this="{MapWrapper}" on:click aria-label="{ariaLabel}">
    {#if state === "loaded"}
      <img
        {...$$restProps}
        style="{$$restProps.style}"
        width="{width}"
        height="{height}"
        src="{src}"
        alt="{altText}"
        transition:fade
      />
    {:else if state === "error"}
      <div class="error-text">
        An error occurred. Unable to show locator map.
      </div>
    {:else}
      <div class="loading-msg">
        <InlineLoading description="Loading location map..." />
      </div>
    {/if}
  </svelte:component>
</div>

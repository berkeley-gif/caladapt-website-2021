<script>
  // Node modules
  import { createEventDispatcher } from "svelte";

  // Components
  import {
    Map,
    Marker,
    LayerToggle,
    NavigationControl,
    AttributionControl,
    ScalingControl,
    BoundaryVectorLayer,
    BoundarySelection,
    ImageOverlay,
    VectorLayer,
  } from "./../Map";
  import Sidebar from "./Sidebar.svelte";
  import { InlineLoading } from "carbon-components-svelte";

  // Props
  //------
  export let lng = -119.55;
  export let lat = 37.55;
  export let zoom = 5;
  export let minZoom = 0;
  export let maxZoom = 22;
  export let flyToOnLoad = true;
  export let attributionControl = false;
  export let style = "mapbox://styles/cal-adapt/cjivy3e8o6d9y2rnnhsqo0sj0";
  export let attributionOptions = {
    customAttribution: ["Cal-Adapt"],
  };
  export let boundary;
  export let location;
  export let resize;
  export let imageOverlayUrl;
  export let imageOverlayShow;
  export let imageOverlayCoords;
  export let zoomToLocationOnLoad = true;
  export let stations;

  // Local variables
  //-----------------
  let dispatch = createEventDispatcher();
  let mapComponent;
  let sidebarOpen = false;
  let options = {
    lng,
    lat,
    zoom,
    minZoom,
    maxZoom,
    flyToOnLoad,
    attributionControl,
    style,
  };
  let mapError = null;
  let isMapLoading = true;
  let overlays = [];

  // Reactive functionality
  //------------------------
  $: if (mapError) {
    dispatch("error", {
      message: mapError,
    });
  }

  $: if (!isMapLoading) {
    if (zoomToLocationOnLoad) {
      zoomToLocation();
    }
    dispatch("ready");
  }

  $: location, zoomToLocation();

  $: if (resize) {
    mapComponent.resize();
  }

  // Functions
  //------------------------
  function toggleMapLayer(e) {
    const { layer, show } = e.detail;
    if (show) {
      overlays = [...overlays, layer];
    } else {
      overlays = overlays.filter((d) => d === layer.id);
    }
  }

  function zoomToLocation() {
    if (!mapComponent || isMapLoading || !location) {
      return;
    }
    mapComponent.zoomToExtent(location.bbox);
  }

  function handleClick(e) {
    // Get lat, lng values from map click event
    const { lngLat } = e.detail.event;
    const lng = lngLat.lng.toFixed(4);
    const lat = lngLat.lat.toFixed(4);
    dispatch("mapclick", [+lng, +lat]);
  }

  function handleOverlayClick(e) {
    dispatch("overlayclick", e.detail);
  }

  /** @type {(e: KeyboardEvent) => void}*/
  function handleKeydown(e) {
    const { key, shiftKey } = e;
    if (key === "Tab" && !shiftKey) {
      maybeMoveFocusOutsideOfMap();
    }
  }

  // This addresses a "tab trap" a11y problem with the MapBoxGL map instance below.
  // Note: this solution is tightly coupled to the ChangeLocationStation
  // component's modal and should probably be more generic.
  function maybeMoveFocusOutsideOfMap() {
    const container = mapComponent.getContainer();
    const tabableElements = Array.from(
      container.querySelectorAll("button")
    ).filter((el) => el.offsetParent !== null);
    const last = tabableElements[tabableElements.length - 1];
    if (document.activeElement === last) {
      document
        .querySelector(".bx--modal-footer > .bx--btn.bx--btn--secondary")
        .focus();
    }
  }
</script>

<style lang="scss">
  @mixin sidebar-transition {
    transition: {
      property: transform, width;
      duration: 350ms;
      timing-function: ease-in-out;
      delay: 0s;
    }
  }

  .location {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .location-content {
    @include sidebar-transition;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .location-content.shrink {
    width: calc(100% - 200px);
  }

  .location-sidebar {
    @include sidebar-transition;
    width: 200px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    transform: translateX(200px);
  }

  .location-sidebar.expand {
    transform: translateX(0);
  }

  .loading-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    pointer-events: none;
  }

  .loading-container :global(.bx--inline-loading) {
    justify-content: center;
  }
</style>

<div class="location">
  <div class="location-content" class:shrink="{sidebarOpen}">
    <!-- misc slot for anything else such as a search box -->
    <slot />

    <Map
      bind:this="{mapComponent}"
      on:click="{handleClick}"
      on:ready="{() => {
        isMapLoading = false;
      }}"
      on:keydown="{handleKeydown}"
      {...options}
      style="{style}"
    >
      <LayerToggle
        on:layerToggleClick="{() => {
          sidebarOpen = !sidebarOpen;
        }}"
      />

      <NavigationControl />
      <AttributionControl options="{attributionOptions}" />
      <ScalingControl />

      {#if boundary}
        <BoundaryVectorLayer boundary="{boundary}" />
      {/if}

      {#if location}
        {#if location.geometry.type === "Point"}
          <Marker
            data="{location.geometry.coordinates}"
            label="{location.title}"
          />
        {:else}
          <BoundarySelection data="{location.geometry}" />
        {/if}
      {/if}

      {#if imageOverlayShow}
        <ImageOverlay
          coordinates="{imageOverlayCoords}"
          overlay="{imageOverlayUrl}"
        />
      {/if}

      {#if stations}
        <VectorLayer
          layer="{stations}"
          enableClick="{true}"
          on:overlayclick="{handleOverlayClick}"
        />
      {/if}

      {#each overlays as overlay (overlay.id)}
        <VectorLayer layer="{overlay}" />
      {/each}
    </Map>

    <div class="loading-container">
      {#if isMapLoading}
        <InlineLoading description="Loading map..." />
      {/if}
    </div>
  </div>

  <div class="location-sidebar" class:expand="{sidebarOpen}">
    <Sidebar
      open="{sidebarOpen}"
      on:close="{() => {
        sidebarOpen = false;
      }}"
      on:toggleLayer="{toggleMapLayer}"
    />
  </div>
</div>

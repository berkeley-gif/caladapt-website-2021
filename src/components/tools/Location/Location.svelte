<script>
  // Node modules
  import { createEventDispatcher } from 'svelte';

  // Components
  import { Map, Marker, LayerToggle, NavigationControl, AttributionControl, ScalingControl, BoundaryVectorLayer, BoundarySelection, ImageOverlay, VectorLayer } from './../Map';
  import Sidebar from './Sidebar.svelte';
  import { InlineLoading } from 'carbon-components-svelte';


  // Props
  //------
  export let lng = -119.55;
  export let lat = 37.55;
  export let zoom = 5;
  export let minZoom = 0;
  export let maxZoom = 22;
  export let flyToOnLoad = true;
  export let attributionControl = false;
  export let style = 'mapbox://styles/cal-adapt/cjivy3e8o6d9y2rnnhsqo0sj0';
  export let attributionOptions = {
    customAttribution: ['Cal-Adapt'],
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
    dispatch('error', {
      message: mapError,
    });
  }

  $: if (!isMapLoading) {
    if (zoomToLocationOnLoad) {
      zoomToLocation();
    }
    dispatch('ready');
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
      overlays = overlays.filter(d => d === layer.id);
    }
  }

  function zoomToLocation() {
    if (!mapComponent || isMapLoading || !location) {
      return;
    }
    mapComponent.zoomToExtent(location.bbox)
  }

  function handleClick(e) {
    // Get lat, lng values from map click event
    const { lngLat } = e.detail.event;
    const lng = lngLat.lng.toFixed(4);
    const lat = lngLat.lat.toFixed(4);
    dispatch('mapclick', [+lng, +lat]);
  }

  function handleOverlayClick(e) {
    dispatch('overlayclick', e.detail);
  }
</script>

<style>
  .location {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .location-content {
    width: 100%;
    height: 100%;
    transition: all 0.4s ease-in-out 0s;
  }

  .location-content.shrink {
    width: calc(100% - 200px);
    transition: all 0.4s ease 0s;
  }

  .location-sidebar {
    position: absolute;
    width: 200px;
    height: 100%;
    top: 0;
    right: -250px;
    overflow-y: auto;
    transition: all 0.4s ease-in-out 0s;
    border: 1px solid #cad3d2;
    z-index: 2;
  }

  .location-sidebar.expand {
    right: 0;
    transition: all 0.4s ease 0s;
  }
</style>

<div class="location">
  <div class="location-sidebar" class:expand={sidebarOpen}>
    <Sidebar
      open={sidebarOpen}
      on:close = {() => {
        sidebarOpen = false;
      }}
      on:toggleLayer={toggleMapLayer}
    />
  </div>
  <div class="location-content" class:shrink={sidebarOpen}>
    {#if isMapLoading}
      <InlineLoading description="Loading map..." />
    {/if}
    <Map
      bind:this={mapComponent}
      {...options}
      {style}
      on:click={handleClick}
      on:ready={() => {
        isMapLoading = false;
      }}
      >
      <LayerToggle on:layerToggleClick={() => {
        sidebarOpen = !sidebarOpen;
      }} />
      <NavigationControl />
      <AttributionControl options={attributionOptions} />
      <ScalingControl />
      {#if boundary}
        <BoundaryVectorLayer {boundary} />
      {/if}
      {#if location}
        {#if location.geometry.type === 'Point'}
          <Marker data={location.geometry.coordinates} label={location.title} />
        {:else}
          <BoundarySelection data={location.geometry} />
        {/if}
      {/if}
      {#if imageOverlayShow}
        <ImageOverlay coordinates={imageOverlayCoords} overlay={imageOverlayUrl} />
      {/if}
      {#if stations}
        <VectorLayer layer={stations} enableClick={true} on:overlayclick={handleOverlayClick} />
      {/if}
      {#each overlays as overlay (overlay.id)}
        <VectorLayer layer={overlay} />
      {/each}
    </Map>
  </div>
</div>
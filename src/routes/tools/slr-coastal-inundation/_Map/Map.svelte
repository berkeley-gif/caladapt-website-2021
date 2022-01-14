<script>
  import { createEventDispatcher } from "svelte";
  import { debounce } from "~/helpers/utilities";
  import { Map, NavigationControl } from "~/components/tools/Map";
  import RasterLayers from "./Rasters.svelte";
  import TileIndexes from "./TileIndexes.svelte";

  export let dataLayersAugmented;
  export let bbox;
  export let mapStyle;

  // initial map view
  const lng = -122.2813;
  const lat = 37.7813;
  let zoom = 9;
  $: console.log("map zoom: ", zoom);

  const dispatch = createEventDispatcher();

  const moveendDelayMS = 1500;

  let mapInstance;
  let mbGlMap;
  let curStyleUrl;

  $: styleUrl = `mapbox://styles/mapbox/${mapStyle}`;
  $: mapReady = Boolean(mapInstance) && Boolean(mbGlMap);
  $: beforeId =
    mapStyle && mapStyle.includes("satellite")
      ? undefined
      : "settlement-subdivision-label";

  // TODO: remove before deploying to prod
  $: if (mapReady && typeof window !== undefined) {
    window.map = mbGlMap;
  }

  $: if (mapReady && Array.isArray(bbox) && bbox.length) {
    mapInstance.zoomToExtent(bbox, 12);
  }

  $: if (mapReady && styleUrl && styleUrl !== curStyleUrl) {
    curStyleUrl = styleUrl;
    mbGlMap.setStyle(curStyleUrl);
  }

  $: if (mapReady) {
    mbGlMap.on("zoomend", handleZoomend);
  }

  function handleMoveend() {
    if (mapReady) {
      const {
        _sw: { lng: xMax, lat: yMax },
        _ne: { lng: xMin, lat: yMin },
      } = mbGlMap.getBounds();
      dispatch("moveend", [xMin, yMin, xMax, yMax]);
    }
  }

  function handleZoomend() {
    zoom = mbGlMap.getZoom();
  }

  function handleMapReady({ detail }) {
    mbGlMap = detail;
  }

  function handleMapDestroy() {
    mbGlMap = null;
  }
</script>

{#if mapStyle}
  <Map
    bind:this="{mapInstance}"
    lng="{lng}"
    lat="{lat}"
    zoom="{zoom}"
    style="{styleUrl}"
    on:ready="{handleMapReady}"
    on:destroy="{handleMapDestroy}"
    on:moveend="{debounce(handleMoveend, moveendDelayMS)}"
  >
    <NavigationControl />

    {#if zoom >= 7}
      <RasterLayers
        mapStyle="{mapStyle}"
        beforeId="{beforeId}"
        dataLayers="{dataLayersAugmented}"
      />
    {/if}

    {#if zoom < 7}
      <TileIndexes
        mapStyle="{mapStyle}"
        beforeId="{beforeId}"
        dataLayers="{dataLayersAugmented}"
      />
    {/if}
  </Map>
{/if}

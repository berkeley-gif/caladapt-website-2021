<script>
  import { createEventDispatcher } from "svelte";
  import { Map, NavigationControl } from "~/components/tools/Map";
  import RasterLayers from "./Rasters";

  export let dataLayersAugmented;
  export let bbox;
  export let mapStyle;

  // initial map view
  const lng = -122.2813;
  const lat = 37.7813;
  const zoom = 9;

  const dispatch = createEventDispatcher();

  let mapInstance;
  let mbGlMap;
  let curStyleUrl;

  $: styleUrl = `mapbox://styles/mapbox/${mapStyle}`;
  $: mapReady = Boolean(mapInstance) && Boolean(mbGlMap);

  $: if (mapReady && Array.isArray(bbox) && bbox.length) {
    mapInstance.zoomToExtent(bbox, 12);
  }

  $: if (mapReady && styleUrl && styleUrl !== curStyleUrl) {
    curStyleUrl = styleUrl;
    mbGlMap.setStyle(curStyleUrl);
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
    on:moveend="{handleMoveend}"
  >
    <NavigationControl />
    <RasterLayers mapStyle="{mapStyle}" dataLayers="{dataLayersAugmented}" />
  </Map>
{/if}

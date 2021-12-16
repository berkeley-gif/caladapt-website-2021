<script>
  import { Map, NavigationControl, StyleControl } from "~/components/tools/Map";
  import RasterLayers from "./Rasters";

  export let scenario;
  export let timeFrame;
  export let dataLayersStore;
  export let bbox;
  export let mapStyle;

  // initial map view
  const lng = -122.2813;
  const lat = 37.7813;
  const zoom = 9;

  let mapInstance;
  let mbGlMap;
  let curStyleUrl;

  $: styleUrl = `mapbox://styles/mapbox/${mapStyle}`;
  $: dataLayers = $dataLayersStore;
  $: mapReady = Boolean(mapInstance) && Boolean(mbGlMap);

  $: if (mapReady && Array.isArray(bbox) && bbox.length) {
    mapInstance.zoomToExtent(bbox, 12);
  }

  $: if (mapReady && styleUrl && styleUrl !== curStyleUrl) {
    curStyleUrl = styleUrl;
    mbGlMap.setStyle(curStyleUrl);
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
  >
    <NavigationControl />
    <RasterLayers
      map="{mbGlMap}"
      mapStyle="{mapStyle}"
      dataLayers="{dataLayers}"
      scenario="{scenario}"
      timeFrame="{timeFrame}"
    />
  </Map>
{/if}

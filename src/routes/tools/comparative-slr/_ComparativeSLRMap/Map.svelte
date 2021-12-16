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

  $: dataLayers = $dataLayersStore;
  $: mapReady = Boolean(mapInstance) && Boolean(mbGlMap);

  $: if (mapReady && Array.isArray(bbox) && bbox.length) {
    mapInstance.zoomToExtent(bbox, 12);
  }

  function handleMapReady({ detail }) {
    mbGlMap = detail;
  }

  function handleMapDestroy() {
    mbGlMap = null;
  }
</script>

{#key mapStyle}
  <Map
    bind:this="{mapInstance}"
    lng="{lng}"
    lat="{lat}"
    zoom="{zoom}"
    style="{`mapbox://styles/mapbox/${mapStyle}`}"
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
{/key}

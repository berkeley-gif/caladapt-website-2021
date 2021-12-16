<script>
  import { Map, NavigationControl, StyleControl } from "~/components/tools/Map";
  import RasterLayers from "./Rasters";

  export let scenario;
  export let timeFrame;
  export let dataLayersStore;
  export let bbox;

  // initial map view
  const lng = -122.2813;
  const lat = 37.7813;
  const zoom = 9;

  let mapInstance;
  let mapStyle;
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

  async function handleStyleChange({ detail }) {
    mapStyle = detail;
  }
</script>

{#key mapStyle}
  <Map
    bind:this="{mapInstance}"
    lng="{lng}"
    lat="{lat}"
    zoom="{zoom}"
    style="{mapStyle}"
    on:ready="{handleMapReady}"
    on:destroy="{handleMapDestroy}"
  >
    <NavigationControl />
    <StyleControl
      selected="{mapStyle && mapStyle.split('/').pop()}"
      position="{{ bottom: 10, right: 10 }}"
      on:change="{handleStyleChange}"
    />
    <RasterLayers
      map="{mbGlMap}"
      mapStyle="{mapStyle}"
      dataLayers="{dataLayers}"
      scenario="{scenario}"
      timeFrame="{timeFrame}"
    />
  </Map>
{/key}

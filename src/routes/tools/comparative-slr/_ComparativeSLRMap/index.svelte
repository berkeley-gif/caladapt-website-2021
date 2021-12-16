<script>
  import {
    Map,
    NavigationControl,
    // RasterLayer,
    StyleControl,
    Legend,
  } from "~/components/tools/Map";
  import { getCSSProp } from "~/helpers/utilities";
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
  let legendRamp;

  if (typeof window !== "undefined" && !legendRamp) {
    legendRamp = [
      getCSSProp(document.documentElement, "--rs-green"),
      getCSSProp(document.documentElement, "--rs-blue"),
      getCSSProp(document.documentElement, "--rs-teal"),
    ];
  }

  $: dataLayers = $dataLayersStore;
  $: mapReady = Boolean(mapInstance) && Boolean(mbGlMap);

  $: if (mapReady && Array.isArray(bbox) && bbox.length) {
    mapInstance.zoomToExtent(bbox, 12);
  }

  function handleMapReady({ detail }) {
    mbGlMap = detail;
  }

  async function handleStyleChange({ detail }) {
    console.log("style control change: ", detail);
    mapStyle = detail;
  }
</script>

<Map
  bind:this="{mapInstance}"
  lng="{lng}"
  lat="{lat}"
  zoom="{zoom}"
  on:ready="{handleMapReady}"
>
  <NavigationControl />
  <Legend
    title=""
    values="{['CoSMoS', 'CalFlod3D-TFS', 'CoSMoS & CalFlod3D-TFS']}"
    ramp="{legendRamp}"
    columns="{3}"
    columnWidth="{150}"
    width="{'400px'}"
  />
  <StyleControl
    position="{{ bottom: 82, right: 10 }}"
    on:change="{handleStyleChange}"
  />
  <RasterLayers
    map="{mbGlMap}"
    mapStyle="{mapStyle}"
    dataLayers="{dataLayers}"
    scenario="{scenario}"
    timeFrame="{timeFrame}"
  />
  <!-- TODO: rebuild raster layers after style update? -->
  <!-- {#each rasterLayersProps as { tileUrl, id, visibility, beforeId } (id)}
    {#key beforeId}
      <RasterLayer
        tileURL="{tileUrl}"
        id="{id}"
        beforeId="{beforeId}"
        paintProps="{paintProps}"
        visibility="{visibility}"
      />
    {/key}
  {/each} -->
</Map>

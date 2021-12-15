<script>
  import {
    Map,
    NavigationControl,
    RasterLayer,
    Legend,
  } from "~/components/tools/Map";
  import { getCSSProp } from "~/helpers/utilities";

  import { getTileUrl } from "./_data";

  export let scenario;
  export let timeFrame;
  export let dataLayersStore;
  export let bbox;

  const paintProps = {
    "raster-opacity": 0.5,
  };

  // initial map view
  const lng = -122.2813;
  const lat = 37.7813;
  const zoom = 9;

  let mapInstance;
  let mbGlMap;
  let rasterLayersProps;
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

  $: if (scenario && timeFrame && dataLayers)
    rasterLayersProps = dataLayers.map(({ id, checked, color }) => ({
      id,
      tileUrl: getTileUrl(id, scenario, timeFrame, "sfbay", color),
      visibility: checked ? "visible" : "none",
    }));

  $: console.log("rasterLayersProps: ", rasterLayersProps);

  function handleMapReady({ detail }) {
    mbGlMap = detail;
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
  {#each rasterLayersProps as { tileUrl, id, visibility } (id)}
    <RasterLayer
      tileURL="{tileUrl}"
      id="{id}"
      paintProps="{paintProps}"
      visibility="{visibility}"
    />
  {/each}
</Map>

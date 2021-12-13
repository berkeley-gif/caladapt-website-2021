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
  export let dataLayers;
  export let center;
  export let zoom = 10;

  const paintProps = {
    "raster-opacity": 0.5,
  };

  let rasterLayersProps;
  let lng = -122.2813;
  let lat = 37.7813;
  let legendRamp;

  if (typeof window !== "undefined" && !legendRamp) {
    legendRamp = [
      getCSSProp(document.documentElement, "--rs-green"),
      getCSSProp(document.documentElement, "--rs-blue"),
      getCSSProp(document.documentElement, "--rs-teal"),
    ];
  }

  $: if (Array.isArray(center) && center.length) {
    [lng, lat] = center;
  }

  $: if (scenario && timeFrame && dataLayers)
    rasterLayersProps = dataLayers
      .filter((d) => d.checked)
      .map((d) => ({
        id: d.id,
        tileUrl: getTileUrl(d.id, scenario, timeFrame, "sfbay", d.color),
      }));
</script>

<Map lng="{lng}" lat="{lat}" zoom="{zoom}">
  <NavigationControl />
  <Legend
    title=""
    values="{['CoSMoS', 'CalFlod3D-TFS', 'CoSMoS & CalFlod3D-TFS']}"
    ramp="{legendRamp}"
    columns="{3}"
    columnWidth="{150}"
    width="{'400px'}"
  />
  {#if rasterLayersProps && rasterLayersProps.length}
    {#each rasterLayersProps as { tileUrl, id } (id)}
      {#if tileUrl}
        <RasterLayer tileURL="{tileUrl}" id="{id}" paintProps="{paintProps}" />
      {/if}
    {/each}
  {/if}
</Map>

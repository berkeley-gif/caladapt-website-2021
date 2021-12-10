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

  const paint = {
    "raster-opacity": 0.5,
  };

  let tileLayerUrls;
  let lng = -122.2813;
  let lat = 37.7813;
  let ramp;

  if (typeof window !== "undefined" && !ramp) {
    ramp = [
      getCSSProp(document.documentElement, "--rs-green"),
      getCSSProp(document.documentElement, "--rs-blue"),
    ];
  }

  $: if (Array.isArray(center) && center.length) {
    [lng, lat] = center;
  }

  $: if (scenario && timeFrame)
    tileLayerUrls = dataLayers
      .filter((d) => d.checked)
      .map((d) => ({
        id: d.id,
        url: getTileUrl(d.id, scenario, timeFrame, "sfbay", d.color),
      }));
</script>

<Map lng="{lng}" lat="{lat}" zoom="{zoom}">
  <NavigationControl />
  <Legend
    title="Data Layers"
    values="{['CoSMoS', 'CalFlod3D-TFS']}"
    ramp="{ramp}"
    columns="{1}"
    width="{'136px'}"
  />
  {#if tileLayerUrls && tileLayerUrls.length}
    {#each tileLayerUrls as { url, id } (id)}
      <RasterLayer tileURL="{url}" id="{id}" paintProps="{paint}" />
    {/each}
  {/if}
</Map>

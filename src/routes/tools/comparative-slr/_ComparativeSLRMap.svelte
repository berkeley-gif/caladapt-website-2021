<script>
  import { Map, NavigationControl, RasterLayer } from "~/components/tools/Map";

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
  $: console.log(tileLayerUrls);
</script>

<Map lng="{lng}" lat="{lat}" zoom="{zoom}">
  <NavigationControl />
  {#if tileLayerUrls && tileLayerUrls.length}
    {#each tileLayerUrls as { url, id } (id)}
      <RasterLayer tileURL="{url}" id="{id}" paintProps="{paint}" />
    {/each}
  {/if}
</Map>

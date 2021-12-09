<script>
  import { Map, NavigationControl, RasterLayer } from "~/components/tools/Map";

  import { getTileUrl } from "./_data";

  export let scenario;
  export let timeFrame;
  export let dataLayers;

  let tileLayerUrls;

  $: if (scenario && timeFrame)
    tileLayerUrls = dataLayers
      .filter((d) => d.checked)
      .map((d) => ({
        id: d.id,
        url: getTileUrl(d.id, scenario, timeFrame, "sfbay", d.color),
      }));
  $: console.log(tileLayerUrls);
</script>

<Map>
  <NavigationControl />
  {#if tileLayerUrls && tileLayerUrls.length}
    {#each tileLayerUrls as { url, id } (id)}
      <RasterLayer tileURL="{url}" id="{id}" />
    {/each}
  {/if}
</Map>

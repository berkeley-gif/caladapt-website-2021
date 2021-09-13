<script>
  import { getContext } from "svelte";
  import { area } from "d3-shape";

  const { xScale, yScale } = getContext("LayerCake");

  export let areaData;
  export let colorScale = (d) => "#000";
  export let displayItems;

  $: path = area()
    .x((d) => $xScale(d.date))
    .y0((d) => $yScale(d.min))
    .y1((d) => $yScale(d.max));

  $: showItems = displayItems.map((d) => d.show);
</script>

<style>
  .path-area {
    fill-opacity: 25%;
    opacity: 0;
  }

  .show {
    opacity: 1;
  }
</style>

<g class="area-group">
  {#each areaData as group, i}
    <path
      class="path-area"
      class:show="{showItems[i] ? true : false}"
      d="{path(group.values)}"
      fill="{colorScale(group.values[0].id)}"></path>
  {/each}
</g>

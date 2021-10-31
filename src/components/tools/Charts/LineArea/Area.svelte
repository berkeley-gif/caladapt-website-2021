<script>
  import { getContext } from "svelte";
  import { area } from "d3-shape";

  const { xScale, yScale } = getContext("LayerCake");

  export let series;
  export let setDatetoYearStart = true;

  let show = true;
  const legendItems = getContext("Legend");

  $: $legendItems.forEach((d) => {
    if (d.id === series.id) {
      show = d.visible;
    }
  });

  $: path = area()
    .x((d) => {
      if (setDatetoYearStart) {
        return $xScale(new Date(Date.UTC(d.date.getUTCFullYear(), 0, 1)));
      } else {
        return $xScale(d.date);
      }
    })
    .y0((d) => $yScale(d.min))
    .y1((d) => $yScale(d.max));

  // Note; Alpha channgel for area paths is set to 0.3
</script>

<style>
</style>

{#if show}
  <path
    class="{`path-area ${series.id}`}"
    d="{path(series.values)}"
    fill="{series.color.replace(/[^,]+(?=\))/, '0.7')}"
  >
  </path>
{/if}

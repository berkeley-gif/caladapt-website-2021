<script>
  import { getContext } from "svelte";
  import { line } from "d3-shape";

  const { yGet, xScale } = getContext("LayerCake");

  export let series;
  export let setDatetoYearStart;

  let show = true;
  const legendItems = getContext("Legend");

  $: $legendItems.forEach((d) => {
    if (d.id === series.id) {
      show = d.visible;
    }
  });

  $: path = line()
    .x((d) => {
      if (setDatetoYearStart) {
        return $xScale(new Date(Date.UTC(d.date.getUTCFullYear(), 0, 1)));
      } else {
        return $xScale(d.date);
      }
    })
    .y((d) => $yGet(d));
</script>

{#if show}
  <path
    class="{`path-line ${series.id}`}"
    d="{path(series.values)}"
    stroke="{series.color}"
    fill="none"
    stroke-width="1px"
  >
  </path>
{/if}

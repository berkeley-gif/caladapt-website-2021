<script>
  import { getContext } from "svelte";

  const { xScale, yScale } = getContext("LayerCake");

  export let series;
  export let fill;

  let show = true;
  const controlItems = getContext("Control");

  $: $controlItems.forEach((d) => {
    if (d.id === series.id) {
      show = d.visible;
    }
  });

  $: data = series.values;
</script>

{#if show}
  <g class="{`${series.id}`}">
    {#each data as d}
      <rect
        x="{$xScale(d.date)}"
        y="{$yScale(d.day)}"
        width="{'5px'}"
        height="{$yScale.bandwidth()}"
        fill="{fill(d.value)}"></rect>
    {/each}
  </g>
{/if}

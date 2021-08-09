<script>
  import { getContext } from "svelte";

  const { xGet, yGet, xScale, yScale } = getContext("LayerCake");

  export let series;
  export let r = 4;
  export let strokeWidth = 1;
  export let fillOpacity = 0.5;
  export let dx = 0;
  export let dy = 0;

  let show = true;
  const legendItems = getContext("Legend");

  $: $legendItems.forEach((d) => {
    if (d.key === series.key) {
      show = d.visible;
    }
  });

  $: data = series.values;
</script>

{#if show}
  <g class="{`${series.key}`}">
    {#each data as d}
      <circle
        cx="{$xGet(d) + (typeof dx === 'function' ? dx($xScale) : dx)}"
        cy="{$yGet(d) + (typeof dy === 'function' ? dy($yScale) : dy)}"
        r="{r}"
        fill="{series.color}"
        fill-opacity="{fillOpacity}"
        stroke="{series.color}"
        stroke-width="{strokeWidth}"></circle>
    {/each}
  </g>
{/if}

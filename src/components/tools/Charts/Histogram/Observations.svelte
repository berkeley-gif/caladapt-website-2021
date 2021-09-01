<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { raise } from "layercake";

  const { yGet, xScale, padding, yScale } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  export let data;
  export let yHeight;

  $: midHeight = $yScale.bandwidth() / 2;

  function handleMousemove(feature) {
    return function handleMousemoveFn(e) {
      raise(this);
      // When the element gets raised, it flashes 0,0 for a second so skip that
      if (e.layerX !== 0 && e.layerY !== 0) {
        dispatch("mousemove", { e, props: feature });
      }
    };
  }
</script>

<style>
  .circle {
    fill: var(--teal-60);
    fill-opacity: 1;
  }

  .line {
    stroke: var(--teal-30);
    stroke-dasharray: 3, 3;
    stroke-width: 1;
  }

  .label {
    fill: var(--teal-60);
    font-weight: 600;
    stroke: white;
    stroke-width: 2;
    paint-order: stroke;
  }
</style>

<g class="forecast-group">
  {#each data as d}
    <g>
      <circle
        cy="{$yGet(d) + midHeight}"
        cx="{$xScale(d.temperature)}"
        class="circle"
        r="{5}"
        on:mouseout="{() => dispatch('mouseout')}"
        on:mouseover="{(e) => dispatch('mousemove', { e, props: d })}"
        on:mousemove="{handleMousemove(d)}"
      >
      </circle>
      <line
        x1="{$xScale(d.temperature)}"
        x2="{$xScale(d.temperature)}"
        y1="{yHeight}"
        y2="{$yGet(d) + midHeight}"
        class="line"
      >
      </line>
      <text
        y="{$yGet(d) + midHeight + 4}"
        x="{$xScale(d.temperature) + 10}"
        class="label"
      >
        {d.temperature}°F
      </text>
    </g>
  {/each}
</g>

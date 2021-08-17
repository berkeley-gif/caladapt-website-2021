<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { raise } from "layercake";

  const { xScale } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  export let data;

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
    stroke: var(--teal-60);
    stroke-width: 3;
    stroke-opacity: 0.5;
  }
</style>

<g class="forecast-group">
  {#each data as d}
    <circle
      cy="{100}"
      cx="{$xScale(d.temperature)}"
      class="circle"
      r="{10}"
      on:mouseout="{() => dispatch('mouseout')}"
      on:mouseover="{(e) => dispatch('mousemove', { e, props: d })}"
      on:mousemove="{handleMousemove(d)}"></circle>
    <text
      y="{90}"
      x="{$xScale(d.temperature)}"
      text-anchor="middle"
      class="label"
    >
      {d.label}
    </text>
  {/each}
</g>

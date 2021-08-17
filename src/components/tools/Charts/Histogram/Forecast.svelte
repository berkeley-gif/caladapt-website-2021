<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { raise } from "layercake";
  import { groups } from "d3-array";

  const { xScale } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  export let data;

  $: circles = groups(data, (d) => d.temperature);
  $: console.log(circles);

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
    stroke-width: 7;
    stroke-opacity: 0.2;
  }

  .label {
    fill: var(--teal-60);
    font-weight: 600;
  }
</style>

<g class="forecast-group">
  {#each circles as group}
    <circle
      cy="{100}"
      cx="{$xScale(group[0])}"
      class="circle"
      r="{5}"
      on:mouseout="{() => dispatch('mouseout')}"
      on:mouseover="{(e) => dispatch('mousemove', { e, props: group[1] })}"
      on:mousemove="{handleMousemove(group[1])}"
    >
    </circle>
    <text y="{120}" x="{$xScale(group[0])}" text-anchor="middle" class="label">
      {group[0]}
    </text>
    {#each group[1] as d, i}
      <text
        y="{90 - 12 * i}"
        x="{$xScale(d.temperature)}"
        text-anchor="middle"
        class="label"
      >
        {d.label}
      </text>
    {/each}
  {/each}
</g>

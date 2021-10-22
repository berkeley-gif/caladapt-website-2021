<script>
  import { getContext } from "svelte";

  const { yScale, xScale } = getContext("LayerCake");

  export let lines;
  export let threshold;
  export let units;
</script>

<g class="annotation-group">
  <g class="line-labels">
    {#each lines as d, i}
      <line
        x1="{$xScale(d.value)}"
        x2="{$xScale(d.value)}"
        y1="{$yScale(0)}"
        y2="{10}"
        stroke-dasharray="3,3"
        stroke="black"
        stroke-width="2px"></line>
      <text
        x="{$xScale(d.value)}"
        y="{-10}"
        text-anchor="{i % 2 ? 'start' : 'end'}"
        style="font-weight:600;"
      >
        {d.label}
      </text>
      <text
        x="{$xScale(d.value)}"
        y="{8}"
        text-anchor="{i % 2 ? 'start' : 'end'}"
        style="font-weight:600;"
      >
        <tspan>{d.value}</tspan>
        <tspan dx="2">{units}</tspan>
      </text>
    {/each}
  </g>
  {#if threshold}
    <g class="threshold">
      <circle cy="{30}" cx="{$xScale(+threshold)}" fill="red" r="{5}"> </circle>
      <text
        x="{$xScale(+threshold) + 10}"
        y="{35}"
        style="font-weight:600;fill:red;"
      >
        <tspan>{threshold}</tspan>
        <tspan dx="2">{units}</tspan>
      </text>
    </g>
  {/if}
</g>

<script>
  import { getContext } from "svelte";

  const { yScale, xScale } = getContext("LayerCake");

  export let lines;
  export let threshold;
</script>

<g class="annotation-group">
  <g class="title">
    <text x="{0}" y="{-25}" style="font-size:18px;font-weight:600;">
      Baseline (1991-2020)
    </text>
  </g>
  <g class="line-labels">
    {#each lines as d}
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
        text-anchor="middle"
        style="font-weight:600;"
      >
        <tspan x="{$xScale(d.value)}" y="{-10}">{d.label}</tspan>
        <tspan x="{$xScale(d.value)}" y="{5}">{d.value}°F</tspan>
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
        {threshold} °F
      </text>
    </g>
  {/if}
</g>

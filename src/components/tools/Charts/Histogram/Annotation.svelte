<script>
  import { getContext } from "svelte";

  const { yScale, xScale } = getContext("LayerCake");

  export let data;
  export let threshold;

  $: percentiles = data.percentiles;
  $: low = data.low;
  $: high = data.high;
</script>

<g class="annotation-group">
  <g class="records">
    <text x="{0}" y="{-70}" style="font-weight:600;">
      <tspan dy="{0}">Record Low</tspan>
      <tspan x="{0}" dy="{20}">{low.value} on {low.date}</tspan>
    </text>
    <text x="{200}" y="{-70}" style="font-weight:600;">
      <tspan dy="{0}">Record High</tspan>
      <tspan x="{200}" dy="{20}">{high.value} on {high.date}</tspan>
    </text>
  </g>
  <g class="percentiles">
    {#each percentiles as d}
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
        <tspan x="{$xScale(d.value)}" y="{5}">{d.value} °F</tspan>
      </text>
    {/each}
  </g>
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
  <g class="forecast"> </g>
</g>

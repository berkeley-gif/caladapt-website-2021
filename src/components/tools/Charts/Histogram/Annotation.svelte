<script>
  import { getContext } from "svelte";

  const { yScale, xScale } = getContext("LayerCake");

  export let data;

  $: percentiles = data.percentiles;
  $: low = data.low;
  $: high = data.high;
  // $: threshold = data.threshold;
</script>

<g class="annotation-group">
  <g class="records">
    <text
      x="{40}"
      y="{-70}"
      style="font-weight:600;"
    >
      <tspan dy="{0}">Record Low</tspan>
      <tspan x="{40}" dy="{20}">{low.value} on {low.date}</tspan>
    </text>
    <text
      x="{225}"
      y="{-70}"
      style="font-weight:600;"
    >
      <tspan dy="{0}">Record High</tspan>
      <tspan x="{225}" dy="{20}">{high.value} on {high.date}</tspan>
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
<!--   <g class="threshold">
    <line
      x1="{$xScale(+threshold)}"
      x2="{$xScale(+threshold)}"
      y1="{$yScale(0)}"
      y2="{25}"
      stroke-dasharray="3,3"
      stroke="var(--teal-60)"
      stroke-width="3px"></line>
    <text
      x="{$xScale(+threshold)}"
      y="{0}"
      text-anchor="middle"
      style="font-weight:600;fill:var(--teal-60);"
    >
      {threshold} °F
    </text>
  </g> -->
  <g class="forecast">
  </g>
</g>

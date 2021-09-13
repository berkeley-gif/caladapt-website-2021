<script>
  import { getContext } from "svelte";

  const { padding, width, height, xScale, yRange } = getContext("LayerCake");

  export let gridlines = true;
  export let tickMarks = true;
  export let tickFormat = (d) => d;
  export let baseline = true;
  export let snapTicks = false;
  export let ticks = undefined;
  export let xTick = undefined;
  export let yTick = 16;
  export let dxTick = 0;
  export let dyTick = 0;
  export let label;

  $: isBandwidth = typeof $xScale.bandwidth === "function";

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : isBandwidth
    ? $xScale.domain()
    : typeof ticks === "function"
    ? ticks($xScale.ticks())
    : $xScale.ticks(ticks);

  function textAnchor(i) {
    if (snapTicks === true) {
      if (i === 0) {
        return "start";
      }
      if (i === tickVals.length - 1) {
        return "end";
      }
    }
    return "middle";
  }
</script>

<style>
  line,
  .tick line {
    stroke: #aaa;
    stroke-dasharray: 2;
  }

  .tick text {
    fill: #666;
  }

  .tick .tick-mark,
  .baseline {
    stroke: #aaa;
    stroke-dasharray: 0;
  }

  .axis.snapTicks .tick:last-child text {
    transform: translateX(3px);
  }
  .axis.snapTicks .tick.tick-0 text {
    transform: translateX(-3px);
  }
</style>

<g class="axis x-axis" class:snapTicks>
  {#each tickVals as tick, i}
    <g
      class="tick tick-{i}"
      transform="translate({$xScale(tick)},{$yRange[0]})"
    >
      {#if gridlines !== false}
        <line class="gridline" y1="{$height * -1}" y2="0" x1="0" x2="0"></line>
      {/if}
      {#if tickMarks === true}
        <line
          class="tick-mark"
          y1="{0}"
          y2="{6}"
          x1="{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}"
          x2="{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}"></line>
      {/if}
      <text
        x="{xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}"
        y="{yTick}"
        dx="{dxTick}"
        dy="{dyTick}"
        text-anchor="middle">{tickFormat(tick)}</text
      >
    </g>
  {/each}
  {#if baseline === true}
    <line
      class="baseline"
      y1="{$height + 0.5}"
      y2="{$height + 0.5}"
      x1="0"
      x2="{$width}"></line>
  {/if}
  <text
    transform="translate({$width / 2}, {$height})"
    y="35"
    text-anchor="middle"
    style="font-size:13px;fill:#666"
  >
    {label}
  </text>
</g>

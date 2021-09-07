<script>
  import { getContext } from "svelte";

  const { padding, xRange, yScale, height, width } = getContext("LayerCake");

  export let ticks = 4;
  export let tickMarks = false;
  export let gridlines = true;
  export let formatTick = (d) => d;
  export let xTick = 0;
  export let yTick = 0;
  export let dxTick = 0;
  export let dyTick = -4;
  export let textAnchor = "start";
  export let label;

  $: isBandwidth = typeof $yScale.bandwidth === "function";

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : isBandwidth
    ? $yScale.domain()
    : typeof ticks === "function"
    ? ticks($yScale.ticks())
    : $yScale.ticks(ticks);
</script>

<style>
  .tick line {
    stroke: #aaa;
  }
  .tick .gridline {
    stroke-dasharray: 2;
  }

  .tick text {
    fill: #666;
  }

  .tick.tick-0 line {
    stroke-dasharray: 0;
  }
</style>

<g class="axis y-axis">
  {#each tickVals as tick, i}
    <g
      class="tick tick-{tick}"
      transform="translate({$xRange[0] +
        (isBandwidth ? $padding.left : 0)}, {$yScale(tick)})"
    >
      {#if gridlines}
        <line
          class="gridline"
          xi="0"
          x2="{$width - (isBandwidth ? $padding.right : 0)}"
          y1="{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}"
          y2="{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}"></line>
      {/if}
      {#if tickMarks}
        <line
          class="tick-mark"
          x1="0"
          x2="{isBandwidth ? -6 : 6}"
          y1="{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}"
          y2="{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}"></line>
      {/if}
      <text
        x="{xTick}"
        y="{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}"
        dx="{isBandwidth ? -9 : dxTick}"
        dy="{isBandwidth ? 4 : dyTick}"
        style="text-anchor:{isBandwidth ? 'end' : textAnchor};"
        >{formatTick(tick)}</text
      >
      {#if i === tickVals.length - 1}
        <text y="-4" x="{25}" class="label" style="font-size:14px;fill:#666"
          >{label}</text
        >
      {/if}
    </g>
  {/each}
</g>

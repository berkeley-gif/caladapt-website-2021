<script>
  import { getContext } from "svelte";

  const { padding, yScale, width } = getContext("LayerCake");

  export let ticks = 4;
  export let formatTick = (d) => d;
  export let yTick = 0;

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
    font-size: 0.8rem;
  }

  .tick.tick-0 line {
    stroke-dasharray: 0;
  }
</style>

<g class="axis y-axis" transform="translate(-{$padding.left}, 0)">
  {#each tickVals as tick, i}
    <g
      class="tick tick-{tick}"
      transform="translate({$padding.left}, {$yScale(tick)})"
    >
      <line
        class="gridline"
        xi="{0}"
        x2="{$width}"
        y1="{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}"
        y2="{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}"
      >
      </line>
      <text
        x="0"
        y="{yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}"
        dy="{-4}"
      >
        {formatTick(tick)}
      </text>
    </g>
  {/each}
</g>

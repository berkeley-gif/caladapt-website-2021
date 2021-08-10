<script>
  import { getContext } from "svelte";
  import { timeParse, timeFormat } from "d3-time-format";

  const { width, height, padding, xRange, xScale, yScale } =
    getContext("LayerCake");

  export let ticks = undefined;
  export let gridlines = false;
  export let formatTick = (d) => timeFormat("%b")(timeParse("%j")(d));

  $: isBandwidth = typeof $yScale.bandwidth === "function";

  $: tickVals = Array.isArray(ticks)
    ? ticks
    : isBandwidth
    ? $yScale.domain()
    : typeof ticks === "function"
    ? ticks($yScale.ticks())
    : $yScale.ticks(ticks);

  $: tickPos = ticks.map((d) => {
    return $yScale(d) || $height;
  });

  $: d = `M 0 0 L ${$width + $padding.left} 0`;
</script>

<g class="axis y-axis" transform="translate(-{$padding.left}, 0)">
  {#each tickVals as tick, i}
    <g class="tick tick-{tick}" transform="translate(0, {tickPos[i]})">
      {#if gridlines}
        <path class="gridline" d="{d}" style="stroke:#aaa;stroke-dasharray:2;"
        ></path>
      {/if}
      <text y="-4" style="font-size:12px;fill:#666">{formatTick(tick)}</text>
    </g>
  {/each}
</g>

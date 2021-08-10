<script>
  import { getContext } from "svelte";

  const { width, height, padding, yScale, xScale, rScale } =
    getContext("LayerCake");

  export let ticks = undefined;
  export let formatTick = (d) => d;
  export let label = "Axis Label";

  let tickVals;

  $: if (ticks) {
    tickVals = Array.isArray(ticks) ? ticks : $yScale.ticks(ticks);
  } else {
    tickVals = $yScale.ticks();
  }

  $: $rScale.rangeRound([0, $width]);
  $: $xScale.rangeRound([0, $rScale.bandwidth()]);
</script>

<g class="axis y-axis" transform="translate({$padding.left}, 0)">
  {#each tickVals as tick, i}
    <g class="tick tick-{tick}" transform="translate(0, {$yScale(tick)})">
      <text x="0" y="0" dx="-15" dy="3" style="font-size:12px;fill:#666"
        >{formatTick(tick)}</text
      >
      {#each $rScale.domain() as group}
        {#each $xScale.domain() as x}
          <line
            x1="{$rScale(group) + $xScale(x) - 2}"
            x2="{$rScale(group) + $xScale(x) + 2}"
            style="stroke:#aaa;"></line>
        {/each}
      {/each}
    </g>
  {/each}
  <text
    transform="rotate(-90)"
    y="{-$padding.left}"
    x="{-$height / 2}"
    class="label"
    text-anchor="middle"
    style="font-size:13px;fill:#666"
  >
    {label}
  </text>
</g>

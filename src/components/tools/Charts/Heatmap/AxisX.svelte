<script>
  import { getContext } from "svelte";

  const { width, height, padding, xScale, yScale } = getContext("LayerCake");

  export let gridlines = false;
  export let formatTick = (d) => d;
  export let baseline = false;
  export let snapTicks = false;
  export let ticks = undefined;

  let tickVals;

  $: if (ticks) {
    tickVals = Array.isArray(ticks) ? ticks : $xScale.ticks(ticks);
  } else {
    tickVals = $xScale.ticks();
  }

  $: d = `M 0 0 L 0 -${$height + 10}`;

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

<g class="axis x-axis">
  {#each tickVals as tick, i}
    <g class="tick" transform="translate({$xScale(tick)},{$height + 10})">
      {#if gridlines}
        <path class="gridline" d="{d}" style="stroke:#aaa;stroke-dasharray:2;"
        ></path>
      {/if}
      <path style="stroke:#aaa;" d="M 0 0 L 0 6"></path>
      <text
        y="16"
        text-anchor="{textAnchor(i)}"
        style="font-size:12px;fill:#666">{formatTick(tick)}</text
      >
    </g>
  {/each}
  {#if baseline}
    <path
      class="baseline"
      d="{`M -${$padding.left} ${$height + 10} L ${$width} ${$height + 10}`}"
      style="stroke:#aaa;"></path>
  {/if}
</g>

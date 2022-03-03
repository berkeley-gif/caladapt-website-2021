<script>
  import { getContext, afterUpdate } from "svelte";

  const { width, padding, yScale } = getContext("LayerCake");

  export let ticks = undefined;
  export let gridlines = false;
  export let formatTick = (d) => d;
  export let label = "Axis Label";

  let tickVals;
  let ref;

  function getPadding(value) {
    // add an extra padding of 10 pixels;
    return value + 10;
  }

  $: if (ticks) {
    tickVals = Array.isArray(ticks) ? ticks : $yScale.ticks(ticks);
  } else {
    tickVals = $yScale.ticks();
  }
  $: d = `M 0 0 L ${$width + $padding.left} 0`;

  afterUpdate(() => {
    // Use getComputedTextLength to get the computed length for the text within the topmost tick label.
    // Use the maximum length value to update the padding for the axis label
    // This prevent the axis label from overlapping the topmost y axis tick value.
    try {
      const tickLabels = Array.from(ref.querySelectorAll(".tick-label"));
      const lastLabel = tickLabels[tickLabels.length - 1];
      const axisLabel = ref.querySelector(".label");
      axisLabel.setAttribute(
        "x",
        getPadding(lastLabel.getComputedTextLength())
      );
    } catch (error) {
      console.warn(error);
    }
  });
</script>

<style>
  :global(.no-data .tick-label) {
    display: none;
  }
</style>

<g
  bind:this="{ref}"
  class="axis y-axis"
  transform="translate(-{$padding.left}, 0)"
>
  {#each tickVals as tick, i}
    <g class="tick tick-{tick}" transform="translate(0, {$yScale(tick)})">
      {#if gridlines}
        <path class="gridline" d="{d}" style="stroke:#aaa;stroke-dasharray:2;"
        ></path>
      {/if}
      <text class="tick-label" y="-4" style="font-size:12px;fill:#666"
        >{formatTick(tick)}</text
      >
      {#if i === +tickVals.length - 1}
        <text
          y="-4"
          x="{getPadding($padding.left)}"
          class="label"
          style="font-size:14px;fill:#666">{label}</text
        >
      {/if}
    </g>
  {/each}
</g>

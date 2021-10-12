<script>
  import { scaleBand, scaleOrdinal } from "d3-scale";

  export let width = 100;
  export let height = 360;
  export let margin = { top: 16, left: 8, right: 8, bottom: 8 };
  export let title = "Legend";
  export let ramp = [];
  export let values = [];

  $: yPos = scaleBand()
    .domain(values)
    .range([height - margin.bottom, margin.top])
    .paddingInner(0.2);
  $: color = scaleOrdinal().domain(values).range(ramp);
</script>

<style>
  svg {
    max-width: 100%;
    height: auto;
    border: 1px solid #000;
  }

  text {
    font-size: 0.875rem;
    fill: var(--gray-80, #333);
  }

  .legend--title-text {
    font-weight: 600;
  }

  .legend--item-text {
    vertical-align: middle;
  }
</style>

<svg viewBox="0 0 {width} {height}">
  <text class="legend--title-text" y="{margin.top}" x="{margin.left}"
    >{title}</text
  >
  <g transform="{`translate(${margin.left}, ${margin.top})`}">
    {#each values as v, i (`${v}`)}
      <g transform="{`translate(0, ${yPos(v)})`}">
        <rect
          fill="{color(v)}"
          x="0"
          y="0"
          width="30"
          height="{yPos.bandwidth()}"></rect>
        <text class="legend--item-text" x="34" y="12">{v}</text>
      </g>
    {/each}
  </g>
</svg>

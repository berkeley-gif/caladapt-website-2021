<script>
  import { scaleBand, scaleOrdinal } from "d3-scale";

  export let width = 80;
  export let height = 240;
  export let margin = { top: 8, left: 0, right: 8, bottom: 0 };
  export let title = "Legend";
  export let ramp = [];
  export let values = [];
  export let padding = 0.5;

  const rectWidth = 30;

  $: yPos = scaleBand()
    .domain(values)
    .range([height - margin.bottom, margin.top])
    .paddingInner(0.2);

  $: color = scaleOrdinal().domain(values).range(ramp);
</script>

<style>
  div {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    width: var(--width, 100%);
    padding: var(--padding);
    background-color: var(--white, #fff);
    border: 1px solid var(--gray-40);
    box-sizing: content-box;
  }

  svg {
    max-width: 100%;
    height: auto;
  }

  p,
  text {
    font-size: 0.875rem;
    fill: var(--gray-80, #333);
  }

  p {
    margin: 0;
    font-weight: 600;
  }

  .legend--item-text {
    vertical-align: middle;
  }
</style>

<div style="--width:{width}px; --padding:{padding}rem;">
  <p>{title}</p>
  <svg
    viewBox="0 0 {width} {height}"
    role="presentation"
    aria-label="map legend"
  >
    <g transform="{`translate(${margin.left}, ${0})`}">
      {#each values as v, i (`${v}`)}
        <g transform="{`translate(0, ${yPos(v)})`}">
          <rect
            fill="{color(v)}"
            x="0"
            y="0"
            width="{rectWidth}"
            height="{yPos.bandwidth()}"
            stroke="var(--gray-40)"></rect>
          <text class="legend--item-text" x="{rectWidth + 4}" y="12">{v}</text>
        </g>
      {/each}
    </g>
  </svg>
</div>

<script>
  import { onMount } from "svelte";
  import { axisBottom } from "d3-axis";
  import { select } from "d3-selection";
  import { scaleOrdinal, scaleLinear } from "d3-scale";
  import { interpolate, interpolateHcl, quantize } from "d3-interpolate";
  import diagonalPattern from "static/img/patterns/diagonal-lines.svg";

  export let scaleType = "discrete"; // or "continuous"
  export let title = "Legend";
  export let subtitle = "";
  export let width = "";
  export let height = "";
  export let rectWidth = ""; // discrete only (except no-data legend item)
  export let rectHeight = ""; // discrete only (except no-data legend item)
  export let padding = ""; // padding around legend
  export let ramp = []; // colors for legend items
  export let values = []; // values for legend items
  export let columns = 0; // discrete only
  export let tickSize = 6; // continuous only
  export let ticks = width / 64; // continuous only
  export let tickValues; // continuous only
  export let noData = false;

  // TODO: consider splitting this all into separate components that render each type of legend
  // continuous only
  const margin = { top: 8, right: 8, bottom: 24, left: 8 };

  let n;
  let x;
  let xAxisGroup;
  let tickAdjust = (g) =>
    g.selectAll(".tick line").attr("y1", margin.top + margin.bottom - height);

  $: color =
    scaleType === "discrete"
      ? scaleOrdinal().domain(values).range(ramp)
      : scaleLinear(values, ramp).interpolate(interpolateHcl);

  $: if (scaleType === "continuous") {
    n = Math.min(color.domain().length, color.range().length);
    x = color
      .copy()
      .rangeRound(quantize(interpolate(margin.left, width - margin.right), n));
    renderAxis();
  }

  onMount(() => {
    if (scaleType === "continuous") {
      renderAxis();
    }
  });

  function colorRamp(color, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  function renderAxis() {
    if (!xAxisGroup) return;
    select(xAxisGroup)
      .call(
        axisBottom(x).ticks(ticks).tickSize(tickSize).tickValues(tickValues)
      )
      .call(tickAdjust)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", "white"));
  }
</script>

<style>
  .legend--container {
    position: absolute;
    right: 0.5rem;
    bottom: 0.5rem;
    width: var(--width, auto);
    height: var(--height, auto);
    padding: var(--padding, 0.5rem);
    background-color: var(--white, #fff);
    border: 0.0625rem solid var(--gray-40);
    box-sizing: content-box;
  }

  .legend--columns {
    column-count: var(--columns);
    column-width: auto;
  }

  p {
    font-size: 0.875rem;
    fill: var(--gray-80, #333);
    margin: 0;
  }

  ul {
    margin: 0.5rem 0 0 !important;
    padding: 0 !important;
    list-style: none;
  }

  li,
  .no-data {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .no-data {
    margin-top: 0.5rem;
  }

  li p {
    display: inline-block;
  }

  span {
    width: var(--rectWidth, 2rem);
    height: var(--rectHeight, 1rem);
    display: inline-block;
    border: 0.0625rem solid var(--gray-40);
  }

  .no-data span {
    margin: 0;
    border: none;
    overflow: hidden;
  }

  .no-data p {
    font-size: 0.75rem;
  }

  .legend--title-text {
    font-weight: 600;
  }

  .legend--subtitle-text {
    font-weight: 400;
  }

  svg {
    display: block;
    overflow: visibile;
  }
</style>

<div
  class="legend legend--container"
  style="--width:{width};
    --height:{height};
    --padding:{padding};
    --rectWidth:{rectWidth};
    --rectHeight:{rectHeight};
    --columns:{columns};"
>
  <p class="legend--title-text">{title}</p>
  {#if subtitle}
    <p class="legend--subtitle-text">{subtitle}</p>
  {/if}

  {#if scaleType === "discrete"}
    <ul class="{columns ? 'legend--columns' : ''}">
      {#each values as v, i (`${v}`)}
        <li>
          <span style="background-color:{color(v)}"></span>
          <p>
            {v}
          </p>
        </li>
      {/each}
    </ul>
  {:else}
    <!-- continuous legend -->
    <svg viewBox="0 0 {width} {height}" {...{ width, height }}>
      <image
        x="{margin.left}"
        y="{margin.right}"
        width="{width - margin.left - margin.right}"
        height="{height - margin.top - margin.bottom}"
        preserveAspectRatio="none"
        xlink:href="{colorRamp(
          color.copy().domain(quantize(interpolate(0, 1), n))
        ).toDataURL()}"></image>
      <g
        transform="{`translate(0, ${height - margin.bottom})`}"
        bind:this="{xAxisGroup}"></g>
    </svg>
  {/if}

  {#if noData}
    <div class="no-data">
      <span class="no-data">
        {@html diagonalPattern}
      </span>
      <p>= No Data</p>
    </div>
  {/if}
</div>

<script>
  import { SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { scaleBand } from "d3-scale";

  import AxisY from "./AxisY.svelte";
  import Tooltip from "./Tooltip.svelte";
  import Circles from "./Circles.svelte";

  export let data;
  export let title;
  export let height;
  export let padding = { top: 32, right: 16, bottom: 32, left: 32 };
  export let y1 = 96;
  export let xDomain;
  export let tooltipFn = (d) => `${d.valueLabel}`;
  export let yAxis = {
    key: "label",
    tickFormat: (d) => d,
  };
  export let xAxis = {
    key: "value",
    tickFormat: (d) => d,
  };

  let yDomain;

  let evt;
  let hideTooltip = true;

  $: style = `height:${height}px`;

  $: if (data) {
    console.log("data", data);
    yDomain = data.map((d) => d[yAxis.key]);
  }

  function createTooltip(d) {
    return tooltipFn(d);
  }
</script>

<style>
  .title {
    font-size: 1.125rem;
    font-weight: 600;
  }
</style>

{#if data}
  <div style="{style}">
    <LayerCake
      padding="{padding}"
      x="{xAxis.key}"
      y="{yAxis.key}"
      yScale="{scaleBand()}"
      data="{data}"
      height="{height}"
      xDomain="{xDomain}"
      yDomain="{yDomain}"
    >
      <Svg>
        <text x="{0}" y="{-padding.top}" class="title">
          {title}
        </text>
        <AxisY gridlines="{true}" />
        <Circles
          y1="{-y1}"
          on:mousemove="{(event) => {
            evt = event;
            hideTooltip = false;
          }}"
          on:mouseout="{() => {
            hideTooltip = true;
          }}"
        />
      </Svg>
      <Html pointerEvents="{false}">
        {#if !hideTooltip}
          <Tooltip evt="{evt}" let:detail>
            {@html createTooltip(detail.props)}
          </Tooltip>
        {/if}
      </Html>
    </LayerCake>
  </div>
{:else}
  <div style="{style}">
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
{/if}

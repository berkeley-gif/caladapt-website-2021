<script>
  import { SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { scaleBand } from "d3-scale";

  import AxisY from "./AxisY.svelte";
  import Tooltip from "./Tooltip.svelte";
  import Circles from "./Circles.svelte";

  export let data;
  export let height;
  export let padding = { top: 16, right: 16, bottom: 16, left: 16 };
  export let y1 = 100;
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
    yDomain = data.map((d) => d[yAxis.key]);
  }

  function createTooltip(d) {
    return tooltipFn(d);
  }
</script>

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

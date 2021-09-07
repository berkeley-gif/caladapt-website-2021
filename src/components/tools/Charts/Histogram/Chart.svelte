<script>
  import { SkeletonText, SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { bin, thresholdFreedmanDiaconis, extent, max } from "d3-array";

  import Column from "./Column.svelte";
  import Annotation from "./Annotation.svelte";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Tooltip from "./Tooltip.svelte";

  export let data;
  export let labels;
  export let height = 400;
  export let threshold;
  export let xDomain;

  export let yAxis = {
    label: "YAxis Label",
    tickFormat: (d) => d,
    units: "",
  };
  export let xAxis = {
    label: "XAxis Label",
    tickFormat: (d) => d,
    units: "",
  };

  const xKey = ["x0", "x1"];
  const yKey = "length";

  let hist;
  let bins;
  let yDomain;
  let dataExtent;

  let evt;
  let hideTooltip = true;

  $: style = `height:${height}px`;

  $: if (data) {
    dataExtent = extent(data);
    hist = bin().domain(dataExtent).thresholds(thresholdFreedmanDiaconis);
    bins = hist(data);
    yDomain = [0, max(bins, (d) => d.length / data.length) * 100];
  }

  function labelColumn(d) {
    const percent = (d.length / data.length) * 100;
    return `${percent.toFixed(1)}% of observations are between ${d.x0}–${
      d.x1
    } ${xAxis.units}`;
  }

  function createTooltip(d) {
    return labelColumn(d);
  }
</script>

{#if data}
  <div style="{style}">
    <LayerCake
      padding="{{ top: 80, right: 16, bottom: 64, left: 16 }}"
      x="{xKey}"
      y="{yKey}"
      data="{bins}"
      height="{height}"
      xDomain="{xDomain ? xDomain : dataExtent}"
      yDomain="{yDomain}"
    >
      <Svg>
        <AxisX
          gridlines="{false}"
          baseline="{true}"
          snapTicks="{true}"
          label="{xAxis.label}"
          tickFormat="{xAxis.tickFormat}"
        />
        <AxisY
          gridlines="{true}"
          label="{yAxis.label}"
          tickFormat="{yAxis.tickFormat}"
        />
        <Column
          strokeWidth="{1}"
          total="{data.length}"
          on:mousemove="{(event) => (evt = hideTooltip = event)}"
          on:mouseout="{() => (hideTooltip = true)}"
        />
        <Annotation
          units="{xAxis.units}"
          lines="{labels}"
          threshold="{threshold}"
        />
      </Svg>
      <Html pointerEvents="{false}">
        {#if hideTooltip !== true}
          <Tooltip evt="{evt}" let:detail>
            {@html createTooltip(detail.props)}
          </Tooltip>
        {/if}
      </Html>
    </LayerCake>
  </div>
{:else}
  <div class="chart-legend">
    <SkeletonText />
    <SkeletonText />
  </div>
  <div style="{style}">
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
{/if}

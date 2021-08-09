<script>
  import { SkeletonText, SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { scaleTime } from "d3-scale";
  import { timeFormat } from "d3-time-format";
  import { min, max } from "d3-array";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import Line from "./Line.svelte";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Tooltip from "../Shared/Tooltip.svelte";

  export let data;
  export let height = "350px";
  export let tooltip = {
    title: "",
  };
  export let yAxis = {
    key: "value",
    label: "YAxis Label",
    baseValue: null,
    tickFormat: (d) => d,
    units: "",
  };
  export let xAxis = {
    key: "date",
    label: "XAxis Label",
    baseValue: null,
    tickFormat: timeFormat("%Y"),
    units: "",
  };

  let chartContainer;
  let xmin;
  let xmax;
  let ymin;
  let ymax;

  $: if (data) {
    // Set X Domain
    xmin = min(data, (d) => d.date);
    xmax = max(data, (d) => d.date);
    if (xAxis.baseValue === 0) {
      xmin = xAxis.baseValue;
    }

    // Set Y Domain
    ymin = min(data, (d) => d.value);
    ymax = max(data, (d) => d.value);
    if (yAxis.baseValue === 0) {
      ymin = yAxis.baseValue;
    }
  }

  function getTooltipLabel(d) {
    const item = data.find((series) => series.key === d);
    if (item) {
      return item.label;
    } else {
      d;
    }
  }

  function getTooltipValue(d) {
    return `${yAxis.tickFormat(d)}`;
  }

  function getTooltipTitle(d) {
    return `${d} ${tooltip.title}`;
  }
</script>

{#if data}
  <div style="{`height:${height}`}" bind:this="{chartContainer}">
    <LayerCake
      padding="{{ top: 40, right: 40, bottom: 40, left: 40 }}"
      x="{xAxis.key}"
      y="{yAxis.key}"
      xScale="{scaleTime()}"
      xDomain="{[xmin, xmax]}"
      yDomain="{[ymin, ymax]}"
      data="{data}"
    >
      <Svg>
        <AxisX
          formatTick="{xAxis.tickFormat}"
          baseline="{true}"
          gridlines="{false}"
          snapTicks="{false}"
          ticks="{data.map((d) => d.date)}"
        />
        <AxisY label="{yAxis.label}" gridlines="{true}" />
        <g class="line-group">
          <Line />
        </g>
      </Svg>
      <Html>
        <!--           <Tooltip
            dataset={dataByDate}
            title={getTooltipTitle}
            label={getTooltipLabel}
            value={getTooltipValue}
          /> -->
      </Html>
    </LayerCake>
  </div>
{:else}
  <div class="chart-legend">
    <SkeletonText />
    <SkeletonText />
  </div>
  <div style="{`height:${height}`}">
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
{/if}

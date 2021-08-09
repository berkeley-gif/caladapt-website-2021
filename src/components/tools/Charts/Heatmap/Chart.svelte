<script>
  import {
    SkeletonText,
    SkeletonPlaceholder,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import { LayerCake, Svg } from "layercake";
  import { scaleBand, scaleTime, scaleQuantile } from "d3-scale";
  import { timeFormat } from "d3-time-format";
  import { min, max, range } from "d3-array";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import Heatmap from "./Heatmap.svelte";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Legend from "./Legend.svelte";

  export let data;
  export let height = "350px";
  export let yAxis = {
    key: "day",
    label: "YAxis Label",
    units: "",
  };
  export let xAxis = {
    key: "date",
    label: "XAxis Label",
    tickFormat: timeFormat("%Y"),
    units: "",
  };

  let chartContainer;
  let series = [];
  let selectedData;
  let xmin;
  let xmax;
  let ymin;
  let ymax;
  let zmin;
  let zmax;
  let yDomain;
  let colorScale;
  let monthStartDays = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

  function filterData(e) {
    if (!e.detail) {
      selectedData = data[0];
      return;
    }
    selectedData = data.find((d) => d.key === e.detail);
  }

  $: if (data) {
    // Set X Domain
    xmin = min(data, (arr) => min(arr.values, (d) => d.date));
    xmax = max(data, (arr) => max(arr.values, (d) => d.date));

    // Set Y Domain
    const yminMonth = min(data, (arr) =>
      min(arr.values, (d) => parseInt(d.date.getMonth()))
    );
    const ymaxMonth = max(data, (arr) =>
      max(arr.values, (d) => parseInt(d.date.getMonth()))
    );

    // Find the month start day number to define yDomain
    ymin = monthStartDays[yminMonth];
    ymax = monthStartDays[ymaxMonth + 1];
    yDomain = monthStartDays.slice(yminMonth, ymaxMonth + 1);

    // Set Color Domain
    zmin = min(data, (arr) => min(arr.values, (d) => d.value));
    zmax = max(data, (arr) => max(arr.values, (d) => d.value));
    colorScale = scaleQuantile()
      .domain([zmin, zmax])
      .range(["#fed976", "#fd8d3c", "#e31a1c", "#800026"]);

    // Set Legend
    const stopValues = [zmin, ...colorScale.quantiles()];
    const legendItems = stopValues.map((val, i) => {
      const start = val;
      const stop = stopValues[i + 1] || zmax;
      return {
        label: `${start.toFixed(1)}-${stop.toFixed(1)} °F`,
        color: colorScale(start),
      };
    });
    setContext("Legend", writable(legendItems));

    // Set series
    series = data.map((d) => {
      return {
        key: d.key,
        label: d.label,
      };
    });

    // Set data
    selectedData = data.find((d) => d.key !== "observed");
  }
</script>

<style>
  .series-select :global(.bx--select--inline .bx--select-input) {
    background-color: #f4f4f4;
    width: 250px;
  }
</style>

{#if data}
  <div class="series-select">
    <Select
      inline
      labelText="SELECT SERIES"
      selected="{selectedData.key}"
      on:change="{filterData}"
    >
      {#each series as s}
        <SelectItem value="{s.key}" text="{s.label}" />
      {/each}
    </Select>
  </div>
  <div class="chart-legend">
    <Legend />
  </div>
  <div style="{`height:${height}`}" bind:this="{chartContainer}">
    <LayerCake
      padding="{{ top: 10, right: 10, bottom: 30, left: 25 }}"
      x="{xAxis.key}"
      y="{yAxis.key}"
      xScale="{scaleTime()}"
      yScale="{scaleBand()}"
      xDomain="{[xmin, xmax]}"
      yDomain="{range(ymin, ymax)}"
      data="{data}"
    >
      <Svg>
        <AxisX
          formatTick="{xAxis.tickFormat}"
          baseline="{true}"
          gridlines="{false}"
          snapTicks="{false}"
        />
        <AxisY ticks="{yDomain}" gridlines="{true}" />
        <g class="heatmap-group">
          <Heatmap series="{selectedData}" fill="{colorScale}" />
        </g>
      </Svg>
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

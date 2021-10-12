<script>
  import { SkeletonText, SkeletonPlaceholder } from "carbon-components-svelte";
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
  import Control from "./Control.svelte";

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
  export let colors;

  let chartData;
  let chartContainer;
  let xDomain;
  let yDomain;
  let yTicks;
  let colorScale = scaleQuantile().range(colors);
  let monthStartDays = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  let initialSeriesSelection;

  $: if (data) {
    // Set X Domain
    const xmin = min(data, (arr) => min(arr.values, (d) => d.date));
    const xmax = max(data, (arr) => max(arr.values, (d) => d.date));
    xDomain = [xmin, xmax];

    // The observed dataseries do not extend to end of century
    // Find the first series in data that does extend across the
    // complete xDomain
    initialSeriesSelection = data.find(({ values }) => {
      const seriesXMax = max(values, (d) => d.date);
      return seriesXMax.getFullYear() >= xmax.getFullYear();
    });

    // Update visibility of data series
    chartData = data.map((series) => {
      return {
        ...series,
        visible: series.id === initialSeriesSelection.id,
      };
    });

    // Set Y Domain
    const yminMonth = min(data, (arr) =>
      min(arr.values, (d) => parseInt(d.date.getMonth()))
    );
    const ymaxMonth = max(data, (arr) =>
      max(arr.values, (d) => parseInt(d.date.getMonth()))
    );
    // Find the month start day number to define yDomain
    const ymin = monthStartDays[yminMonth];
    const ymax = monthStartDays[ymaxMonth + 1];
    yDomain = range(ymin, ymax);
    yTicks = monthStartDays.slice(yminMonth, ymaxMonth + 1);

    // Set Color Domain
    const zmin = min(data, (arr) => min(arr.values, (d) => d.value));
    const zmax = max(data, (arr) => max(arr.values, (d) => d.value));
    colorScale.domain([zmin, zmax]);

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

    // Set Controls
    const controlItems = data.map(({ id, label, color }) => {
      return {
        id,
        label,
        color,
        visible: id === initialSeriesSelection.id ? true : false,
      };
    });
    setContext("Control", writable(controlItems));
  }
</script>

{#if data}
  <div style="{`height:${height}`}" bind:this="{chartContainer}">
    <LayerCake
      padding="{{ top: 10, right: 10, bottom: 30, left: 25 }}"
      x="{xAxis.key}"
      y="{yAxis.key}"
      xScale="{scaleTime()}"
      yScale="{scaleBand()}"
      xDomain="{xDomain}"
      yDomain="{yDomain}"
    >
      <Svg>
        <AxisX
          formatTick="{xAxis.tickFormat}"
          baseline="{true}"
          gridlines="{false}"
          snapTicks="{false}"
        />
        <AxisY ticks="{yTicks}" gridlines="{true}" />
        <g class="heatmap-group">
          {#each chartData as series}
            <Heatmap series="{series}" fill="{colorScale}" />
          {/each}
        </g>
      </Svg>
    </LayerCake>
  </div>
  <div class="chart-legend">
    <Legend />
  </div>
  <div class="chart-controls">
    <Control />
  </div>
{:else}
  <div style="{`height:${height}`}">
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
  <div class="chart-legend">
    <SkeletonText />
    <SkeletonText />
  </div>
{/if}

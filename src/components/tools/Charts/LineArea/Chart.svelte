<script>
  import { SkeletonText, SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { scaleTime } from "d3-scale";
  import { timeFormat } from "d3-time-format";
  import { min, max } from "d3-array";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { almostEqual } from "~/helpers/utilities";

  import Line from "./Line.svelte";
  import Area from "./Area.svelte";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Tooltip from "../Shared/Tooltip.svelte";
  import Legend from "../Shared/Legend.svelte";

  export let data;
  export let height = "350px";
  export let dataByDate;
  export let tooltip = {
    title: "",
  };
  export let yAxis = {
    key: "value",
    label: "YAxis Label",
    minDefault: null,
    maxDefault: null,
    tickFormat: (d) => d,
    units: "",
  };
  // Currently minDefault & maxDefault props are not supported for xAxis
  // To support these props for xAxis in the future, an additional check
  // should be added to filter data so the timeseries values are
  // within the minDefault & maxDefault
  export let xAxis = {
    key: "date",
    label: "XAxis Label",
    tickFormat: timeFormat("%Y"),
    units: "",
  };

  let chartContainer;
  const legendItems = writable(null);
  let xmin;
  let xmax;
  let ymin;
  let ymax;
  let lineData;
  let areaData;

  let noData = false;

  $: if (Array.isArray(data) && isEmptyData(data)) {
    noData = true;
    xmin = new Date(Date.UTC(1950, 0, 1));
    xmax = new Date(Date.UTC(2099, 0, 1));
    ymin = 10;
    ymax = 50;
    lineData = [];
    areaData = [];
    legendItems.set([]);
    setContext("Legend", legendItems);
  }

  $: if (Array.isArray(data) && !isEmptyData(data)) {
    noData = false;

    // Set X Domain
    xmin = min(data, (arr) => min(arr.values, (d) => d.date));
    xmax = max(data, (arr) => max(arr.values, (d) => d.date));

    // Set Y Domain
    if (typeof yAxis.minDefault === "number" && !isNaN(yAxis.minDefault)) {
      ymin = yAxis.minDefault;
    } else {
      ymin = min(data, (arr) =>
        min(arr.values, (d) => ("min" in d ? d.min : d.value))
      );
    }

    ymax = max(data, (arr) =>
      max(arr.values, (d) => ("max" in d ? d.max : d.value))
    );

    // Check if ymin & ymax are almost equal
    const tolerance =
      typeof yAxis.maxDefault === "number" && !isNaN(yAxis.maxDefault)
        ? yAxis.maxDefault
        : 1;
    // If almost equal, it indicates all the values for the timeseries
    // are close together, probably close to 0
    // In that case set the ymax value to maxDefault/tolerance
    // to generate more than 1 tick on the y axis
    if (almostEqual(ymin, ymax, tolerance)) {
      ymax = tolerance;
    }

    // Set Legend
    legendItems.set(
      data.map((series) => {
        return {
          id: series.id,
          label: series.label,
          color: series.color,
          visible: series.visible,
          mark: series.mark,
        };
      })
    );
    setContext("Legend", legendItems);

    lineData = data.filter((d) => d.mark === "line");
    areaData = data.filter((d) => d.mark === "area");
  }

  function isEmptyData(_data) {
    return (
      !_data.length || Math.max(..._data.map((d) => d.values.length)) === 0
    );
  }

  function getTooltipLabel(d) {
    const item = data.find((series) => series.id === d);
    if (item) {
      return item.label;
    } else {
      d;
    }
  }

  function getTooltipColor(d) {
    const item = data.find((series) => series.id === d);
    if (item) {
      return item.color;
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
  <div
    class:no-data="{noData}"
    style="{`height:${height}`}"
    bind:this="{chartContainer}"
  >
    <LayerCake
      padding="{{ top: 20, right: 10, bottom: 30, left: 25 }}"
      x="{xAxis.key}"
      y="{yAxis.key}"
      yNice="{true}"
      xScale="{scaleTime()}"
      xDomain="{[xmin, xmax]}"
      yDomain="{[ymin, ymax]}"
      xPadding="{[10, 10]}"
      data="{data}"
    >
      <Svg>
        <AxisX
          formatTick="{xAxis.tickFormat}"
          baseline="{true}"
          gridlines="{false}"
          snapTicks="{false}"
        />
        <AxisY
          formatTick="{yAxis.tickFormat}"
          label="{yAxis.label}"
          gridlines="{true}"
        />
        <g class="area-group">
          {#if areaData}
            {#each areaData as area}
              <Area series="{area}" />
            {/each}
          {/if}
        </g>
        <g class="line-group">
          {#if lineData}
            {#each lineData as line}
              <Line series="{line}" />
            {/each}
          {/if}
        </g>
      </Svg>
      <Html>
        <Tooltip
          dataset="{dataByDate}"
          title="{getTooltipTitle}"
          label="{getTooltipLabel}"
          value="{getTooltipValue}"
          color="{getTooltipColor}"
        />
      </Html>
    </LayerCake>
  </div>
  <div class="chart-legend margin--v-16">
    <Legend />
  </div>
{:else}
  <div style="{`height:${height}`}">
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
  <div class="chart-legend margin--v-16">
    <SkeletonText />
    <SkeletonText />
  </div>
{/if}

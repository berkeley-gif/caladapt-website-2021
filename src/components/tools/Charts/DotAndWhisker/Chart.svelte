<script>
  import { SkeletonText, SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { scaleBand } from "d3-scale";
  import { timeFormat, timeParse } from "d3-time-format";
  import { min, max, groups } from "d3-array";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { isEmptyData } from "~/helpers/utilities";

  import DotAndWhisker from "./DotAndWhisker.svelte";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Tooltip from "./Tooltip.svelte";
  import Legend from "../Shared/Legend.svelte";

  export let data;
  export let height = "350px";
  export let yAxis = {
    key: "value",
    label: "YAxis Label",
    baseValue: null,
    tickFormat: (d) => d,
    units: "",
  };
  export let xAxis = {
    key: "id",
    groupKey: "groupLabel",
    label: "XAxis Label",
    baseValue: null,
    units: "",
  };

  let chartContainer;
  const legendItems = writable(null);
  let dataByGroup;
  let ymin;
  let ymax;

  let xKeys;
  let xGroups;
  let x0;
  let x1;

  let evt;
  let hideTooltip = true;

  let dateParse = timeParse("%Y-%m-%d");
  let dateFormat = timeFormat("%Y");

  let noData = false;

  //$: if (!isEmptyData(data)) {
  $: if (data) {
    noData = false;

    // Update Data
    dataByGroup = groups(data, (d) => d.groupLabel);
    console.log("data by group", dataByGroup);

    // Update X Axis
    xKeys = Array.from(new Set(data.map((d) => d.id)));
    xGroups = dataByGroup.map((series) => series[0]);
    console.log(xKeys, xGroups);

    x0 = scaleBand().domain(xGroups).padding(0.5);

    x1 = scaleBand()
      .domain(xKeys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.5)
      .align(0);

    // Update Y Domain
    ymin = min(data, (d) => d.ci_lower);
    ymax = max(data, (d) => d.ci_upper);
    if (yAxis.baseValue === 0) {
      ymin = yAxis.baseValue;
    }
    console.log("y domain", ymin, ymax);

    // Update Legend
    legendItems.set(
      xKeys.map((id) => {
        const series = data.find((d) => d.id === id);
        return {
          id: series.id,
          label: series.label,
          color: series.color,
          visible: true,
        };
      })
    );
    setContext("Legend", legendItems);
  }

  function createTooltip(d) {
    let tooltip;
    tooltip = `<span class="title">${d.label}</span>`;
    tooltip += `<span class="title">
      <span class="key" style="background:${d.color}"></span>
      ${d.label}
    </span>`;
    const val = Math.round(d.value * 100) / 100;
    const lower = Math.round(d.lowerci * 100) / 100;
    const upper = Math.round(d.upperci * 100) / 100;
    tooltip += `<span>Return level: ${val} ${yAxis.units}</span>`;
    if (lower === 0 || upper === 0) {
      tooltip += "<span>Insufficient observations to calculate CI</span>";
    } else {
      tooltip += `<span>95% CI: ${lower} – ${upper} ${yAxis.units}</span>`;
    }
    return tooltip;
  }
</script>

{#if data}
  <div class="chart-legend">
    <Legend />
  </div>
  <div style="{`height:${height}`}" bind:this="{chartContainer}">
    <LayerCake
      padding="{{ top: 20, right: 10, bottom: 30, left: 25 }}"
      x="{xAxis.key}"
      y="{yAxis.key}"
      rScale="{x0}"
      rDomain="{xGroups}"
      xScale="{x1}"
      xDomain="{xKeys}"
      yDomain="{[ymin, ymax]}"
      data="{dataByGroup}"
    >
      <Svg>
        <AxisX />
        <AxisY
          formatTick="{yAxis.tickFormat}"
          label="{yAxis.label}"
          gridlines="{true}"
        />
        <DotAndWhisker
          data="{dataByGroup}"
          on:mousemove="{(event) => (evt = hideTooltip = event)}"
          on:mouseout="{() => (hideTooltip = true)}"
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
  <div style="{`height:${height}`}">
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
{/if}

<script>
  import { SkeletonText, SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { bin, thresholdFreedmanDiaconis, extent, max } from "d3-array";
  import { scaleBand } from "d3-scale";

  import Column from "./Column.svelte";
  import Annotation from "./Annotation.svelte";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Tooltip from "./Tooltip.svelte";
  import Observations from "./Observations.svelte";

  export let data;
  export let labels;
  export let height = 400;
  export let forecast;
  export let measured;
  export let threshold;

  export let yAxis = {
    label: "YAxis Label",
    tickFormat: (d) => d,
  };
  export let xAxis = {
    label: "XAxis Label",
    tickFormat: (d) => d,
  };

  const xKey = ["x0", "x1"];
  const yKey = "length";

  let hist;
  let bins;
  let xDomain;
  let yDomain;
  let dataExtent;

  let evt;
  let hideTooltip = true;

  let evtForecast;
  let hideTooltipForecast = true;

  function calculateDataExtent() {
    if (threshold) {
      return [
        Math.min(dataExtent[0], threshold),
        Math.max(dataExtent[1], threshold),
      ];
    } else {
      return (xDomain = dataExtent);
    }
  }

  $: style = `height:${height}px`;

  $: if (data) {
    dataExtent = extent(data);
    hist = bin().domain(dataExtent).thresholds(thresholdFreedmanDiaconis);
    bins = hist(data);
    yDomain = [0, max(bins, (d) => d.length / data.length) * 100];
    xDomain = calculateDataExtent();
  }

  $: if (threshold && data) {
    xDomain = calculateDataExtent();
  }

  function labelForecast(d) {
    let label;
    label = `<span class="title">${d.name} ${d.label}</span>`;
    label += d.detailedForecast;
    return label;
  }

  function labelColumn(d) {
    const percent = (d.length / data.length) * 100;
    return `${percent.toFixed(1)}% of observations are between ${d.x0}–${
      d.x1
    } ${xAxis.units}`;
  }

  function createForecastTooltip(d) {
    return labelForecast(d);
  }

  function createHistogramTooltip(d) {
    return labelColumn(d);
  }
</script>

{#if data}
  <div style="{style}">
    <LayerCake
      padding="{{ top: 70, right: 30, bottom: 40, left: 35 }}"
      x="{xKey}"
      y="{yKey}"
      data="{bins}"
      height="{height}"
      xDomain="{xDomain}"
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
        <Annotation lines="{labels}" threshold="{threshold}" />
      </Svg>
      <Html pointerEvents="{false}">
        {#if hideTooltip !== true}
          <Tooltip evt="{evt}" let:detail>
            {@html createHistogramTooltip(detail.props)}
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

{#if measured}
  <div style="height:150px;">
    <LayerCake
      padding="{{ top: 30, right: 30, bottom: 20, left: 35 }}"
      x="{xKey}"
      y="label"
      yScale="{scaleBand()}"
      data="{bins}"
      height="{150}"
      xDomain="{xDomain}"
      yDomain="{measured.map((d) => d.label)}"
    >
      <Svg>
        <text x="{-10}" y="{-15}" style="font-size:18px;font-weight:600;">
          Recent Observations
        </text>
        <AxisY gridlines="{true}" label="{''}" />
        <Observations data="{measured}" yHeight="{-70}" />
      </Svg>
    </LayerCake>
  </div>
{/if}

{#if forecast}
  <div style="height:150px;">
    <LayerCake
      padding="{{ top: 30, right: 30, bottom: 20, left: 35 }}"
      x="{xKey}"
      y="label"
      yScale="{scaleBand()}"
      data="{bins}"
      height="{150}"
      xDomain="{xDomain}"
      yDomain="{forecast.map((d) => d.label)}"
    >
      <Svg>
        <text x="{-10}" y="{-15}" style="font-size:18px;font-weight:600;">
          NWS Forecast
        </text>
        <AxisY gridlines="{true}" label="{''}" />
        <Observations
          data="{forecast}"
          yHeight="{-220}"
          on:mousemove="{(event) =>
            (evtForecast = hideTooltipForecast = event)}"
          on:mouseout="{() => (hideTooltipForecast = true)}"
        />
      </Svg>
      <Html pointerEvents="{false}">
        {#if hideTooltipForecast !== true}
          <Tooltip evt="{evtForecast}" let:detail>
            {@html createForecastTooltip(detail.props)}
          </Tooltip>
        {/if}
      </Html>
    </LayerCake>
  </div>
{/if}

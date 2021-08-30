<script>
  import { SkeletonText, SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { bin, thresholdFreedmanDiaconis, extent, min, max } from "d3-array";
  import { scaleBand } from "d3-scale";

  import Column from "./Column.svelte";
  import Annotation from "./Annotation.svelte";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Tooltip from "./Tooltip.svelte";
  import Forecast from "./Forecast.svelte";

  export let data;
  export let labels;
  export let height = 400;
  export let forecast;
  export let threshold;

  export let yAxis = {
    label: "YAxis Label",
    tickFormat: (d) => d,
  };
  export let xAxis = {
    label: "XAxis Label",
    tickFormat: (d) => d,
  };

  let chartContainer;
  let forecastContainer;

  const xKey = ["x0", "x1"];
  const yKey = "length";

  let hist;
  let bins;
  let xDomain;
  let dataExtent;

  let evt;
  let hideTooltip = true;

  let yDomainForecast;
  let yKeyForecast = "label";
  let yScaleForecast = scaleBand();
  let evtForecast;
  let hideTooltipForecast = true;

  $: style = `height:${height}px`;

  $: if (forecast) {
    console.log("foreast", forecast);
    yDomainForecast = forecast.map((d) => d.label);
  }

  $: if (data) {
    dataExtent = extent(data);
    hist = bin().domain(dataExtent).thresholds(thresholdFreedmanDiaconis);
    bins = hist(data);
  }

  $: if (threshold) {
    xDomain = [
      Math.min(dataExtent[0], threshold),
      Math.max(dataExtent[1], threshold),
    ];
  } else {
    xDomain = dataExtent;
  }

  function labelForecast(d) {
    let label;
    label = `<span class="title">${d.name} ${d.label}</span>`;
    label += d.detailedForecast;
    return label;
  }

  function labelColumn(d) {
    let label;
    label = `<span class="title">${d.length} occurrences</span>`;
    label += `${d.x0}–${d.x1} ${xAxis.units}`;
    return label;
  }

  function createForecastTooltip(d) {
    return labelForecast(d);
  }

  function createHistogramTooltip(d) {
    return labelColumn(d);
  }
</script>

{#if data}
  <div style="{style}" bind:this="{chartContainer}">
    <LayerCake
      padding="{{ top: 100, right: 30, bottom: 40, left: 35 }}"
      x="{xKey}"
      y="{yKey}"
      data="{bins}"
      height="{height}"
      xDomain="{xDomain}"
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
          on:mousemove="{(event) => (evt = hideTooltip = event)}"
          on:mouseout="{() => (hideTooltip = true)}"
        />
        <Annotation data="{labels}" threshold="{threshold}" />
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

{#if forecast}
  <div style="height:150px;" bind:this="{forecastContainer}">
    <LayerCake
      padding="{{ top: 10, right: 30, bottom: 20, left: 35 }}"
      x="{xKey}"
      y="{yKeyForecast}"
      yScale="{yScaleForecast}"
      data="{bins}"
      height="{150}"
      xDomain="{xDomain}"
      yDomain="{yDomainForecast}"
    >
      <Svg>
        <AxisY gridlines="{true}" label="{'Forecast'}" />
        <Forecast
          data="{forecast}"
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

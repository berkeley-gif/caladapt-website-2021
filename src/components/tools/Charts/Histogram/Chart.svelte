<script>
  import { SkeletonText, SkeletonPlaceholder } from "carbon-components-svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { bin, thresholdFreedmanDiaconis, extent } from "d3-array";

  import Column from "./Column.svelte";
  import Annotation from "./Annotation.svelte";
  import AxisX from "./AxisX.svelte";
  import AxisY from "./AxisY.svelte";
  import Tooltip from "./Tooltip.svelte";
  import Forecast from "./Forecast.svelte";

  export let data;
  export let labels;
  export let height = "400px";
  export let forecast;

  export let yAxis = {
    label: "YAxis Label",
    tickFormat: (d) => d,
  };
  export let xAxis = {
    label: "XAxis Label",
    tickFormat: (d) => d,
  };

  let chartContainer;

  const xKey = ["x0", "x1"];
  const yKey = "length";

  let domain;
  let hist;
  let bins;

  let evt;
  let hideTooltip = true;

  $: if (data) {
    domain = extent(data);
    hist = bin().domain(domain).thresholds(thresholdFreedmanDiaconis);
    bins = hist(data);
  }

  function labelForecast(d) {
    let label;
    label = `<span class="title">${d.name}</span>`;
    label += d.detailedForecast;
    return label;
  }

  function labelColumn(d) {
    let label;
    label = `<span class="title">${d.length} occurrences</span>`;
    label += `${d.x0}–${d.x1} ${xAxis.units}`;
    return label;
  }

  function createTooltip(d) {
    console.log("tooltip", d);
    let tooltip;
    if (d.detailedForecast) {
      tooltip = labelForecast(d);
    } else if (d.groupedForecast) {
      tooltip = d.groupedForecast.map((item) => {
        return `
          ${labelForecast(item)}
          <br />
        `;
      });
    } else {
      tooltip = labelColumn(d);
    }
    return tooltip;
  }
</script>

{#if data}
  <div style="{`height:${height}`}" bind:this="{chartContainer}">
    <LayerCake
      padding="{{ top: 100, right: 30, bottom: 30, left: 35 }}"
      x="{xKey}"
      y="{yKey}"
      data="{bins}"
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
          ticks="{3}"
          label="{yAxis.label}"
          tickFormat="{yAxis.tickFormat}"
        />
        <Column
          strokeWidth="{1}"
          on:mousemove="{(event) => (evt = hideTooltip = event)}"
          on:mouseout="{() => (hideTooltip = true)}"
        />
        <Annotation data="{labels}" />
        {#if forecast}
          <Forecast
            data="{forecast}"
            on:mousemove="{(event) => (evt = hideTooltip = event)}"
            on:mouseout="{() => (hideTooltip = true)}"
          />
        {/if}
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

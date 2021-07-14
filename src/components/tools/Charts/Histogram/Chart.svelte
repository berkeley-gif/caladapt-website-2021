<script>
  import { SkeletonText, SkeletonPlaceholder } from 'carbon-components-svelte';
  import { LayerCake, Svg, Html } from 'layercake';
  import { histogram, extent } from 'd3-array';

  import Column from './Column.svelte';
  import Annotation from './Annotation.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';
  import Tooltip from './Tooltip.svelte';

  export let data;
  export let labels;
  export let height = '350px';

  export let yAxis = {
    label: 'YAxis Label',
    tickFormat: (d) => d,
  }
  export let xAxis = {
    label: 'XAxis Label',
    tickFormat: (d) => d,
  }

  let chartContainer;
  
  const xKey = ['x0', 'x1'];
  const yKey = 'length';
  let binCount = 30;

  let domain;
  let hist;
  let bins;

  let evt;
  let hideTooltip = true;
  
  $: if (data) {
    domain = extent(data);
    hist = histogram()
      .domain(domain)
      .thresholds(thresholds(domain, binCount));
    bins = hist(data);
  }

function thresholds (domain, count) {
    const breaks = [domain[0]];
    const brek = (domain[1] - domain[0]) / count;
    while (breaks[breaks.length - 1] < domain[1]) {
      const node = breaks[breaks.length - 1] + brek;
      breaks.push(node);
    }
    return breaks;
  }

function createTooltip(d) {
    let tooltip;
    tooltip = `<span class="title">Tooltip</span>`;
    return tooltip;
  }
</script>

{#if data}
  <div style={`height:${height}`} bind:this={chartContainer}>
    <LayerCake
      padding={{ top: 20, right: 20, bottom: 30, left: 35 }}
      x={xKey}
      y={yKey}
      yDomain={[0, null]}
      data={bins}>
        <Svg>
          <AxisX
            gridlines={false}
            baseline={true}
            snapTicks={true}
            label={xAxis.label}
            tickFormat={xAxis.tickFormat}
          />
          <AxisY
            gridlines={true}
            ticks={3}
            label={yAxis.label}
            tickFormat={yAxis.tickFormat}
          />
          <Column
            strokeWidth={1}
            on:mousemove={event => evt = hideTooltip= event}
            on:mouseout={() => hideTooltip = true}
          />
          <Annotation
            data={labels.stats}
          />
        </Svg>
        <Html pointerEvents={false}>
          {#if hideTooltip !== true}
            <Tooltip {evt} let:detail>
              { @html createTooltip(detail.props)}
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
  <div style={`height:${height}`}>
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
{/if}
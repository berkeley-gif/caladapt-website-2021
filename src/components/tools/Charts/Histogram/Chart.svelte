<script>
  import { SkeletonText, SkeletonPlaceholder } from 'carbon-components-svelte';
  import { LayerCake, Svg, Html } from 'layercake';
  import { timeFormat } from 'd3-time-format';
  import { histogram, extent } from 'd3-array';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import Column from './Column.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';
  import Tooltip from '../Shared/Tooltip.svelte';

  export let data;
  export let height = '350px';
  export let tooltip = {
    title: '',
  };

  export let yAxis = {
    label: 'YAxis Label',
    tickFormat: (d) => d,
  }
  export let xAxis = {
    label: 'XAxis Label',
    tickFormat: timeFormat('%Y'),
  }

  let chartContainer;
  
  const xKey = ['x0', 'x1'];
  const yKey = 'length';
  let binCount = 40;

  let domain;
  let hist;
  let bins;

  console.log('data from chart', data);
  
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

  function getTooltipLabel(d) {
    const item = data.find(series => series.key === d);
    if (item) {
      return item.label;
    } else {
      d;
    }
  }

  function getTooltipColor(d) {
    const item = data.find(series => series.key === d);
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
  <div style={`height:${height}`} bind:this={chartContainer}>
    <LayerCake
      padding={{ top: 20, right: 10, bottom: 30, left: 65 }}
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
          />
          <AxisY
            gridlines={false}
            ticks={3}
            label={yAxis.label}
          />
          <Column
            fill={'steelblue'}
            stroke={'#000'}
            strokeWidth={1}
          />
        </Svg>
        <Html>
<!--           <Tooltip
            dataset={dataByDate}
            title={getTooltipTitle}
            label={getTooltipLabel}
            value={getTooltipValue}
            color={getTooltipColor}
          /> -->
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
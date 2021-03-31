<script>
  import { SkeletonText, SkeletonPlaceholder } from 'carbon-components-svelte';
  import { LayerCake, Svg, Html } from 'layercake';
  import { scaleOrdinal, scaleTime } from 'd3-scale';
  import { utcParse, timeParse, timeFormat } from 'd3-time-format';
  import { group, min, max, extent } from 'd3-array';
  //import { format } from 'd3-format';
  import { select } from 'd3-selection';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import Scatter from './Scatter.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';
  import Legend from '../Shared/Legend.svelte';
  import Tooltip from '../Shared/Tooltip.svelte';

  export let data;
  export let tooltip = {
    title: '',
  };
  export let yAxis = {
    key: 'value',
    label: 'YAxis Label',
    baseValue: null,
    tickFormat: (d) => d,
    units: '',
  }
  export let xAxis = {
    key: 'date',
    label: 'XAxis Label',
    baseValue: null,
    tickFormat: timeFormat('%Y'),
    units: '',
  }

  let chartContainer;
  let dataByDate;
  const legendItems = writable(null);
  let xmin;
  let xmax;
  let ymin;
  let ymax;
  
  $: if (data) {
    // Set X Domain
    xmin = min(data, arr => min(arr.values, d => d.date));
    xmax = max(data, arr => max(arr.values, d => d.date));
    if (xAxis.baseValue === 0) {
      xmin = xAxis.baseValue;
    }

    // Set Y Domain
    ymin = min(data, arr => min(arr.values, d => d.value || d.min));
    ymax = max(data, arr => max(arr.values, d => d.value || d.max));
    if (yAxis.baseValue === 0) {
      ymin = yAxis.baseValue;
    }

    // Set Legend
    legendItems.set(data.map(series => {
      return {
        key: series.key,
        label: series.label,
        color: series.color,
        visible: series.visible,
        mark: series.mark,
      };
    }));
    setContext('Legend', legendItems);


    // Reorganize data array for Tooltip
    const values = data.reduce((acc, series) => {
      const seriesValues = series.values.map(d => {
        return {
          ...d,
          key: series.key,
        };
      });
      acc.push(...seriesValues);
      return acc;
    }, []);

    dataByDate = Array.from(group(values, (d) => +d.date), ([dateKey, value]) => {
      const result = {};
      result.date = new Date(dateKey);
      value.forEach(d => {
        if (d.min) {
          result[d.key] = [d['min'], d['max']];
        } else {
          result[d.key] = d['value'];
        }
      });
      return result;
    });
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
    return `${yAxis.tickFormat(d)} ${yAxis.units}`;
  }

  function getTooltipTitle(d) {
    return `${d} ${tooltip.title}`;
  }
</script>

<style>
  .viz-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chart-container {
    width: 100%;
    flex: 2;
    height: 100%;
  }

  .legend {
    width: 100%;
    margin-bottom: 1rem;
  }
</style>

{#if data}
  <div class="viz-container">
    <div class="legend">
      <Legend />
    </div>
    <div class="chart-container" bind:this={chartContainer}>
      <LayerCake
        padding={{ top: 10, right: 10, bottom: 30, left: 25 }}
        x={xAxis.key}
        y={yAxis.key}
        xScale ={scaleTime()}
        xDomain={[ xmin, xmax ]}
        yDomain={[ ymin, ymax ]}
        data={data}>
          <Svg>
            <AxisX
              formatTick={xAxis.tickFormat}
              baseline={true}
              gridlines={false}
              snapTicks={false}
            />
            <AxisY
              formatTick={yAxis.tickFormat}
              label={yAxis.label}
              gridlines={true}
            />
            <g class="scatter-group">
              {#each data as series}
                <Scatter series={series} />
              {/each}
            </g>
          </Svg>
          <Html>
            <Tooltip
              dataset={dataByDate}
              title={getTooltipTitle}
              label={getTooltipLabel}
              value={getTooltipValue}
              color={getTooltipColor}
            />
          </Html>
        </LayerCake>
    </div>
  </div>
{:else}
  <div class="viz-container">
    <div class="legend">
      <SkeletonText />
      <SkeletonText />
    </div>
    <div class="chart-container">
      <SkeletonPlaceholder style="height:100%;width:100%;" />
    </div>
  </div>
{/if}


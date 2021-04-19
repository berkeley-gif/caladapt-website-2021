<script>
  import { SkeletonText, SkeletonPlaceholder } from 'carbon-components-svelte';
  import { LayerCake, Svg, Html } from 'layercake';
  import { scaleTime } from 'd3-scale';
  import { timeFormat } from 'd3-time-format';
  import { min, max } from 'd3-array';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import Line from './Line.svelte';
  import Area from './Area.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';
  import Tooltip from '../Shared/Tooltip.svelte';
  import Legend from '../Shared/Legend.svelte';

  export let data;
  export let height = '350px';
  export let dataByDate;
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
  const legendItems = writable(null);
  let xmin;
  let xmax;
  let ymin;
  let ymax;
  let lineData;
  let areaData;
  
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

    lineData = data.filter((d) => d.type === 'line');
    areaData = data.filter((d) => d.type === 'area');
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
  <div class="chart-legend">
    <Legend />
  </div>
  <div style={`height:${height}`} bind:this={chartContainer}>
    <LayerCake
      padding={{ top: 20, right: 10, bottom: 30, left: 25 }}
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
          <g class="area-group">
            {#if areaData}
              {#each areaData as area}
                <Area
                  series={area}
                />
              {/each}
            {/if}
          </g>
          <g class="line-group">
            {#if lineData}
              {#each lineData as line}
                <Line
                  series={line}
                />
              {/each}
            {/if}
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
{:else}
  <div class="chart-legend">
    <SkeletonText />
    <SkeletonText />
  </div>
  <div style={`height:${height}`}>
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
{/if}


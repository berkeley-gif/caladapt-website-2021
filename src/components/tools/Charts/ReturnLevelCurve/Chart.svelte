<script>
  import { SkeletonText, SkeletonPlaceholder } from 'carbon-components-svelte';
  import { LayerCake, Svg, Html } from 'layercake';
  import { scaleBand } from 'd3-scale';
  import { min, max, group } from 'd3-array';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import ReturnLevels from './ReturnLevels.svelte';
  import AxisX from './AxisX.svelte';
  import AxisY from './AxisY.svelte';
  import Tooltip from './Tooltip.svelte';
  import Legend from '../Shared/Legend.svelte';

  export let data;
  export let height = '350px';
  export let yAxis = {
    key: 'value',
    label: 'YAxis Label',
    baseValue: null,
    tickFormat: (d) => d,
    units: '',
  };
  export let xAxis = {
    key: 'period',
    label: 'XAxis Label',
    baseValue: null,
    tickFormat: (d) => d,
    units: '',
  };
  export let legend;

  let chartContainer;
  const legendItems = writable(null);
  let dataByGroup = [];

  let keys;
  let groupKeys;
  let x0;
  let x1;

  let ymin;
  let ymax;

  let evt;
  let hideTooltip = true;

  function createTooltip(d) {
    let tooltip;
    tooltip = `<span class="title">${d.timestep}</span>`;
    tooltip += `<span class="title">
      <span class="key" style="background:${d.color}"></span>
      ${d.label}
    </span>`;
    const val = Math.round(d.value * 100) / 100;
    const lower = Math.round(d.lowerci * 100) / 100;
    const upper = Math.round(d.upperci * 100) / 100;
    tooltip += `<span>Return period: ${d.period} years</span>`;
    tooltip += `<span>Return level: ${val} ${yAxis.units}</span>`;
    if (lower === 0 || upper === 0) {
      tooltip += '<span>Insufficient observations to calculate CI</span>';
    } else {
      tooltip += `<span>95% CI: ${lower} – ${upper} ${yAxis.units}</span>`;
    }
    return tooltip;
  }
  
  $: if (data) {
    // Update Data
    const groupedData = group(data, d => d.timestep, d => d.key);
    dataByGroup.length = 0;
    for (const timestep of [...groupedData]) {
      const [timestepKey, timestepValue] = timestep;
      const obj = { timestep: timestepKey, data: [] };
      for (const series of [...timestepValue]) {
        const [key, periods] = series;
        const seriesObj = {
          key,
          color: periods[0].color,
          label: periods[0].label,
          values: periods,
        };
        obj.data.push(seriesObj);
      }
      dataByGroup.push(obj);
    }

    // Update X Axis
    keys = [2, 5, 10, 20, 50, 100];
    groupKeys = dataByGroup.map(d => d.timestep);

    x0 = scaleBand()
      .domain(groupKeys)
      .padding(0.1);
    
    x1 = scaleBand()
      .domain(keys)
      .padding(0.05);

    // Update Y Domain
    ymin = min(data, d => d.lowerci);
    ymax = max(data, d => d.upperci);
    if (yAxis.baseValue === 0) {
      ymin = yAxis.baseValue;
    }

    // Update Legend
    legendItems.set(legend.map(key => {
      return {
        ...key,
        visible: true,
      };
    }));
    setContext('Legend', legendItems);
  }
</script>

{#if data}
  <div class="chart-legend">
    <Legend />
  </div>
  <div style={`height:${height}`} bind:this={chartContainer}>
    <LayerCake
      padding={{ top: 20, right: 10, bottom: 60, left: 25 }}
      x={xAxis.key}
      y={yAxis.key}
      rScale={x0}
      rDomain={groupKeys}
      xScale={x1}
      xDomain={keys}
      yDomain={[ ymin, ymax ]}
      data={dataByGroup}>
        <Svg>
          <AxisX
            formatTick={xAxis.tickFormat}
            label={xAxis.label}
            gridlines={true}
          />
          <AxisY
            formatTick={yAxis.tickFormat}
            label={yAxis.label}
          />
          <ReturnLevels
            data={dataByGroup}
            on:mousemove={event => evt = hideTooltip= event}
            on:mouseout={() => hideTooltip = true}/>
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
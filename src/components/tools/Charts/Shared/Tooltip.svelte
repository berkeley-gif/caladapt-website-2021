<script>
  import { getContext } from 'svelte';
  import { max } from 'd3-array';
  import QuadTree from './QuadTree.svelte';

  const { width, yScale, config } = getContext('LayerCake');
  const legendItems = getContext('Legend');

  export let dataset;
  export let w = 240;
  export let title = (d) => d;
  export let label = (d) => d;
  export let value = (d) => d;
  export let color = (d) => d;

  const w2 = w / 2;
  let top = 0;

  function getValue(val) {
    if (Array.isArray(val)) {
      return `${value(val[0])} ⁠–⁠ ${value(val[1])}`
    } else {
      return value(val);
    }
  }

  function setContents (result) {
    if (Object.keys(result).length === 0) return '';
    const year = result.date.getFullYear();    
    const rows = Object.keys(result)
      .filter(d => d !== $config.x) // remove date field
      .map(key => {
        return {
          key,
          value: result[key]
        };
      });

    const visibleRows = rows.filter((row) => {
      const legend = $legendItems.find(d => d.key === row.key);
      if (legend.visible) {
        return true;
      }
      return false;
    });

    const allValues = [];
    visibleRows.forEach((d) => {
      if (Array.isArray(d.value)) {
        allValues.push(...d.value);
      }
      allValues.push(d.value);
    });
    const highestValue = max(allValues);
    top = $yScale(highestValue);

    return `
      <div style="font-weight:600;padding:5px 0;">${title(year)}</div>
      ${visibleRows.map(row => {
        return `<div style="padding:3px 0;">
          <span style="background:${color(row.key)};width:10px;height:10px;display:inline-block;padding-right:1px;"></span>
          ${label(row.key)}: ${getValue(row.value)}
        </div>`})
      .join('')}`;
  }
</script>

<style>
  .chart-tooltip {
    position: absolute;
    font-size: 13px;
    pointer-events: none;
    border: 1px solid #ccc;
    background: rgba(0, 0, 0, 0.8);
    transform: translate(-50%, -100%);
    padding: 5px;
    transition: left 250ms ease-out, top 250ms ease-out;
    z-index: 15;
    color: #fff;
  }
</style>

<QuadTree
  {dataset}
  y='x'
  let:x
  let:y
  let:visible
  let:found
  let:e
>
  <div
    class="chart-tooltip"
    style="
      width:{w}px;
      display: { visible ? 'block' : 'none' };
      top: {top}px;
      left: {Math.min(Math.max(w2, x), $width - w2)}px;"
    >
    {@html setContents(found)}
  </div>
</QuadTree>
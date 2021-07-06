<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { area } from 'd3-shape';
  import { raise } from 'layercake';

  export let series;

  const { xGet, yGet, xScale, yScale } = getContext('LayerCake');
  const legendItems = getContext('Legend');
  const dispatch = createEventDispatcher();
  
  let show = true;

  $: $legendItems.forEach((d) => {
    if (d.key === series.key) {
      show = d.visible;
    }
  });

  function handleMousemove(feature) {
    return function handleMousemoveFn(e) {
      raise(this);
      // When the element gets raised, it flashes 0,0 for a second so skip that
      if (e.layerX !== 0 && e.layerY !== 0) {
        dispatch('mousemove', { e, props: feature });
      }
    }
  }

  $: linepath = values => {
    return 'M' + values
      .map(d => {
        return $xGet(d) + ',' + $yGet(d);
      })
      .join('L');
  };

  $: areapath = area()
    .x((d) => $xScale(d.period))
    .y0(d => $yScale(d.lowerci))
    .y1(d => $yScale(d.upperci));
</script>

{#if show}
  <g
    class={series.key}
    on:mouseout={() => dispatch('mouseout')}>
    <path
      class={`path-area ${series.key}`}
      d='{areapath(series.values)}'
      fill="{series.color.replace(/[^,]+(?=\))/, '0.1')}">
    </path>
    <path
      class={`path-line ${series.key}`}
      d='{linepath(series.values)}'
      stroke="{series.color}"
      fill="none"
      stroke-width="1px">
    </path>
    {#each series.values as d}
      <circle
        fill="{series.color}"
        r=3
        cx='{$xScale(d.period)}'
        cy='{$yScale(d.value)}'
        on:mouseover={(e) => dispatch('mousemove', { e, props: d })}
        on:mousemove={handleMousemove(d)}>
      </circle>
    {/each}
  </g>
{/if}
<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { area } from 'd3-shape';
  import { raise } from 'layercake';

  export let data;

  const { xGet, yGet, xScale, rScale, yScale, width, padding } = getContext('LayerCake');
  const dispatch = createEventDispatcher();

  function handleMousemove(feature) {
    return function handleMousemoveFn(e) {
      raise(this);
      // When the element gets raised, it flashes 0,0 for a second so skip that
      if (e.layerX !== 0 && e.layerY !== 0) {
        dispatch('mousemove', { e, props: feature });
      }
    }
  }

  $: $rScale.rangeRound([0, $width]);
  $: $xScale.rangeRound([0, $rScale.bandwidth()]);

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

<g
  class="rl-group"
  transform='translate({$padding.left}, 0)'
  on:mouseout={() => dispatch('mouseout')}>
  {#each data as group}
    <g class={group.timestep} transform='translate({$rScale(group.timestep)},0)'>
      {#each group.data as series}
        <g
          class={series.key}
          on:mouseover={(e) => dispatch('mousemove', { e, props: series })}
          on:mousemove={handleMousemove(series)}>
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
        </g>
      {/each}
    </g>
  {/each}
</g>
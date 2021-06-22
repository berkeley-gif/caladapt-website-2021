<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { raise } from 'layercake';

  export let data;

  const { xGet, yGet, xScale, rScale, width, padding } = getContext('LayerCake');
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

  $: path = values => {
    return 'M' + values
      .map(d => {
        return $xGet(d) + ',' + $yGet(d);
      })
      .join('L');
  };
</script>

<g
  class="rl-group"
  transform='translate(-{$padding.left}, 0)'
  on:mouseout={() => dispatch('mouseout')}>
  {#each data as group}
    <g class={group.timestep} transform='translate({$rScale(group.timestep)},0)'>
      {#each group.data as series}
        <g
          class={series.key}
          on:mouseover={(e) => dispatch('mousemove', { e, props: series })}
          on:mousemove={handleMousemove(series)}>
          <path
            class={`path-line ${series.key}`}
            d='{path(series.values)}'
            stroke="{series.color}"
            fill="none"
            stroke-width="1px">
          </path>
        </g>
      {/each}
    </g>
  {/each}
</g>
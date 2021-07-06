<script>
  import { getContext } from 'svelte';
  import SeriesGroup from './Series.svelte';

  export let data;

  const { xScale, rScale, width, padding } = getContext('LayerCake');

  $: $rScale.rangeRound([0, $width]);
  $: $xScale.rangeRound([0, $rScale.bandwidth()]);
</script>

<g
  class="rl-group"
  transform='translate({$padding.left}, 0)'>
  {#each data as group}
    <g class={group.timestep} transform='translate({$rScale(group.timestep)},0)'>
      {#each group.data as series}
        <SeriesGroup on:mousemove on:mouseover {series} />
      {/each}
    </g>
  {/each}
</g>
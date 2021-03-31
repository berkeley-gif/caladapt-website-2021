<script>
  import { getContext } from 'svelte';
  
  const { xScale, yScale } = getContext('LayerCake');

  export let series;
  export let fill;

  $: data = series.values;
</script>

<g class={`${series.key}`}>
  {#each data as d}
    <rect 
      x={$xScale(d.date)}
      y={$yScale(d.day)}
      width={"5px"}
      height={$yScale.bandwidth()}
      fill={fill(d.value)}
    />
  {/each}
</g>
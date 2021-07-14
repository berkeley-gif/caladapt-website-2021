<script>
  import { getContext } from 'svelte';

  const { padding, yScale, xScale } = getContext('LayerCake');

  export let data;
</script>

<g class="annotation-group" transform='translate({$padding.left}, 0)'>
  {#each data as d,i}
    <line
      x1={$xScale(d.value)}
      x2={$xScale(d.value)}
      y1={$yScale(0)}
      y2={$padding.top}
      stroke-dasharray="3,3"
      stroke="black"
      stroke-width="3px"
    />
    <text
      x={$xScale(d.value)}
      y={0}
      text-anchor="middle"
      style="font-weight:600;"
    >
      <tspan x={$xScale(d.value)} y={0}>{d.label.split(' ')[0]}</tspan>
      <tspan x={$xScale(d.value)} y={15}>{d.value} °F</tspan>
    </text>
  {/each}
</g>



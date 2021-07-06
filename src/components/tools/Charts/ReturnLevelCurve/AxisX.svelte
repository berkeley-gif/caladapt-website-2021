<script>
  import { getContext } from 'svelte';

  const { width, height, padding, xScale, rScale } = getContext('LayerCake');

  export let formatTick = d => d;

  $: d = `M 0 0 L 0 -${$height + 10}`;
  $: $rScale.rangeRound([0, $width]);
  $: $xScale.rangeRound([0, $rScale.bandwidth()]);
</script>

<g class='axis x-axis' transform='translate({$padding.left}, 0)'>
  {#each $rScale.domain() as group}
    <g class='tick' transform='translate({$rScale(group)},{$height + 10})'>
      <text
        y='16'
        text-anchor='middle'
        dx="90"
        dy="20" 
        style="font-size:13px;fill:#666">
        {formatTick(group)}
      </text>
      {#each $xScale.domain() as tick}
        <g transform='translate({$xScale(tick)},0)'>
          <path class="gridline" d={d} style="stroke:#aaa;stroke-dasharray:2;"></path>
          <text y='16' text-anchor='middle' style="font-size:12px;fill:#666">{tick}</text>
        </g>
      {/each}
    </g>
  {/each}
</g>
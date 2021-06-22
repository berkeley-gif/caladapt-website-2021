<script>
  import { getContext } from 'svelte';

  const { width, height, padding, xScale, rScale } = getContext('LayerCake');

  export let gridlines = false;
  export let formatTick = d => d;
  export let baseline = false;

  $: d = `M 0 0 L 0 -${$height + 10}`;
  $: console.log('width', $width);
  $: $rScale.rangeRound([$padding.left, $width]);
  $: console.log('bandwidth', $rScale.bandwidth());
  $: $xScale.rangeRound([0, $rScale.bandwidth()]);
  $: console.log('ticks', $xScale.range(), $xScale.domain());
</script>

<g class='axis x-axis' transform='translate({$padding.left}, 0)'>
  {#each $rScale.domain() as group, i}
    <g class='group' transform='translate({$rScale(group)},{$height + 10})'>
      <!-- <path
        style="stroke:#aaa;"
        d='M 0 0 l 75 0 l -150 0' /> -->
      <line x1=${rScale(group)} x2=${20} y1=90 y2=90 />
      <text
        y='16'
        text-anchor='middle'
        style="font-size:12px;fill:#666">
        {formatTick(group)}
      </text>
      {#each $xScale.domain() as tick, i}
        <g class='tick' transform='translate(0,{$height + 10})'>
          {#if gridlines}
            <path class="gridline" d={d} style="stroke:#aaa;stroke-dasharray:2;"></path>
          {/if}
          <path style="stroke:#aaa;" d='M 0 0 L 0 6'></path>
          <text y='16' text-anchor='middle' style="font-size:12px;fill:#666">{formatTick(tick)}</text>
        </g>
      {/each}
    </g>
  {/each}
</g>
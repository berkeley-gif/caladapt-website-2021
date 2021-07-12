<script>
  import { getContext } from 'svelte';

  const { width, padding, yScale } = getContext('LayerCake');

  export let ticks = undefined;
  export let gridlines = false;
  export let formatTick = d => d;
  export let label = 'Axis Label';

  let tickVals;

  $: if (ticks) {
    tickVals = Array.isArray(ticks) ? ticks : $yScale.ticks(ticks);
  } else {
    tickVals = $yScale.ticks();
  }

  $: d = `M 0 0 L ${$width + $padding.left} 0`;
</script>

<g class='axis y-axis' transform='translate(-{$padding.left}, 0)'>
  {#each tickVals as tick, i}
    <g class='tick tick-{tick}' transform='translate(0, {$yScale(tick)})'>
      {#if gridlines}
        <path class='gridline' d={d} style="stroke:#aaa;stroke-dasharray:2;"></path>
      {/if}
      <text y='-4' style="font-size:12px;fill:#666">{formatTick(tick)}</text>
      {#if i === (+tickVals.length - 1)}
        <text y='-4' x={$padding.left} class='label' style="font-size:14px;fill:#666">{label}</text>
      {/if}
    </g>
  {/each}
</g>
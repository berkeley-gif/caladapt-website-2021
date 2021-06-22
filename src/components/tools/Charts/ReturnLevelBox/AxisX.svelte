<script>
  import { getContext } from 'svelte';

  const { width, height, padding, rScale } = getContext('LayerCake');

  export let formatTick;

  $: $rScale.rangeRound([0, $width]);
</script>

<g class='axis x-axis' transform='translate({$padding.left}, 0)'>
  {#each $rScale.domain() as group}
    <g class='tick' transform='translate({$rScale(group)},{$height + 10})'>
      <path
        style="stroke:#aaa;"
        d='M 0 0 l 75 0 l -150 0' />
      <text
        y='16'
        text-anchor='middle'
        style="font-size:12px;fill:#666">
        {formatTick(group)}
      </text>
    </g>
  {/each}
</g>
<script>
  import { getContext } from 'svelte';

  const { xGet, yGet } = getContext('LayerCake');

  export let series;
  console.log('series', series);
 
  let show = true;
  const legendItems = getContext('Legend');

  $: $legendItems.forEach((d) => {
    if (d.key === series.key) {
      show = d.visible;
    }
  });

  $: path = values => {
    return 'M' + values
      .map(d => {
        return $xGet(d) + ',' + $yGet(d);
      })
      .join('L');
  };
</script>

<!-- {#if show} -->
  <path
    class={`path-line ${series.key}`}
    d='{path(series.values)}'
    stroke="{series.values[0].color}"
    fill="none"
    stroke-width="1px">
  </path>
<!-- {/if} -->
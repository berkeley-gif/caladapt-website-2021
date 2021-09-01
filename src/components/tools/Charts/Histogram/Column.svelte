<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { raise } from "layercake";

  const { data, xGet, yGet, yRange, xScale, yScale } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  export let fill = "#aaa";
  export let stroke = "#aaa";
  export let strokeWidth = 1;
  export let total;

  $: columnWidth = (d) => {
    const vals = $xGet(d);
    return Math.max(0, vals[1] - vals[0]);
  };

  $: y = (d) => {
    return $yScale((d.length / total) * 100);
  };

  $: columnHeight = (d) => {
    return $yScale(0) - $yScale((d.length / total) * 100);
  };

  function handleMousemove(feature) {
    return function handleMousemoveFn(e) {
      raise(this);
      // When the element gets raised, it flashes 0,0 for a second so skip that
      if (e.layerX !== 0 && e.layerY !== 0) {
        dispatch("mousemove", { e, props: feature });
      }
    };
  }
</script>

<g class="column-group">
  {#each $data as d, i}
    <rect
      class="group-rect"
      data-id="{i}"
      x="{$xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}"
      y="{y(d)}"
      width="{$xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}"
      height="{columnHeight(d)}"
      fill="{fill}"
      fill-opacity="{0.2}"
      stroke="{stroke}"
      stroke-width="{strokeWidth}"
      on:mouseout="{() => dispatch('mouseout')}"
      on:mouseover="{(e) => dispatch('mousemove', { e, props: d })}"
      on:mousemove="{handleMousemove(d)}"></rect>
  {/each}
</g>

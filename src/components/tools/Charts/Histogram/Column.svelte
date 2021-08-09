<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { raise } from "layercake";

  const { padding, data, xGet, yGet, yRange, xScale } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  export let fill = "steelblue";
  export let stroke = "";
  export let strokeWidth = 0;

  $: columnWidth = (d) => {
    const vals = $xGet(d);
    return Math.max(0, vals[1] - vals[0]);
  };

  $: columnHeight = (d) => {
    return $yRange[0] - $yGet(d);
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

<g class="column-group" transform="translate({$padding.left}, 0)">
  {#each $data as d, i}
    <rect
      class="group-rect"
      data-id="{i}"
      x="{$xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}"
      y="{$yGet(d)}"
      width="{$xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}"
      height="{columnHeight(d)}"
      fill="{fill}"
      stroke="{stroke}"
      stroke-width="{strokeWidth}"
      on:mouseout="{() => dispatch('mouseout')}"
      on:mouseover="{(e) => dispatch('mousemove', { e, props: d })}"
      on:mousemove="{handleMousemove(d)}"></rect>
  {/each}
</g>

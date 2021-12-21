<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { raise } from "layercake";

  export let data;
  $: console.log("dot whisler", data);

  const { x, y, xScale, yScale, rScale, width, padding } =
    getContext("LayerCake");
  const dispatch = createEventDispatcher();

  function handleMousemove(feature) {
    return function handleMousemoveFn(e) {
      raise(this);
      // When the element gets raised, it flashes 0,0 for a second so skip that
      if (e.layerX !== 0 && e.layerY !== 0) {
        dispatch("mousemove", { e, props: feature });
      }
    };
  }

  $: $rScale.rangeRound([0, $width]);
  $: $xScale.rangeRound([0, $rScale.bandwidth()]);
</script>

<g
  class="rl-group"
  transform="translate(-{$padding.left}, 0)"
  on:mouseout="{() => dispatch('mouseout')}"
>
  {#each data as [group, values]}
    <g class="{group}" transform="translate({$rScale(group)},0)">
      {#each values as d}
        <g
          class="{d.id}"
          on:mouseover="{(e) => dispatch('mousemove', { e, props: d })}"
          on:mousemove="{handleMousemove(d)}"
        >
          <line
            class="ci"
            stroke="var(--gray-30)"
            stroke-width="{2}"
            y1="{$yScale(d.ci_lower)}"
            y2="{$yScale(d.ci_upper)}"
            x1="{$xScale($x(d))}"
            x2="{$xScale($x(d))}"></line>
          <rect
            class="rl"
            x="{$xScale($x(d)) - 5}"
            y="{$yScale($y(d)) - 5}"
            width="{10}"
            height="{10}"
            fill="{d.color}"
            fill-opacity="{0.75}"
            stroke="{d.color}"
            stroke-width="{1}"></rect>
        </g>
      {/each}
    </g>
  {/each}
</g>

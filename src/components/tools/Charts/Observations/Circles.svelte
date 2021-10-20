<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { raise } from "layercake";

  const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");
  const dispatch = createEventDispatcher();

  export let y1;

  $: midHeight = $yScale.bandwidth() / 2;

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

<style>
  .circle {
    fill: var(--teal-60);
    fill-opacity: 1;
  }

  .line {
    stroke: var(--teal-30);
    stroke-dasharray: 3, 3;
    stroke-width: 1;
  }

  .label {
    fill: var(--teal-60);
    font-weight: 600;
    stroke: white;
    stroke-width: 2;
    paint-order: stroke;
  }

  .label-na {
    fill: var(--gray-50);
    font-style: italic;
  }
</style>

<g class="data">
  {#each $data as d}
    {#if Array.isArray(d.value)}
      {#each d.value as val, i}
        <g>
          <circle
            cy="{$yGet(d) + midHeight}"
            cx="{$xScale(val)}"
            class="circle"
            r="{5}"
          >
          </circle>
          {#if i == 1}
            <line
              x1="{$xScale(val)}"
              x2="{$xScale(val)}"
              y1="{y1}"
              y2="{$yGet(d) + midHeight}"
              class="line"
            >
            </line>
            <text
              y="{$yGet(d) + midHeight + 4}"
              x="{$xScale(i) + 10}"
              class="label"
            >
              {d.valueLabel}
            </text>
          {/if}
        </g>
      {/each}
    {:else if !isNaN(d.value)}
      <g>
        <line
          x1="{$xGet(d)}"
          x2="{$xGet(d)}"
          y1="{y1}"
          y2="{$yGet(d) + midHeight}"
          class="line"
        >
        </line>
        <circle
          cy="{$yGet(d) + midHeight}"
          cx="{$xGet(d)}"
          class="circle"
          r="{5}"
          on:mouseout="{() => dispatch('mouseout')}"
          on:mouseover="{(e) => dispatch('mousemove', { e, props: d })}"
          on:mousemove="{handleMousemove(d)}"
        >
        </circle>
        <text y="{$yGet(d) + midHeight + 4}" x="{$xGet(d) + 10}" class="label">
          {d.valueLabel}
        </text>
      </g>
    {:else}
      <g>
        <text y="{$yGet(d) + midHeight + 4}" x="{40}" class="label-na">
          Data Not Available
        </text>
      </g>
    {/if}
  {/each}
</g>

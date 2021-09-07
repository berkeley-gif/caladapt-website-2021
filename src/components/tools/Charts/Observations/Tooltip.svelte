<script>
  export let evt = {};
  export let offset = 35;
</script>

<style>
  .chart-tooltip {
    position: absolute;
    font-size: 14px;
    line-height: 1.2;
    pointer-events: none;
    border: 1px solid #ccc;
    background: rgba(0, 0, 0, 0.8);
    transform: translate(-50%, -100%);
    padding: 5px;
    transition: left 250ms ease-out, top 250ms ease-out;
    z-index: 15;
    color: #fff;
    width: 150px;
  }

  :global(.chart-tooltip > span) {
    display: block;
    line-height: 1.35;
  }

  :global(.chart-tooltip > span.title) {
    font-weight: bold;
  }

  :global(.chart-tooltip span.key) {
    display: inline-block;
    width: 10px;
    height: 10px;
  }
</style>

{#if evt.detail}
  <div
    class="chart-tooltip"
    style="
      top:{evt.detail.e.layerY - offset}px;
      left:{evt.detail.e.layerX}px;
    "
  >
    <slot detail="{evt.detail}" />
  </div>
{/if}

<script>
  export let evt = {};
  export let offset = 35;
  export let units;

  function formatValue(d) {
    return +Math.round(d * 100) / 100;
  }

  $: ({ e, props } = evt.detail);
  $: ({ groupLabel, color, label, value, ci_lower, ci_upper } = props);
  $: lower = formatValue(ci_lower);
  $: upper = formatValue(ci_upper);
  $: ciLabel =
    lower === 0 || upper === 0
      ? "Insufficient observations to calculate Confidence Intervals"
      : `95% Confidence Intervals: ${lower} – ${upper} ${units}`;
</script>

<style>
  .chart-tooltip {
    position: absolute;
    font-size: 13px;
    pointer-events: none;
    border: 1px solid #ccc;
    background: rgba(0, 0, 0, 0.8);
    transform: translate(-50%, -100%);
    padding: 5px;
    transition: left 250ms ease-out, top 250ms ease-out;
    z-index: 15;
    color: #fff;
    width: 220px;
  }

  :global(.chart-tooltip > span) {
    display: block;
    line-height: 1.35;
  }

  :global(.chart-tooltip > .key) {
    margin: var(--spacing-8) 0;
    display: block;
  }

  :global(.chart-tooltip span.title) {
    font-weight: bold;
  }

  :global(.chart-tooltip span.swatch) {
    display: inline-block;
    width: 10px;
    height: 10px;
  }
</style>

{#if evt.detail}
  <div
    class="chart-tooltip"
    style="
      top:{e.layerY - offset}px;
      left:{e.layerX}px;
    "
  >
    <span class="title">{props.groupLabel}</span>
    <div class="key">
      <span class="swatch" style="background:{props.color}"></span>
      <span class="title">{props.label}</span>
    </div>
    <span>Return Level: {formatValue(value)} {units}</span>
    <span>{ciLabel}</span>
  </div>
{/if}

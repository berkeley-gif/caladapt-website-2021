<script>
  import { Button, InlineNotification } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let title;
  export let indicatorLabel;
  export let durationLabel;
  export let scenarioLabel;
  export let thresholdLabel;
  export let loadLocation;
  export let intervalsLabel;
  export let polygonAggregationMsg = "";
  export let uncertaintyMsg = "";
</script>

<style>
  p {
    max-width: 70ch;
  }
</style>

<Button
  class="btn-change-location"
  size="small"
  icon="{Location16}"
  kind="ghost"
  on:click="{loadLocation}"
>
  Change Location
</Button>

<h2 class="h3">
  {title}
</h2>

<div class="h4">
  Projected changes in <span class="annotate">{indicatorLabel}</span>

  {#if indicatorLabel.includes("Intensity")}
    which are exceeded on average once every
    <span class="annotate">{intervalsLabel}</span>
  {/if}

  under a <span class="annotate">{scenarioLabel}</span>.
</div>

<p>
  Extreme Precipitation events are successive days in which the <span
    class="annotate">{durationLabel}</span
  >
  rainfall total is above an extreme threshold of
  <span class="annotate">{thresholdLabel}</span>.
</p>

{#if uncertaintyMsg}
  <InlineNotification
    lowContrast
    hideCloseButton
    title="Note:"
    subtitle="{uncertaintyMsg}"
    kind="warning"
  />
{/if}

{#if polygonAggregationMsg}
  <InlineNotification
    lowContrast
    title="Update:"
    subtitle="{polygonAggregationMsg}"
    kind="info"
  />
{/if}

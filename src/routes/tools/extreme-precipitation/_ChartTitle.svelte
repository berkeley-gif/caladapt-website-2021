<script>
  import { Button } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let title;
  export let indicatorLabel;
  export let eventLabel;
  export let scenarioLabel;
  export let thresholdLabel;
  export let loadLocation;
  export let intervalsLabel;
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

{#if indicatorLabel.includes("Intensity")}
  <p class="h4">
    Projected changes in <span class="annotate">{indicatorLabel}</span> which
    are are exceeded on average once every
    <span class="annotate">{intervalsLabel}</span>
    under a
    <span class="annotate">{scenarioLabel}</span>.
  </p>
  <p>
    Extreme Precipitation events are consecutive days in which the <span
      class="annotate">{eventLabel}</span
    >
    is above an extreme threshold of
    <span class="annotate">{thresholdLabel}</span>.
  </p>
{:else}
  <p class="h4">
    Projected changes in <span class="annotate">{indicatorLabel}</span> with
    <span class="annotate">{eventLabel}</span>
    above an extreme threshold of <span class="annotate">{thresholdLabel}</span>
    under a
    <span class="annotate">{scenarioLabel}</span>.
  </p>
{/if}

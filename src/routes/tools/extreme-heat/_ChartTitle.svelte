<script>
  import { Button } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let title;
  export let indicatorLabel;
  export let climvarLabel;
  export let scenarioLabel;
  export let thresholdLabel;
  export let loadLocation;
  export let durationLabel;

  let label;

  $: if (indicatorLabel.includes("Heat Wave")) {
    label = indicatorLabel.replace("Number of", `Number of ${durationLabel}`);
  } else {
    label = indicatorLabel;
  }
</script>

<style>
  div {
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
  Projected changes in <span class="annotate">{label}</span> when
  <span class="annotate">{climvarLabel}</span>
  is above <span class="annotate">{thresholdLabel}</span> under a
  <span class="annotate">{scenarioLabel}</span>.
</div>

<script>
  import { Button } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let title;
  export let indicatorLabel;
  export let monthsLabel;
  export let scenarioLabel;
  export let loadLocation;
  export let periodLabel;

  $: label = indicatorLabel.includes("Annual") ? monthsLabel : periodLabel;
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
<p class="h4">
  Projected changes in <span class="annotate">{indicatorLabel}</span> by Water
  Year under a <span class="annotate">{scenarioLabel}</span> for
  <span class="annotate">{label}</span>.
</p>

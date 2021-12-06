<script>
  import { Button } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let title;
  export let subtitle;
  export let climvarLabel;
  export let scenarioLabel;
  export let periodLabel;
  export let loadLocation;
</script>

<style>
  div {
    max-width: 70ch;
  }

  p {
    color: var(--gray-80);
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
  Projected changes in <span class="annotate">{climvarLabel}</span> by
  <span class="annotate">{periodLabel}</span>
  under a
  <span class="annotate">{scenarioLabel}</span>*
</div>
<p>*{subtitle}</p>

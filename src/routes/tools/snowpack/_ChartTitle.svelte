<script>
  import { Button } from "carbon-components-svelte";
  import { Location16 } from "carbon-icons-svelte";

  export let title;
  export let monthLabel;
  export let scenarioLabel;
  export let loadLocation;
</script>

<Button
  class="btn-change-location"
  size="small"
  icon="{Location16}"
  kind="ghost"
  on:click="{loadLocation}"
>
  Change Location
</Button>
<div class="h3">
  {title}
</div>
<div class="h4">
  Projected changes in Snow Water Equivalent for the month of <span
    class="annotate">{monthLabel}</span
  >
  under a
  <span class="annotate">{scenarioLabel}</span>.
</div>

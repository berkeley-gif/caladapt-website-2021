<script>
  import { createEventDispatcher } from "svelte";
  import { RadioButtonGroup, RadioButton } from "carbon-components-svelte";

  export let selectedId;
  export let items;
  export let title = "Select Scenario";

  const dispatch = createEventDispatcher();
  let selected = items.find((d) => d.id === selectedId);

  function change(e) {
    selected = items.find((d) => d.id === e.detail);
    dispatch("change", selected);
  }
</script>

<div class="scenario-select">
  <RadioButtonGroup
    legendText="{title}"
    class="scenario-select"
    orientation="vertical"
    selected="{selectedId}"
    on:change="{change}"
  >
    {#each items as opt}
      <RadioButton labelText="{opt.label}" value="{opt.id}" />
    {/each}
  </RadioButtonGroup>
</div>

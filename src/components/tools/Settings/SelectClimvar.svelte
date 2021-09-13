<script>
  import { createEventDispatcher } from "svelte";
  import { Select, SelectItem } from "carbon-components-svelte";

  export let selectedId;
  export let items;
  export let labelText = "Select Climate Variable";

  const dispatch = createEventDispatcher();

  let selected = items.find((d) => d.id === selectedId);

  function change(e) {
    selected = items.find((d) => d.id === e.detail);
    dispatch("change", selected);
  }
</script>

<Select labelText="{labelText}" selected="{selectedId}" on:change="{change}">
  {#each items as opt}
    <SelectItem value="{opt.id}" text="{opt.label}" />
  {/each}
</Select>

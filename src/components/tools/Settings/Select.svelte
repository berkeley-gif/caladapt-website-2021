<script>
  import { createEventDispatcher } from "svelte";
  import { Select, SelectItem } from "carbon-components-svelte";

  export let selectedId;
  export let items;
  export let title = "";
</script>

<Select labelText="{title}" selected="{selectedId}" on:change>
  {#each items as item}
    <SelectItem value="{item.id}" text="{item.text}" />
  {/each}
</Select>

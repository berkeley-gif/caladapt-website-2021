<script>
  import { createEventDispatcher } from "svelte";
  import { Select, SelectItem } from "carbon-components-svelte";

  export let selectedId;
  export let items;
  export let addStateBoundary = false;
  export let title = "Aggregate Data By Boundary";

  const dispatch = createEventDispatcher();

  if (!addStateBoundary) {
    items = items.filter((d) => d.id !== "states");
  }

  let selected = items.find((d) => d.id === selectedId);

  function change(e) {
    selected = items.find((d) => d.id === e.detail);
    dispatch("change", selected);
  }
</script>

<Select
  class="boundary-select"
  labelText="{title}"
  selected="{selectedId}"
  on:change="{change}"
>
  {#each items as opt}
    <SelectItem value="{opt.id}" text="{opt.label}" />
  {/each}
</Select>

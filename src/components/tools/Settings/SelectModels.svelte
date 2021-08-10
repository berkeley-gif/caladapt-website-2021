<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { MultiSelect, SelectSkeleton } from "carbon-components-svelte";

  export let selectedIds;
  export let items;

  let selectedIdsArr = selectedIds.split(",");
  let ready = false;
  const dispatch = createEventDispatcher();
  const sortItem = (a, b) => a.order - b.order;

  const formatSelected = (i) =>
    i.length === 0 ? "No models selected" : i.join(", ");

  function select(e) {
    selectedIdsArr = e.detail.selectedIds;
    dispatch("change", e.detail);
  }

  $: feedback = formatSelected(selectedIdsArr);

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<style>
</style>

{#if ready}
  <MultiSelect
    bind:selectedIds="{selectedIdsArr}"
    titleText=""
    label="Select..."
    items="{items}"
    sortItem="{sortItem}"
    on:select="{select}"
  />
{:else}
  <SelectSkeleton />
{/if}

<div class="font-size-sm mt-2">
  {feedback}
</div>

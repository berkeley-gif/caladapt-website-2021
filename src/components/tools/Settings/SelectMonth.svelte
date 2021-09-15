<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    MultiSelect,
    Select,
    SelectItem,
    SelectSkeleton,
  } from "carbon-components-svelte";

  export let selectedId;
  export let items;
  export let title = "Select Month";
  export let multi = false;

  const dispatch = createEventDispatcher();

  let selected = items.find((d) => d.id === selectedId);
  let ready = false;

  function change(e) {
    selected = items.find((d) => d.id === parseInt(e.detail));
    dispatch("change", selected);
  }

  function select(e) {
    dispatch("change", e.detail.selectedIds);
  }

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<style>
  :global(.month-select .bx--select-input) {
    background-color: #f4f4f4;
  }
</style>

{#if ready}
  {#if multi}
    <MultiSelect
      class="month-select"
      titleText="{title}"
      label="Select months"
      selectedIds="{selectedId}"
      items="{items}"
      on:select="{select}"
      sortItem="{() => {}}"
    />
  {:else}
    <Select
      class="month-select"
      labelText="{title}"
      selectedIds="{selectedId}"
      on:change="{change}"
    >
      {#each items as opt}
        <SelectItem value="{opt.id}" text="{opt.label}" />
      {/each}
    </Select>
  {/if}
{:else}
  <SelectSkeleton />
{/if}

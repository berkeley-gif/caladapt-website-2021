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
  let invalid = false;
  let ready = false;
  let selectedIdsArr = multi && selectedId;

  $: idSet = new Set(multi ? selectedIdsArr : []);
  $: feedback = idSet.size
    ? items
        .filter(({ id }) => idSet.has(id))
        .map(({ text }) => text)
        .join(", ")
    : "";

  function change(e) {
    selected = items.find((d) => d.id === parseInt(e.detail));
    dispatch("change", selected);
  }

  function select(e) {
    selectedIdsArr = e.detail.selectedIds;
    if (e.detail.selectedIds && e.detail.selectedIds.length) {
      invalid = false;
      dispatch("change", e.detail.selectedIds);
    } else {
      invalid = true;
    }
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

  .feedback {
    font-size: 0.85rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>

{#if ready}
  {#if multi}
    <MultiSelect
      class="month-select"
      invalid="{invalid}"
      invalidText="Choose at least one month"
      titleText="{title}"
      label="Select months"
      selectedIds="{selectedId}"
      items="{items}"
      on:select="{select}"
      sortItem="{() => {}}"
    />
    <div>
      <p class="feedback">{feedback}</p>
    </div>
  {:else}
    <Select
      class="month-select"
      labelText="{title}"
      selected="{selectedId}"
      on:change="{change}"
    >
      {#each items as opt}
        <SelectItem value="{opt.id}" text="{opt.label || opt.text}" />
      {/each}
    </Select>
  {/if}
{:else}
  <SelectSkeleton />
{/if}

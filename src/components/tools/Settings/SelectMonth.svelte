<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { Select, SelectItem, SelectSkeleton } from "carbon-components-svelte";

  export let selectedId;
  export let items;
  export let title = "Select Month";

  const dispatch = createEventDispatcher();

  let selected = items.find((d) => d.id === selectedId);
  let ready = false;

  function change(e) {
    selected = items.find((d) => d.id === parseInt(e.detail));
    dispatch("change", selected);
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
  <Select
    class="month-select"
    labelText="{title}"
    selected="{selectedId}"
    on:change="{change}"
  >
    {#each items as opt}
      <SelectItem value="{opt.id}" text="{opt.label}" />
    {/each}
  </Select>
{:else}
  <SelectSkeleton />
{/if}

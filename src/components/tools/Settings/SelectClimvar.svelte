<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { Select, SelectItem, SelectSkeleton } from "carbon-components-svelte";

  export let selectedId;
  export let items;

  const dispatch = createEventDispatcher();

  let selected = items.find((d) => d.id === selectedId);
  let ready = false;

  function change(e) {
    selected = items.find((d) => d.id === e.detail);
    dispatch("change", selected);
  }

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

{#if ready}
  <Select
    labelText="Select Climate Variable"
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

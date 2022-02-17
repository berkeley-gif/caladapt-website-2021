<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    RadioButton,
    RadioButtonGroup,
    RadioButtonSkeleton,
  } from "carbon-components-svelte";

  export let items;
  export let selected;
  export let title = "Select Indicator";
  export let disabled = false;

  const dispatch = createEventDispatcher();
  let ready = false;

  $: selected, dispatch("change", selected);

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

{#if ready}
  <RadioButtonGroup
    bind:disabled
    legendText="{title}"
    orientation="vertical"
    bind:selected
  >
    {#each items as { id, label }}
      <RadioButton labelText="{label}" value="{id}" />
    {/each}
  </RadioButtonGroup>
{:else}
  <RadioButtonGroup>
    <RadioButtonSkeleton />
    <RadioButtonSkeleton />
  </RadioButtonGroup>
{/if}

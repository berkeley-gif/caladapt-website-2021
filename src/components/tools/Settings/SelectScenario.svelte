<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    RadioButtonGroup,
    RadioButton,
    RadioButtonSkeleton,
  } from 'carbon-components-svelte';

  export let selectedId;
  export let items;

  const dispatch = createEventDispatcher();
  let selected = items.find(d => d.id === selectedId);
  let ready = false;

  function change(e) {
    selected = items.find(d => d.id === e.detail);
    dispatch('change', selected);
  }
  
  onMount(() => {
    ready = true;
    dispatch('ready');
  });
</script>

{#if ready}
  <RadioButtonGroup
    orientation="vertical"
    selected={selectedId}
    on:change={change}>
    {#each items as opt}
      <RadioButton labelText={opt.label} value={opt.id}/>  
    {/each}
  </RadioButtonGroup>
{:else}
  <RadioButtonGroup orientation="vertical">
    <RadioButtonSkeleton />
    <RadioButtonSkeleton />
  </RadioButtonGroup>
{/if}
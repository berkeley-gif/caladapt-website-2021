<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    NumberInputSkeleton,
  } from 'carbon-components-svelte';
  import DebouncedNumberInput from './DebouncedNumberInput.svelte';

  export let label = '';
  export let value = 4;
  export let helperText = 'Helper Text'
  export let min = 1;
  export let max = 7;

  const dispatch = createEventDispatcher();
  
  let ready = false;

  function update() {
    dispatch('change', value);
  }

  onMount(() => {
    ready = true;
    dispatch('ready');
  });
</script>

{#if ready}
  <DebouncedNumberInput
    bind:value
    showControls={true}
    on:change={update}
    {label}
    {min}
    {max}
    {helperText} />
{:else}
  <NumberInputSkeleton />
{/if}


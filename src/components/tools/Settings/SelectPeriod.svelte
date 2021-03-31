<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    NumberInput,
    NumberInputSkeleton,
    Button,
  } from 'carbon-components-svelte';

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

<style>
  :global(.period .bx--number input[type='number']) {
    min-width: 5rem;
  }
</style>

{#if ready}
  <div class="d-flex align-items-start mt-1">
    <NumberInput class="period" bind:value {label} {min} {max} {helperText} />
    <Button style="width:3rem;padding-right:12px;height:40px;margin-left:5px;" kind="secondary" size="small" on:click={update}>Set</Button>
  </div>
{:else}
  <NumberInputSkeleton />
{/if}


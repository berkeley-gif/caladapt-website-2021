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

{#if ready}
  <div style="display:flex;align-items:start;">
    <NumberInput
      class="period"
      bind:value
      {label}
      {min}
      {max}
      {helperText} />
    <Button
      kind="tertiary"
      size="small"
      style="margin-left:10px;padding-right:12px;"
      on:click={update}>
      Set
    </Button>
  </div>
{:else}
  <NumberInputSkeleton />
{/if}


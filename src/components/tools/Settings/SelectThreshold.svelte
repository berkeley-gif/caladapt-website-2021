<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    TileGroup,
    RadioTile,
    NumberInput,
    NumberInputSkeleton,
    Button,
  } from 'carbon-components-svelte';

  export let label = '';
  export let defaultValue;
  export let customValue;
  export let useCustom = false;
  export let units = '°F';

  const dispatch = createEventDispatcher();
  
  let openSet = false;
  let ready = false;

  let userInput = 0;

  let selected = 'default';
  if (useCustom) {
    selected = 'custom';
  }

  $: if (selected === 'default') {
    useCustom = false;
    dispatch('change', { type: 'default', value: defaultValue });
  }

  function updateCustomThreshold() {
    customValue = userInput; // set threshold to user input
    //openSet = false; // close modal
    useCustom = true;
    dispatch('change', { type: 'custom', value: customValue });
  }

  onMount(() => {
    ready = true;
    dispatch('ready');
  });
</script>

<style>
  :global(.sm.bx--tile-group .bx--tile) {
    min-height: 2rem;
    padding: 0.5rem;      
  }

  :global(.sm.bx--tile-group .bx--tile__checkmark) {
    top: 0.5rem;
  }

  :global(.sm.bx--tile-group .bx--tile-content) {
    font-size: 0.8rem;
  }

  :global(.threshold .bx--number input[type='number']) {
    min-width: 5rem;
  }
</style>

{#if ready}
  <TileGroup legend={label} bind:selected class="sm">
    <RadioTile value="default" checked>
      <span class="d-block">98th Percentile</span>
      <span style="font-size: 0.75rem;font-weight:500;">{defaultValue} {units}</span>
    </RadioTile>
    <RadioTile value="custom">
      <span class="d-block">Custom</span>
      {#if selected === 'custom'}
        <div class="d-flex align-items-center mt-2">
          <NumberInput class="threshold" bind:value={userInput} />
          &nbsp;{units}&nbsp;
          <Button style="width:3rem;padding-right:12px;" kind="secondary" size="small" on:click={updateCustomThreshold}>Set</Button>        
        </div>
      {/if}
    </RadioTile>
  </TileGroup>
{:else}
  <NumberInputSkeleton />
{/if}


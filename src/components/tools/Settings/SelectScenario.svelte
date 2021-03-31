<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    RadioButtonSkeleton,
  } from 'carbon-components-svelte';

  export let selectedId;
  export let items;

  const dispatch = createEventDispatcher();
  let selected = items.find(d => d.id === selectedId);
  let open = false;
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

<!-- <FormGroup style="margin-bottom:0;"> -->
  {#if ready}
    <RadioButtonGroup orientation="vertical" selected={selectedId} on:change={change}>
      {#each items as opt}
        <div class="d-flex align-items-center">
          <RadioButton labelText={opt.label} value={opt.id}/>  
        </div>
      {/each}
    </RadioButtonGroup>
  {:else}
    <RadioButtonGroup orientation="vertical">
      <RadioButtonSkeleton />
      <RadioButtonSkeleton />
    </RadioButtonGroup>
  {/if}
<!-- </FormGroup> -->
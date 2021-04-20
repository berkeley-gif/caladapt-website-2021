<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    RadioButtonGroup,
    RadioButton,
    RadioButtonSkeleton,
    NumberInput,
  } from 'carbon-components-svelte';
  import { debounce } from '../../../helpers/utilities';

  export let selectedId;
  export let items;

  console.log('from component', selectedId, items);

  const dispatch = createEventDispatcher();
  let selected = items.find(d => d.id === selectedId);;
  let ready = false;
  let value = 100;

  function change(e) {
    if (!e.detail) return;
    selected = items.find(d => d.id === e.detail);
    if (selected.id === 'default') {
      dispatch('change', selected);
    }
  }

  const setCustom = debounce((e) => {
    console.log('on change', e.detail);
    selected.value = value;
    dispatch('change', selected);
  }, 1000);
  
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
  {#if selected.id === 'default'}
    <div style="display:flex;align-items:start;">
      <NumberInput
        disabled={true}
        style="padding-right:0;"
        value={selected.value} />
    </div>
  {/if}
  {#if selected.id === 'custom'}
    <div style="display:flex;align-items:start;">
      <NumberInput
        style="padding-right:0;"
        on:change={setCustom}
        bind:value />
    </div>
  {/if}
{:else}
  <RadioButtonGroup orientation="vertical">
    <RadioButtonSkeleton />
    <RadioButtonSkeleton />
  </RadioButtonGroup>
{/if}
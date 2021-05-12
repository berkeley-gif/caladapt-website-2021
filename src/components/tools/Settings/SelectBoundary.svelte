<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    Select,
    SelectItem,
    SkeletonPlaceholder,
  } from 'carbon-components-svelte';

  export let selectedId;
  export let items;
  export let addStateBoundary = false;

  const dispatch = createEventDispatcher();

  if (addStateBoundary) {
    items.push({
      id: 'ca',
      type: 'line',
      text: 'State of California',
      metadata: {
        group: 'Boundaries',
        title: 'State of California',
        placeholder: '',
      },
      source: {
        type: 'vector',
        tiles: ['https://api.cal-adapt.org/vtiles/locagrid/{z}/{x}/{y}.pbf'],
        minzoom: 1,
        maxzoom: 20,
      },
      'source-layer': 'locagrid',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        visibility: 'none',
      },
      paint: {
        'line-opacity': 0.75,
        'line-color': 'rgb(107 231 186)',
        'line-width': 1,
      },
    });
  }

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

<style>
  :global(.bx--label::before) {
    content: '';
    background: url(img/icons/gear.svg);
    display: inline-block;
    height: 1rem;
    width: 1rem;
    margin-right: 3px;
    vertical-align: -25%;
  }

  :global(.boundary-select .bx--select-input) {
    background-color: #f4f4f4;
  }
</style>

{#if ready}
  <Select
    class="boundary-select"
    labelText="AGGREGATE DATA BY BOUNDARY"
    selected={selectedId}
    on:change={change}>
    {#each items as opt}
      <SelectItem value={opt.id} text={opt.text} />
    {/each}
  </Select>
{:else}
  <SkeletonPlaceholder style="height:20px;margin-top:5px;" />
{/if}

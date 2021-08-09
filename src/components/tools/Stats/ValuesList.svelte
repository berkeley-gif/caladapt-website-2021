<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Button,
    SkeletonText,
  } from 'carbon-components-svelte';

  export let title;
  export let stats;
  export let units;

  const dispatch = createEventDispatcher();

  function update(value) {
    dispatch('change', value);
  }
</script>

<style lang="scss">
  .stat-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .stat-data {
    display: flex;
    flex-direction: column;
    margin: 1rem 0.5rem;
  }

  .stat-title {
    display: block;
    margin-top: 0.5rem;
    font-weight: 600;
    font-size: 1rem;
  }

  .stat-text {
    font-size: 0.8rem;
    color: #51585e;
    text-transform: uppercase;
    max-width: 13ch;
    line-height: 1.2;
  }

  :global(.stat-value .bx--btn) {
    font-size: 1.35rem;
    margin: 0.25rem 0;
    padding: 10px;
  }
</style>

{#if stats}
  <div class="stat">
    <!-- title -->
    <div class="stat-header">
      <span class="stat-title">{title}</span>    
    </div>
    <!-- group -->
    <div class="stat-group">
      {#each stats as item}
        <div class="stat-data">
          <div class="stat-text">{item.label}</div>
          <div class="stat-value">
            <Button
              kind="tertiary"
              on:click={() => update(item.value)}>
              {item.value} {units}
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="stat">
    <SkeletonText paragraph lines={2} />
  </div>
{/if}

<script>
  import { Tag } from 'carbon-components-svelte';
  import { createEventDispatcher } from 'svelte';

  export let categories;

  const dispatch = createEventDispatcher();

  let selected = categories[0];

  function selectCategory(category) {
    selected = category;
    dispatch('change', { category });
  }
</script>

<style lang="scss">
  .filter-tags {
    margin: 1rem 0;
  }

  .filter-tags :global(.bx--tag.active) {
    background: #074e67;
    color: white;
  }
</style>

<div class="filter-tags">
  {#each categories as category,i }
    <Tag
      style="font-size:1rem;margin:0.5rem;"
      interactive
      type="cool-gray"
      class={selected === category ? 'active': ''}
      on:click={() => selectCategory(category)}
    >
      {category}
    </Tag>
  {/each}
</div>
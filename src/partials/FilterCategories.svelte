<script>
  import { Tag } from 'carbon-components-svelte';
  import { createEventDispatcher } from 'svelte';
  import { Sun, Rainfall, Sea, Snowflake, Streamflow, Wildfire, App } from '../components/icons';

  export let categories;

  const dispatch = createEventDispatcher();

  let selected = categories[0];

  const icons = [
    ['All', [App]],
    ['Temperature', [Sun]],
    ['Precipitation', [Rainfall, Streamflow]],
    ['Snowpack', [Snowflake]],
    ['Sea Level Rise', [Sea]],
    ['Wildfire', [Wildfire]],
  ];

  const iconsMap = new Map(icons);

  function selectCategory(category) {
    selected = category;
    dispatch('change', { category });
  }
</script>

<style lang="scss">
  .filter-tags {
    margin: 1rem 0;
  }

  .filter-tags :global(.bx--tag) {
    border-radius: 0.25rem;
  }

  .filter-tags :global(.bx--tag.active) {
    background: #074e67;
    color: white;
  }

  .filter-label {
    padding: 0 5px;
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
      <div class="center">
        {#each iconsMap.get(category) as icon, i}
          <span class="filter-icon">
            <svelte:component dimension={25} this={iconsMap.get(category)[i]} />
          </span>
        {/each}
        <span class="filter-label">
          {category}
        </span>
      </div>
    </Tag>
  {/each}
</div>
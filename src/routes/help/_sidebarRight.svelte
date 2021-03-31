<script>
  import { createEventDispatcher } from 'svelte';
  import { stores } from '@sapper/app';
  import { Search, Select, SelectItem } from "carbon-components-svelte";

  const { page } = stores();
  const dispatch = createEventDispatcher();
  let showSidebar = false;
  let showFilter = false;
  let showGlossaryInfo = false;
  let options = ['data', 'tools', 'other'];

  $: category = $page.params.category;
  
  $: if (category === 'tutorials' || category === 'faqs') {
    showSidebar = true;
    showFilter = true;
    showGlossaryInfo = false;
  } else if (category === 'glossary') {
    showSidebar = true;
    showFilter = false;
    showGlossaryInfo = true;
  } else {
    showSidebar = false;
    showFilter = false;
    showGlossaryInfo = false;
  }

  function updateSearch(e) {
    dispatch('search', e.target.value);
  }

  function updateFilter(e) {
    dispatch('filter', e.detail);
  }

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
</script>

{#if showSidebar}
  <div class="is-sticky">
    <h6>Filters</h6>
    <!-- Search -->
    <Search
     style="padding-left: 1.5rem;"
     on:change={updateSearch}
     on:clear={() => dispatch('search', '')} />
    <!-- Filter -->
    {#if showFilter}
      <div style="margin-top: 1rem;">
        <Select
         labelText="TOPICS"
         selected=""
         on:change={updateFilter}>
          <SelectItem value="" text="All Topics" />
          {#each options as opt}
            <SelectItem value={opt} text={capitalize(opt)} />
          {/each}
        </Select>
      </div>
    {/if}
    <!-- Glossary Extra -->
    {#if showGlossaryInfo}
      <div style="margin-top: 2rem;">
        <p>
          For more climate adaptation terms visit the glossary on <a href="https://resilientca.org/">California Adaptation Clearinghouse</a>.
        </p>
      </div>
    {/if}
  </div>
{/if}





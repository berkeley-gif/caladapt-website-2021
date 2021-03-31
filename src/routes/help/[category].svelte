<script context="module">
  export async function preload({ params }) {
    const { category } = params;
    const res = await this.fetch(`help/${category}.json`);
    const json = await res.json();

    if (res.status === 200) {
      const { toc, data } = json;
      return { toc, data };
    } else {
      this.error(res.status, json.message);
    }
  }
</script>

<script>
  import Help32 from 'carbon-icons-svelte/lib/Help32';
  import Catalog32 from 'carbon-icons-svelte/lib/Catalog32';
  import User32 from 'carbon-icons-svelte/lib/User32';
  import Video32 from 'carbon-icons-svelte/lib/Video32';
  import NavBreadcrumb from '../../components/partials/NavBreadcrumb.svelte';
  import { stores } from '@sapper/app';
  import SidebarLeft from './_SidebarLeft.svelte';
  import SidebarRight from './_SidebarRight.svelte';
  import ItemsList from './_ItemsList.svelte';
  import ItemsAccordion from './_ItemsAccordion.svelte';
  import ItemDetail from './_ItemDetail.svelte';
  
  export let data;
  export let toc;

  const icons = {
    'get-started': User32,
    tutorials: Video32,
    faqs: Help32,
    glossary: Catalog32,
  };

  const { page } = stores();

  // Remove the first Welcome item
  const gettingStartedData = data.find(d => d.slug === 'get-started');
  const welcome = gettingStartedData.items[0];

  let slug;
  let activeCategory;
  let filteredItems;
  let filter = '';
  let searchStr = '';
  
  $: slug = $page.params.category;
  $: slug, updateItems();
  $: items = [
    { href: '/', text: 'Home' },
    { href: '/help/', text: 'Help' },
    { href: `/help/${activeCategory.slug}`, text: `${activeCategory.title}` },
  ];

  function updateItems() {
    activeCategory = data.find(d => d.slug === slug);
    filteredItems = activeCategory.items;
  }

  function filterItems() {
    filteredItems = activeCategory.items.filter(d => {
      let hasFilter = false;
      let hasSearchStr = false;
      if ((filter === '') || d.metadata.tags.includes(filter)) {
        hasFilter = true;
      }
      if ((searchStr === '') || itemMatchesTerms(d, searchStr)) {
        hasSearchStr = true;
      }
      if (hasSearchStr && hasFilter) {
        return true;
      }
      return false;
    });
  }

  function updateFilter(e) {
    filter = e.detail;
    filterItems();
  }

  function updateSearch(e) {
    searchStr = e.detail;
    filterItems();
  }

  function itemMatchesTerms(item, q) {
    const text = `${item.metadata.title} ${item.html}`.toLowerCase();
    if (text.indexOf(q) === -1) {
      return false;
    }
    return true;
  }
</script>

<style lang="scss">
  .header {
    color: #02484a;
    .lead {
      margin-top: 0;
    }
  }

  .icon-block {
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-circle {
      color: #cce4e4;
      background: #04797c;
    }
  }
</style>

<svelte:head>
  <title>Help</title>
</svelte:head>

<div class="page-grid page-grid--help">
  <aside class="sidebar">
    <SidebarLeft {toc} />
  </aside>

  <nav class="nav" style="padding:1rem 0 0;">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row">
        <div class="bx--col">
          {#if activeCategory}
            <NavBreadcrumb {items} />
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <div class="header">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row bg-teal-20" style="margin:0.5rem 0;">
        <div class="bx--col-lg-12">
          <h1>
            {activeCategory.title}
          </h1>
          <p class="lead">
            {activeCategory.text}
          </p>              
        </div>
        <div class="bx--col-lg-4 icon-block">
          <div class="icon-circle">
            <svelte:component this={icons[activeCategory.slug]} /> 
          </div>           
        </div>
      </div>
    </div>
  </div>

  <div class="content">
    <div class="bx--grid">
      <!-- Row -->
      {#if slug === 'get-started'}
        <!-- Display detail for first item list -->
        <ItemDetail item={welcome} />
      {:else if slug === 'glossary'}
        <!-- Display items as Accordion -->
        <ItemsAccordion items={filteredItems} />
      {:else}
        <!-- Display items as list -->
        <ItemsList items={filteredItems} />
      {/if}
    </div>
  </div>

  <div class="footer">
    <p class="feedback">Email support@cal-adapt.org with your feedback on this topic</p>
  </div>

  <aside class="sidebar-right">
    <SidebarRight on:search={updateSearch} on:filter={updateFilter} />
  </aside>
</div>




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
  import Help32 from "carbon-icons-svelte/lib/Help32";
  import Catalog32 from "carbon-icons-svelte/lib/Catalog32";
  import User32 from "carbon-icons-svelte/lib/User32";
  import Video32 from "carbon-icons-svelte/lib/Video32";
  import { merge } from "d3-array";
  import SidebarRight from "../../partials/SidebarRight.svelte";
  import { stores } from "@sapper/app";
  import SidebarLeft from "./_SidebarLeft.svelte";
  import ItemsList from "./_ItemsList.svelte";
  import ItemsAccordion from "./_ItemsAccordion.svelte";
  import GetStartedPage from "./_GetStartedPage.svelte";
  import SupportFooter from "./_SupportFooter.svelte";
  import NavBreadcrumbHelp from "./_NavBreadcrumbHelp.svelte";

  export let data;
  export let toc;

  const icons = {
    "get-started": User32,
    tutorials: Video32,
    faqs: Help32,
    glossary: Catalog32,
  };

  const { page } = stores();

  let filter = "";
  let searchStr = "";
  let display;

  function makeTopicList(tags) {
    const filtered = tags.filter((tag) => tag !== undefined);
    if (filtered.length > 0) {
      const unique = [...new Set(merge(filtered))];
      return unique;
    }
    return [];
  }

  $: slug = $page.params.category;
  $: activeCategory = toc.find((d) => d.slug === slug);
  $: filteredItems = data;
  $: topics = makeTopicList(data.map((d) => d.metadata.tags));
  $: items = [
    { href: "/", text: "Home" },
    { href: "/help/", text: "Help" },
    { href: `/help/${activeCategory.slug}`, text: `${activeCategory.title}` },
  ];
  $: if (
    activeCategory.slug === "tutorials" ||
    activeCategory.slug === "faqs"
  ) {
    display = ["search", "filters"];
  } else if (activeCategory.slug === "glossary") {
    display = ["search", "glossary"];
  } else {
    display = [];
  }

  function filterItems() {
    filteredItems = data.filter((d) => {
      let hasFilter = false;
      let hasSearchStr = false;
      if (filter === "" || d.metadata.tags.includes(filter)) {
        hasFilter = true;
      }
      if (searchStr === "" || itemMatchesTerms(d, searchStr)) {
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
    color: var(--teal-80);
    .lead {
      margin-top: 0;
    }
  }

  .icon-block {
    display: flex;
    align-items: center;
    justify-content: center;

    .icon-circle {
      color: var(--teal-10);
      background: var(--teal-60);
    }
  }
</style>

<svelte:head>
  <title>Help</title>
</svelte:head>

<div class="page-grid page-grid--help">
  <aside class="sidebar-left">
    <SidebarLeft toc="{toc}" />
  </aside>

  <NavBreadcrumbHelp {...{ items, activeCategory }} />

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
            <svelte:component this="{icons[activeCategory.slug]}" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="content {slug === 'get-started' ? 'content-extended' : ''}">
    <div class="bx--grid">
      <!-- Row -->
      {#if slug === "get-started"}
        <GetStartedPage />
      {:else if slug === "glossary"}
        <!-- Display items as Accordion -->
        <ItemsAccordion items="{filteredItems}" />
      {:else}
        <!-- Display items as list -->
        <ItemsList items="{filteredItems}" />
      {/if}
    </div>
  </div>

  <SupportFooter />

  <aside class="sidebar-right">
    <SidebarRight
      display="{display}"
      filters="{topics}"
      on:search="{updateSearch}"
      on:filter="{updateFilter}"
    />
  </aside>
</div>

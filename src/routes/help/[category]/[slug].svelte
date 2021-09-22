<script context="module">
  export async function preload({ params }) {
    const { category, slug } = params;
    const res = await this.fetch(`help/${category}/${slug}.json`);
    const json = await res.json();

    if (res.status === 200) {
      const { toc, item, getStartedData } = json;
      return { toc, item, getStartedData };
    } else {
      this.error(res.status, json.message);
    }
  }
</script>

<script>
  import { stores } from "@sapper/app";
  import { Row, Column } from "carbon-components-svelte";
  import SidebarLeft from "../_SidebarLeft.svelte";
  import ItemDetail from "../_ItemDetail.svelte";
  import SupportFooter from "../_SupportFooter.svelte";
  import ItemsPrevNextNav from "../_ItemsNavPrevNext.svelte";
  import NavBreadcrumbHelp from "../_NavBreadcrumbHelp.svelte";

  export let item;
  export let toc;
  export let getStartedData;

  const { page } = stores();

  let activeCategory;
  let subToc;
  let subTocIdx;
  let items = [];
  let prevArticle;
  let nextArticle;

  $: category = $page.params.category;
  $: category, updateItems(), getSubToc();
  $: subTocIdx =
    subToc && subToc.findIndex((d) => d.slug === $page.params.slug);
  $: subTocIdx, setPrevNext();
  $: items = [
    { href: "/", text: "Home" },
    { href: "/help/", text: "Help" },
    {
      href: `/help/${activeCategory.slug}`,
      text: `${activeCategory.title}`,
    },
    {
      href: "",
      text: `${item.metadata.title}`,
    },
  ];

  function updateItems() {
    activeCategory = toc.find((d) => d.slug === category);
  }

  function getSubToc() {
    if (
      activeCategory.slug === "get-started" &&
      getStartedData &&
      getStartedData.allTopics
    ) {
      subToc = getStartedData.allTopics;
    }
  }

  function setPrevNext() {
    if (!subToc) return;
    let prev = subToc[subTocIdx - 1];
    let next = subToc[subTocIdx + 1];
    prevArticle = prev
      ? { title: prev.title, href: `help/${category}/${prev.slug}` }
      : null;
    nextArticle = next
      ? { title: next.title, href: `help/${category}/${next.slug}` }
      : null;
  }
</script>

<style>
  :global(blockquote) {
    margin-top: -1rem;
  }
</style>

<svelte:head>
  <title>Help</title>
</svelte:head>

<div class="page-grid page-grid--help">
  <aside class="sidebar-left">
    <SidebarLeft toc="{toc}" subToc="{subToc}" />
  </aside>

  <NavBreadcrumbHelp {...{ items, activeCategory }} />

  <div class="header">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row">
        <div class="bx--col-lg-12">
          <h1>
            {item.metadata.title}
          </h1>
          {#if item.metadata.author}
            <p class="lead">
              By <a href="{item.metadata.link}">{item.metadata.author}</a>, {item
                .metadata.org}
            </p>
          {/if}
          <hr />
        </div>
      </div>
    </div>
  </div>

  <div class="content">
    <div class="bx--grid">
      <!-- Row -->
      <ItemDetail item="{item}" />
      <Row>
        <Column>
          <ItemsPrevNextNav prev="{prevArticle}" next="{nextArticle}" />
        </Column>
      </Row>
    </div>
  </div>

  <SupportFooter borderTop="{false}" />

  <aside class="sidebar-right"></aside>
</div>

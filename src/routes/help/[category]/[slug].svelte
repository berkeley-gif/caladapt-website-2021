<script context="module">
  export async function preload({ params }) {
    const { category, slug } = params;
    const res = await this.fetch(`help/${category}/${slug}.json`);
    const json = await res.json();

    if (res.status === 200) {
      const { toc, item } = json;
      return { toc, item };
    } else {
      this.error(res.status, json.message);
    }
  }
</script>

<script>
  import { stores } from '@sapper/app';
  import SidebarLeft from '../_SidebarLeft.svelte';
  import ItemDetail from '../_ItemDetail.svelte';
  import NavBreadcrumb from '../../../components/partials/NavBreadcrumb.svelte';
  
  export let item;
  export let toc;

  const { page } = stores();

  let category;
  let activeCategory;
  let items = [];
  
  $: category = $page.params.category;
  $: category, updateItems();
  $: items = [
    { href: '/', text: 'Home' },
    { href: '/help/', text: 'Help' },
    {
      href: `/help/${activeCategory.slug}`,
      text: `${activeCategory.title}`
    },
    {
      href: '',
      text: `${item.metadata.title}`
    },
  ];

  function updateItems() {
    activeCategory = toc.find(d => d.slug === category);
  }
</script>

<style>

</style>

<svelte:head>
  <title>Help</title>
</svelte:head>

<div class="page-grid page-grid--help">
  <aside class="sidebar">
    <SidebarLeft {toc} />
  </aside>

  <nav class="nav" style="padding:1rem 0 0;">
    <div class="bx--grid bx--grid--condensed">
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
      <div class="bx--row">
        <div class="bx--col-lg-12">
          <h1>
            {item.metadata.title}
          </h1>
          {#if item.metadata.author}
            <p class="lead">
              By <a href={item.metadata.link}>{item.metadata.author}</a>, {item.metadata.org}
            </p>
          {/if}
          <hr>             
        </div>
      </div>
    </div>
  </div>

  <div class="content">
    <div class="bx--grid">
      <!-- Row -->
      <ItemDetail {item} />
    </div>
  </div>

  <div class="footer">
    <p class="feedback">Email support@cal-adapt.org with your feedback on this topic</p>
  </div>

  <aside class="sidebar-right">
  </aside>
</div>

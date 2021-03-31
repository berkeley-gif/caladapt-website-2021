<script context="module">
  export function preload() {
    return this.fetch(`blog.json`)
      .then(r => r.json())
      .then(posts => {
        return { posts };
      });
  }
</script>

<script>
  import BlogArticle from '../../components/partials/BlogArticle.svelte';
  import SidebarRight from './_sidebarRight.svelte';
  export let posts;

  let filteredPosts = posts;
  let filter = '';
  let searchStr = '';

  function filterItems() {
    filteredPosts = posts.filter(d => {
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

<svelte:head>
  <title>Blog | Cal-Adapt</title>
</svelte:head>

<section class="banner bg-gray-100">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <h1>
          Cal-Adapt Blog
        </h1>
        <p class="lead">
          Read the latest Cal-Adapt news, updates &amp; events
        </p>
      </div>
    </div>
  </div>
</section>

<div class="page-grid page-grid--blog">

  <div class="content">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row">
        {#each filteredPosts as post}
        <div class="bx--col-lg-8" style="padding:2rem;">
          <BlogArticle {post} />
          </div>
        {/each}
      </div>
    </div>
  </div>

  <aside class="sidebar">
    <SidebarRight on:search={updateSearch} on:filter={updateFilter} />
  </aside>

  <div class="footer">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row">
        <div class="bx--col-lg-10" style="padding:2rem;">
          <p class="lead">
            Get the latest Cal-Adapt news, updates &amp; events delivered to your inbox. Subscribe to the Cal-Adapt Newsletter. 
          </p>      
          <a href="/signup/" class="bx--btn bx--btn--primary">
            Subscribe
          </a>
        </div>
      </div>
    </div>
  </div>

</div>
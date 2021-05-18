<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then(r => r.json())
      .then(posts => posts);
    const events = await this.fetch(`blog/events.json`)
      .then(r => r.json())
      .then(events => events);
    return { posts, events };
  }
</script>

<script>
  import BlogArticle from '../../components/partials/BlogArticle.svelte';
  import SidebarRight from '../../components/partials/SidebarRight.svelte';
  
  export let posts;
  export let events;

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
      <div class="bx--row">
        {#each filteredPosts as post}
        <div class="bx--col-lg-8" style="padding:2rem;">
          <BlogArticle {post} />
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="sidebar-right">
    <SidebarRight
      show={['events', 'search', 'filters']}
      filters={['data', 'tools', 'other']}
      {events}
      on:search={updateSearch}
      on:filter={updateFilter} />
  </div>

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
<script context="module">
  export async function preload({ query }) {
    const parts = [];
    Object.keys(query).forEach((key) => {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);
    });
    const res = await this.fetch(`blog/search.json?${parts}`);
    const posts = await res.json();

    if (res.status === 200) {
      return { posts, query };
    } else {
      this.error(res.status, posts.message);
    }
  }
</script>

<script>
  import PostStub from '../../components/partials/PostStub.svelte';

  export let posts;
  export let query;

  $: searchTerm = query.q;
  $: numPosts = posts.length;

  $: articles = posts.filter(d => d.metadata.category === 'articles');
  $: webinars = posts.filter(d => d.metadata.category === 'webinars');
  $: tutorials = posts.filter(d => d.metadata.category === 'tutorials');
</script>

<svelte:head>
  <title>Cal-Adapt Blog Search</title>
</svelte:head>

<nav class="bg-gray-200">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <!-- Breadcrumb -->
        <ol class="breadcrumb breadcrumb-scroll">
          <li class="breadcrumb-item">
            <a href="/" class="text-gray-700">
              Home
            </a>
          </li>
          <li class="breadcrumb-item">
            <a href="/blog" class="text-gray-700">
              Blog
            </a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Search
          </li>
        </ol>
      </div>
    </div> <!-- / .row -->
  </div> <!-- / .container -->
</nav>

<section class="pt-6 pt-md-9 pb-6 pb-md-10 container">
  <div class="row">
    <!-- Content -->
    <div class="col-md-9">
      <h1 class="display-4">
        Search Results
      </h1>
      <p class="font-size-lg text-gray-700">
        {numPosts} posts match your search terms <span class="text-info">{searchTerm}</span>
      </p>
      <hr class="my-4 my-md-6">
      {#if articles.length > 0}
        <h3 class="mt-4">{articles.length} Articles</h3>
        <ul class="list p-2">
          {#each articles as post}
            <li class="list-item d-flex">
              <a href="blog/{post.slug}/" class="flex-grow-1">
                {post.metadata.title}
              </a>
              <time datetime="{post.metadata.pubdate}">{post.metadata.datestring}</time>
            </li>
          {/each}
        </ul>
        <h3 class="mt-4">{webinars.length} Webinars</h3>
        <ul class="list p-2">
          {#each webinars as post}
            <li class="list-item d-flex">
              <a href="blog/{post.slug}/" class="flex-grow-1">
                {post.metadata.title}
              </a>
              <time datetime="{post.metadata.pubdate}">{post.metadata.datestring}</time>
            </li>
          {/each}
        </ul>
        <h3 class="mt-4">{tutorials.length} Tutorials</h3>
        <ul class="list p-2">
          {#each tutorials as post}
            <li class="list-item d-flex">
              <a href="blog/{post.slug}/" class="flex-grow-1">
                {post.metadata.title}
              </a>
              <time datetime="{post.metadata.pubdate}">{post.metadata.datestring}</time>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <!-- Sidebar -->
    <div class="col-md-3">
      <aside class="sidebar sticky-top">
        <!-- Filter Card -->
        <div class="card shadow-light-lg">
          <div class="card-body">
            <h5 class="mb-4">
              Search Blog Posts
            </h5>
            <form class="input-group" method="GET" action="/blog/search/">
              <input name="q" id="q" required type="text" class="form-control" placeholder="Search" aria-label="Search blog">
              <button type="submit" class="btn btn-primary">Search</button>
            </form>
          </div>
        </div> <!-- end Filter Card -->

        <!-- Help Card -->
        <div class="card shadow-light-lg mt-3">
          <div class="card-body">
            <h5 class="mb-4">
              Have a question?
            </h5>
            <h6 class="font-weight-bold text-uppercase text-gray-700 mb-1">
              Help
            </h6>
            <p class="font-size-sm">
              Explore our collection of <a href="/help">frequently asked questions</a> to learn more about using Cal-Adapt.
            </p>
            <h6 class="font-weight-bold text-uppercase text-gray-700 mb-1">
              Email us
            </h6>
            <p class="font-size-sm">
              <a href="mailto:support@cal-adapt.org" class="text-reset">support@cal-adapt.org</a>
            </p>
          </div>
        </div> <!-- end Help Card -->

        <!-- Newsletter Card -->
        <div class="card shadow-light-lg mt-3">
          <div class="card-body">
            <p class="font-size-sm">
              Keep up to date with new climate tools, data and resources on Cal-Adapt. Subscribe to the Cal-Adapt Newsletter.
            </p>
            <a href="/signup/" class="btn btn-primary">Subscribe</a>
          </div>
        </div> <!-- end Newsletter Card -->       

      </aside>
    </div>
  </div>
</section>

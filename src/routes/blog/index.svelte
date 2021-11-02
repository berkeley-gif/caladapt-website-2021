<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => posts);
    const events = await this.fetch(`events.json`)
      .then((r) => r.json())
      .then((events) => events);
    return { posts, events };
  }
</script>

<script>
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";

  import { Card, CardsContainer } from "~/components/cards";
  import { Banner, SidebarRight } from "~/partials";

  export let posts;
  export let events;

  const cardWidth = 22;
  const cardGap = 2;

  let filteredPosts = posts;
  let filter = "";
  let searchStr = "";

  function filterItems() {
    filteredPosts = posts.filter((d) => {
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

<svelte:head>
  <title>Blog | Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="Cal-Adapt Blog"
  subtitleText="Read the latest Cal-Adapt news, updates &amp; events."
  bgColor="var(--blue-70)"
  overlayColor="var(--gray-50)"
/>

<div class="page-grid page-grid--blog">
  <div class="content">
    <div class="bx--grid">
      <div class="bx--row">
        <CardsContainer gridGap="{cardGap}" cardWidth="{cardWidth}">
          {#each filteredPosts as { slug, metadata: { image, tags, title, pubdate, datestring, author, snippet } }}
            <Card
              {...{
                titleText: title,
                linkPath: `/blog/${slug}`,
                imgSrc: `img/blog/${image}`,
                description: snippet,
                ctaText: "View article",
                tags,
                pubDate: pubdate,
                pubDateStr: datestring,
                author,
              }}
            />
          {/each}
        </CardsContainer>
      </div>
    </div>
  </div>

  <div class="sidebar-right">
    <div class="is-sticky">
      <SidebarRight
        display="{['events', 'search', 'filters']}"
        filters="{['data', 'tools', 'other']}"
        events="{events}"
        on:search="{updateSearch}"
        on:filter="{updateFilter}"
      />
    </div>
  </div>

  <div class="footer">
    <div class="bx--grid">
      <div class="bx--row">
        <div class="bx--col">
          <p class="lead">
            Get the latest Cal-Adapt news, updates &amp; events delivered to
            your inbox. Subscribe to the Cal-Adapt Newsletter.
          </p>
          <Button icon="{ArrowRight16}" href="/signup">SUBSCRIBE</Button>
        </div>
      </div>
    </div>
  </div>
</div>

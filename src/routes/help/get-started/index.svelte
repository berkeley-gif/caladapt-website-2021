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

  .content-extended {
    grid-column: 2 / span 3;
  }

  .tiles-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    grid-gap: 1rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }
</style>

<svelte:head>
  <title>Getting Started | Cal Adapt</title>
</svelte:head>

<div class="page-grid page-grid--help">
  <aside class="sidebar-left">
    <SidebarLeft toc="{toc}" />
  </aside>

  <nav class="nav" style="padding:1rem 0 0;">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row">
        <div class="bx--col">
          <NavBreadcrumb items="{breadcrumbItems}" />
        </div>
      </div>
    </div>
  </nav>

  <div class="header">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row bg-teal-20" style="margin:0.5rem 0;">
        <div class="bx--col-lg-12">
          <h1>Getting Started</h1>
          <p class="lead">
            Explore the following topics to learn how to get started with Cal
            Adapt.
          </p>
        </div>
        <div class="bx--col-lg-4 icon-block">
          <div class="icon-circle">
            <svelte:component this={iconGetStarted} />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="content content-extended">
    <div class="bx--grid">
      <ul class="tiles-list">
        {#each topics as topic}
          <TopicTile {topic} />
        {/each}
      </ul>
    </div>
  </div>

  <SupportFooter />
</div>

<script context="module">
  export async function preload({ params }) {
    const res = await this.fetch(`help/get-started.json`);
    const json = await res.json();
    if (res.status === 200) {
      const { toc, topics } = json;
      return { toc, topics };
    } else {
      this.error(res.status, json.message);
    }
  }
</script>

<script>
  import { stores } from "@sapper/app";

  import SidebarLeft from "../_SidebarLeft.svelte";
  import SupportFooter from "../_SupportFooter.svelte";
  import TopicTile from "../_TopicTile.svelte";
  import NavBreadcrumb from "../../../partials/NavBreadcrumb.svelte";
  import { CATEGORY_ICONS } from "../_icons";

  export let toc;
  export let topics;

  const breadcrumbItems = [
    { href: "/", text: "Home" },
    { href: "/help/", text: "Help" },
    { href: "/help/get-started", text: "Get Started" },
  ];
  const iconGetStarted = CATEGORY_ICONS['get-started'];

  const { page } = stores();
</script>

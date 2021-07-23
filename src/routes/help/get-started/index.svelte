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

  .tiles-container {
    display: flex;
    flex-wrap: wrap;
  }

  .tile-wrapper {
    display: block;
    position: relative;
    width: 225px;
    margin: 1rem;
  }

  .tile-anchor {
    text-decoration: none;
    color: var(--gray-100);

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }
  }

  .tile--content {
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  h2,
  p {
    color: var(--gray-100);

    &.tile--title:hover,
    &.tile--description:hover {
      text-decoration: none;
    }

    &.tile--title {
      font-size: 1.125rem;
      font-weight: bold;
    }

    &.tile--description {
      font-size: 1rem;
    }

    &.learn-more {
      margin: 0;
    }
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
            <svelte:component this="{CATEGORY_ICONS['get-started']}" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="content content-extended">
    <div class="bx--grid">
      <ul class="tiles-list tiles-container">
        {#each topics as topic}
          <li class="tile-wrapper lift shadow">
            <Tile>
              <div class="tile--content">
                <h2 class="tile--title">
                  <a class="tile-anchor" href="help/get-started/{topic.slug}"
                    >{topic.title}</a
                  >
                </h2>
                <p class="tile--description">{topic.text}</p>
                <Button kind="ghost" aria-hidden class="learn-more"
                  >Learn more</Button
                >
              </div>
            </Tile>
          </li>
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
  import { Tile } from "carbon-components-svelte";
  import { Button } from "carbon-components-svelte";

  import SidebarLeft from "../_SidebarLeft.svelte";
  import SupportFooter from "../_SupportFooter.svelte";
  import NavBreadcrumb from "../../../partials/NavBreadcrumb.svelte";
  import { CATEGORY_ICONS } from "../_icons";

  export let toc;
  export let topics;

  let breadcrumbItems = [
    { href: "/", text: "Home" },
    { href: "/help/", text: "Help" },
    { href: "/help/get-started", text: "Get Started" },
  ];

  const { page } = stores();
</script>

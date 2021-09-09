<script>
  import { stores } from "@sapper/app";
  import { createEventDispatcher } from "svelte";
  import { Search, Select, SelectItem } from "carbon-components-svelte";

  export let display = ["events", "posts"];
  export let events = [];
  export let posts = [];
  export let filters = [];
  export let anchors = [];

  const { page } = stores();

  const dispatch = createEventDispatcher();

  let upcomingEvents;
  $: if (events && events.length > 0) {
    upcomingEvents = events.filter(
      (d) => new Date(d.metadata.eventdate) >= new Date()
    );
  }

  function updateSearch(e) {
    dispatch("search", e.target.value);
  }

  function updateFilter(e) {
    dispatch("filter", e.detail);
  }

  const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
</script>

<style lang="scss">
  .sidebar-block {
    &:not(:first-of-type) {
      margin-top: 4rem;
    }

    @media (max-width: 1000px) {
      margin-top: 3rem;
    }
  }

  .sidebar-block-link {
    display: block;
    padding-top: 1.5rem;
    text-transform: uppercase;
    font-size: 0.85rem;
  }

  .sidebar-block-title {
    margin: 0;
  }

  .sidebar-filter,
  .sidebar-search {
    margin-top: 0.5rem;
  }

  ul.page-anchor-links-list {
    list-style: none;
  }
</style>

{#if display.includes("events") && upcomingEvents.length > 0}
  <!-- Events -->
  <div class="sidebar-block">
    <p class="sidebar-block-title h5">Upcoming Events</p>
    <ul class="sidebar-block-list list-items">
      {#each upcomingEvents as event}
        <li class="item">
          <p class="item-title">
            <a href="{`events/${event.slug}`}">{event.metadata.title}</a>
          </p>
          <p class="item-text">{event.metadata.eventdatestring}</p>
          <p class="item-text">
            {event.metadata.location}, {event.metadata.time}
          </p>
        </li>
      {/each}
    </ul>
    <span class="sidebar-block-link">
      <a href="/events">See All Events</a>
    </span>
  </div>
{/if}

{#if display.includes("posts")}
  <!-- Posts -->
  <div class="sidebar-block">
    <p class="sidebar-block-title h5">Latest on Cal-Adapt Blog</p>
    <ul class="sidebar-block-list list-items">
      {#each posts as post}
        <li class="item">
          <p class="item-title">
            <a href="{`blog/${post.slug}`}">{post.metadata.title}</a>
          </p>
          <p class="item-text">{post.metadata.snippet}</p>
        </li>
      {/each}
    </ul>
    <span class="sidebar-block-link">
      <a href="/blog">See All Posts</a>
    </span>
  </div>
{/if}

{#if display.includes("search")}
  <!-- Search -->
  <div class="sidebar-block">
    <p class="sidebar-block-title h5">Search</p>
    <div class="sidebar-search">
      <Search
        style="padding-left: 1.5rem;"
        type="search"
        on:change="{updateSearch}"
        on:clear="{() => dispatch('search', '')}"
      />
    </div>
  </div>
{/if}

{#if display.includes("filters")}
  <!-- Search -->
  <div class="sidebar-block">
    <p class="sidebar-block-title h5">Filters</p>
    <div class="sidebar-filter">
      <Select
        hideLabel
        labelText="Select Topics"
        selected=""
        on:change="{updateFilter}"
      >
        <SelectItem value="" text="All Topics" />
        {#each filters as opt}
          <SelectItem value="{opt}" text="{capitalize(opt)}" />
        {/each}
      </Select>
    </div>
  </div>
{/if}

{#if display.includes("glossary")}
  <!-- Glossary Link -->
  <div class="sidebar-block">
    <p class="item-text">
      For more climate adaptation terms visit the glossary on <a
        href="https://resilientca.org/">California Adaptation Clearinghouse</a
      >.
    </p>
  </div>
{/if}

{#if display.includes("page-anchor-links") && anchors.length}
  <div class="sidebar-block">
    <ul class="page-anchor-links-list">
      {#each anchors as anchor}
        <li><a href="{$page.path}#{anchor.href}">{anchor.text}</a></li>
      {/each}
    </ul>
  </div>
{/if}

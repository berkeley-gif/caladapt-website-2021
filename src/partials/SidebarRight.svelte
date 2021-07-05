<script>
  import { createEventDispatcher } from 'svelte';
  import { Search, Select, SelectItem } from "carbon-components-svelte";

  export let display = ['events', 'posts'];
  export let events = [];
  export let posts = [];
  export let filters = [];

  const dispatch = createEventDispatcher();
  let upcomingEvents;
  $: if (events && events.length > 0) {
    const today = new Date();
    upcomingEvents = events.filter(d => new Date(d.metadata.eventdate) >= today);
  } 

  function updateSearch(e) {
    dispatch('search', e.target.value);
  }

  function updateFilter(e) {
    dispatch('filter', e.detail);
  }

  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
</script>

<style>
</style>

{#if display.includes('events') && upcomingEvents.length > 0}
  <!-- Events -->
  <div class="sidebar-block">
    <h5 class="sidebar-block-title">Upcoming Events</h5>
    <ul class="sidebar-block-list list-items">
      {#each upcomingEvents as event}
        <li class="item">
          <p class="item-title">
            <a href={`blog/events/${event.slug}`}>{event.metadata.title}</a>
          </p>
          <p class="item-text">{event.metadata.eventdatestring}</p>
          <p class="item-text">{event.metadata.location}, {event.metadata.time}</p>
        </li>
      {/each}
    </ul>
    <span class="sidebar-block-link">
      <a href="/blog/events">See All Events</a>
    </span>
  </div>
{/if}

{#if display.includes('posts')}
  <!-- Posts -->
  <div class="sidebar-block">
    <h5 class="sidebar-block-title">Latest on Cal-Adapt Blog</h5>
    <ul class="sidebar-block-list list-items">
      {#each posts as post}
        <li class="item">
          <p class="item-title">
            <a href={`blog/${post.slug}`}>{post.metadata.title}</a>
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

{#if display.includes('search')}
  <!-- Search -->
  <div class="sidebar-block">
    <h5 class="sidebar-block-title">Search</h5>
    <div class="sidebar-search">
      <Search
       style="padding-left: 1.5rem;"
       on:change={updateSearch}
       on:clear={() => dispatch('search', '')} />        
    </div>
  </div>
{/if}

{#if display.includes('filters')}
  <!-- Search -->
  <div class="sidebar-block">
    <h5 class="sidebar-block-title">Filters</h5>
    <div class="sidebar-filter">
      <Select
        hideLabel
        labelText="Select Topics"
        selected=""
        on:change={updateFilter}>
        <SelectItem value="" text="All Topics" />
        {#each filters as opt}
          <SelectItem value={opt} text={capitalize(opt)} />
        {/each}
      </Select>
    </div>
  </div>
{/if}

{#if display.includes('glossary')}
  <!-- Glossary Link -->
  <div class="sidebar-block">
    <p class="item-text">
      For more climate adaptation terms visit the glossary on <a href="https://resilientca.org/">California Adaptation Clearinghouse</a>.
    </p>
  </div>
{/if}
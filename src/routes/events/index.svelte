<script context="module">
  export function preload() {
    return this.fetch("events.json")
      .then((r) => r.json())
      .then((events) => ({ events }))
      .catch((error) => {
        console.error(error);
      });
  }
</script>

<script>
  import EventListItem from "./_EventListItem.svelte";

  export let events;

  $: upcomingEvents = events.filter(
    (d) => +new Date(d.metadata.eventdate) >= +new Date()
  );
  $: pastEvents = events.filter(
    (d) => +new Date(d.metadata.eventdate) < +new Date()
  );
</script>

<style>
  .banner {
    background-color: var(--gray-80);
    padding: var(--spacing-48) var(--spacing-16);
  }

  .rule {
    height: 1px;
    background-color: var(--gray-30);
    margin: 2rem 0;
  }
</style>

<svelte:head>
  <title>Events | Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<div class="bleed banner overlay">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
        <h1>Events at Cal-Adapt</h1>
        <p class="lead">
          View information on and register for upcoming webinars and workshops
          hosted by Cal-Adapt and its partners.
        </p>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>
  </div>
</div>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <h2>Upcoming Events</h2>
      <p>Register for upcoming webinars and workshops hosted by Cal-Adapt.</p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  <!-- Upcoming Events / empty state -->
  {#if Array.isArray(upcomingEvents) && upcomingEvents.length}
    {#each upcomingEvents as event}
      <EventListItem {...{ event, isFuture: true }} />
    {/each}
  {:else}
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
        <p>
          No events are currently scheduled. Please check back later or
          <a href="/signup/">subscribe to our newsletter</a> to be notified when
          future events are announced.
        </p>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>
  {/if}

  <!-- Rule -->
  <div class="bx--row">
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <div class="rule"></div>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  <!-- Past events list / pagination -->
  <div class="bx--row">
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <h2>Past Events</h2>
      <p>
        View previously recorded webinars and workshops hosted by Cal-Adapt
        below.
      </p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  {#if Array.isArray(pastEvents) && pastEvents.length}
    {#each pastEvents as event}
      <EventListItem {...{ event }} />
    {/each}
  {/if}
</div>

<div class="spacing--v-96"></div>

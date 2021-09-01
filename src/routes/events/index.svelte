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
    margin: 3rem 0;
  }

  h2 {
    margin-top: 0;
  }

  p.description {
    margin-bottom: 2rem;
    font-size: 1.25rem;
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

<div class="spacing--v-32"></div>

<!-- Upcoming events title -->
<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <h2>Upcoming Events</h2>
      <p class="description">
        Register for upcoming webinars and workshops hosted by Cal-Adapt.
      </p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  <!-- Upcoming events list / empty state -->
  {#if Array.isArray(upcomingEvents) && upcomingEvents.length}
    <div role="list">
      {#each upcomingEvents as event}
        <EventListItem {...{ event, isFutureEvent: true }} />
      {/each}
    </div>
  {:else}
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
        <p class="description">
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
      <p class="description">
        View previously recorded webinars and workshops hosted by Cal-Adapt
        below.
      </p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  {#if Array.isArray(pastEvents) && pastEvents.length}
    <div role="list">
      {#each pastEvents as event}
        <EventListItem {...{ event }} />
      {/each}
    </div>
  {/if}
</div>

<div class="spacing--v-96"></div>

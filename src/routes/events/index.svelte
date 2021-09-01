<script context="module">
  export function preload() {
    return this.fetch(`events.json`)
      .then((r) => r.json())
      .then((events) => ({ events }))
      .catch((error) => {
        console.error(error);
      });
  }
</script>

<script>
  import { Button } from "carbon-components-svelte";

  export let events;
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
          hosted by Cal-Adapt and its partners. You may also <a
            href="/help/tutorials">view recordings of past events.</a
          >
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
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  {#if Array.isArray(events) && events.length}
    {#each events as { metadata: { title, time, eventdatestring, tags } }}
      <div class="bx--row">
        <div class="bx--col-lg-2"></div>
        <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
          <h3>{title}</h3>
          <p>{eventdatestring}</p>
          <p>{time}</p>
          <Button kind="tertiary">Register</Button>
        </div>
        <div class="bx--col-lg-5"></div>
      </div>
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

  <div class="bx--row">
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <div class="rule"></div>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  <div class="bx--row">
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <h2>Past Events</h2>
      <p>
        To view recordings of past events, vist the <a href="/help/tutorials/"
          >Tutorials and Webinars help page</a
        >.
      </p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>
</div>

<div class="spacing--v-96"></div>

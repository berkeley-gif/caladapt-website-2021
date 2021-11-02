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
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import EventListItem from "./_EventListItem.svelte";
  import { Banner } from "~/partials";

  export let events;

  $: upcomingEvents = events.filter(
    (d) => +new Date(d.metadata.eventdate) >= +new Date()
  );
  $: pastEvents = events.filter(
    (d) => +new Date(d.metadata.eventdate) < +new Date()
  );
</script>

<style>
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

  p.lead {
    font-size: 1.25rem;
  }
</style>

<svelte:head>
  <title>Events | Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="Events at Cal-Adapt"
  subtitleText="View information on and register for upcoming webinars and 
    workshops hosted by Cal-Adapt and its partners."
  bgColor="var(--teal-80)"
  overlayColor="var(--gray-90)"
/>

<div class="spacing--v-32"></div>

<!-- Upcoming events title -->
<div class="bx--grid">
  <div class="bx--row">
    <!-- 2 lg column spacer -->
    <div class="bx--col-lg-2"></div>

    <!-- middle content column -->
    <div class="bx--col-lg-8 bx--col-md-8 bx--col-sm-4">
      <!-- displays only on breakpoints smaller than desktop -->
      <div class="bx--row">
        <div class="bx--col-lg-0 bx--col">
          <p class="lead">
            Get the latest Cal-Adapt news, updates &amp; events delivered to
            your inbox. Subscribe to the Cal-Adapt Newsletter.
          </p>
          <Button
            icon="{ArrowRight16}"
            href="/signup"
            size="small"
            aria-label="Newsletter subscription form">Subscribe</Button
          >
          <div class="spacing--v-32"></div>
        </div>
      </div>

      <div class="bx--row">
        <div class="bx--col">
          <h2>Upcoming Events</h2>
          <p class="description">
            Register for upcoming webinars and workshops hosted by Cal-Adapt.
          </p>
        </div>
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
          <div class="bx--col">
            <p class="description">
              No events are currently scheduled. Please check back later or
              <a sapper:prefetch href="/signup/">subscribe to our newsletter</a>
              to be notified when future events are announced.
            </p>
          </div>
        </div>
      {/if}

      <!-- Rule -->
      <div class="bx--row">
        <div class="bx--col">
          <div class="rule"></div>
        </div>
      </div>

      <!-- Past events title -->
      <div class="bx--row">
        <div class="bx--col">
          <h2>Past Events</h2>
          <p class="description">
            View previously recorded webinars and workshops hosted by Cal-Adapt
            below.
          </p>
        </div>
      </div>

      {#if Array.isArray(pastEvents) && pastEvents.length}
        <div role="list">
          {#each pastEvents as event}
            <EventListItem {...{ event }} />
          {/each}
        </div>
      {/if}
    </div>
    <!-- end middle lg column -->

    <!-- right sidebar offset by 1 lg col -->
    <div class="bx--offset-lg-1 bx--col-lg-4 bx--col-md-0 bx--col-sm-0">
      <p class="lead">
        Get the latest Cal-Adapt news, updates &amp; events delivered to your
        inbox. Subscribe to the Cal-Adapt Newsletter.
      </p>
      <Button
        icon="{ArrowRight16}"
        href="/signup"
        size="field"
        aria-label="Newsletter subscription form">Subscribe</Button
      >
    </div>
  </div>

  <!-- 1 lg column right spacer -->
  <div class="bx--col-lg-1"></div>
</div>
<!-- end bx--grid -->

<div class="spacing--v-96"></div>

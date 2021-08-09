<script context="module">
  export function preload() {
    return this.fetch(`blog/events.json`)
      .then((r) => r.json())
      .then((events) => {
        return { events };
      });
  }
</script>

<script>
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import SidebarRight from "../../partials/SidebarRight.svelte";
  import NavBreadcrumb from "../../partials/NavBreadcrumb.svelte";
  import EventStub from "../../partials/EventStub.svelte";

  export let events;

  $: items = [
    { href: "/", text: "Home" },
    { href: "/blog/", text: "Blog" },
    { href: "/blog/events", text: `Events` },
  ];

  const currentDate = new Date();
  $: upcomingEvents = events.filter(
    (d) => new Date(d.metadata.eventdate) >= currentDate
  );
  $: pastEvents = events.filter(
    (d) => new Date(d.metadata.eventdate) < currentDate
  );
</script>

<style lang="scss">
</style>

<svelte:head>
  <title>Events | Cal-Adapt</title>
</svelte:head>

<div class="banner-breadcrumbs">
  <NavBreadcrumb items="{items}" />
</div>

<section class="banner bg-teal-20">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <h1 class="text-gray-100">Cal-Adapt Events</h1>
      </div>
    </div>
  </div>
</section>

<div class="page-grid page-grid--blog">
  <div class="content">
    <div class="bx--grid">
      <div class="bx--row">
        <div class="bx--col">
          <h2>Upcoming Events</h2>
        </div>
      </div>
      <div class="bx--row">
        {#if upcomingEvents && upcomingEvents.length > 0}
          {#each upcomingEvents as event}
            <div class="bx--col-lg-8" style="padding:2rem;">
              <EventStub event="{event}" />
            </div>
          {/each}
        {:else}
          <div class="bx--col">
            <p>No upcoming events.</p>
          </div>
        {/if}
      </div>
      <!-- Row -->
      <div class="bx--row">
        <div class="bx--col">
          <hr />
          <h3>Past Events</h3>
          <ul class="list-items">
            {#each pastEvents as event}
              <li class="item">
                <p class="item-title">
                  <a href="{`blog/events/${event.slug}`}"
                    >{event.metadata.title}</a
                  >
                </p>
                <p class="item-text">{event.metadata.eventdatestring}</p>
                <p class="item-text">
                  {event.metadata.location}, {event.metadata.time}
                </p>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="sidebar-right">
    <div class="is-sticky">
      <SidebarRight display="{['posts']}" />
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

<script context="module">
  export function preload() {
    return this.fetch(`blog/events.json`)
      .then(r => r.json())
      .then(events => {
        return { events };
      });
  }
</script>

<script>
  export let events;

  const currentDate = new Date();
  $: upcomingEvents = events.filter(d => new Date(d.metadata.eventdate) >= currentDate);
  $: pastEvents =  events.filter(d => new Date(d.metadata.eventdate) < currentDate);
</script>

<svelte:head>
  <title>Events | Cal-Adapt</title>
</svelte:head>

<section class="banner bg-teal-20">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <h1 class="text-gray-100">
          Cal-Adapt Events
        </h1>
      </div>
    </div>
  </div>
</section>

<div class="page-grid page-grid--blog">

  <div class="content">
    <div class="bx--grid">
      <!-- Row -->
      <div class="bx--row">
        <div class="bx--offset-lg-1 bx--col-lg-12">
          <h2>Upcoming Events</h2>
          {#if upcomingEvents && upcomingEvents.length > 0}
            <ul class="list-event">
              {#each upcomingEvents as event}
                <li class="list-event-item">
                  <div class="event-date">
                    <span class="month">{event.metadata.month}</span>
                    <span class="date">{event.metadata.dayNumber}</span>
                    <span class="day">{event.metadata.dayName}</span>
                  </div>
                  <div class="event-details">
                    <p class="title">
                      <a href={`blog/events/${event.slug}`} >{event.metadata.title}</a>
                    </p>
                    <p class="location">{event.metadata.location}</p>
                    <p class="time">1:00 PM - 2:00 PM PST</p>
                  </div>
                </li>
              {/each}
            </ul>
          {:else}
            <p>No events found.</p>
          {/if}
          <hr />
        </div>
      </div>
      <!-- Row -->
      <div class="bx--row">
        <div class="bx--offset-lg-1 bx--col-lg-12">
          <h3 style="margin-top:0;">Past Events</h3>
          <ul class="list-event">
            {#each pastEvents as event}
              <li class="list-event-item">
                <div class="event-details">
                  <p class="title">
                    <a href={`blog/events/${event.slug}`}>{event.metadata.title}</a>
                  </p>
                  <p>{event.metadata.eventdatestring}</p>
                  <p class="location">{event.metadata.location}</p>
                  <p class="time">1:00 PM - 2:00 PM PST</p>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>

  <aside class="sidebar">
    <div class="is-sticky">
      <!-- Help -->
      <h6>More on Cal-Adapt</h6>
      <div style="margin-top: 1rem;">
        <ul>
          <li>
            <a href="/blog/">Cal-Adapt Blog</a>
          </li>
          <li>
            <a href="/help/faqs/">Frequently Asked Questions</a>
          </li>
          <li>
            <a href="/help/tutorials/">Tutorials & Webinars</a>
          </li>
        </ul>
      </div>
      <!-- Subscribe -->
      <h6 style="margin-top: 2rem;">Stay in Touch</h6>
      <div style="margin-top: 1rem;">
        <p>
          Get the latest Cal-Adapt news, updates &amp; events delivered to your inbox. Subscribe to the Cal-Adapt Newsletter. 
        </p>      
        <a href="/signup/" class="bx--btn bx--btn--primary">Subscrbe</a>
      </div>
    </div>
  </aside>
</div>
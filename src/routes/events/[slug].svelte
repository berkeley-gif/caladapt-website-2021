<script context="module">
  export async function preload({ params }) {
    try {
      const res = await this.fetch(`events/${params.slug}.json`);

      if (res.status === 200) {
        return { event: await res.json() };
      } else {
        this.error(res.status, res.message);
      }
    } catch (error) {
      this.error(404, error.message);
    }
  }
</script>

<script>
  import NavBreadcrumb from "~/partials/NavBreadcrumb.svelte";
  import { TweetButton } from "~/components/social-media";

  export let event;

  $: items = [
    { href: "/", text: "Home" },
    { href: "/events/", text: "Events" },
    {
      href: "",
      text: `${event.metadata.title}`,
    },
  ];

  $: eventType =
    Array.isArray(event.metadata.tags) && event.metadata.tags.length
      ? event.metadata.tags[0]
      : "";
  $: tweetText = `I'm attending the ${eventType} ${event.metadata.title} on ${event.metadata.eventdatestring}`;
  $: tweetTags = [
    ...event.metadata.tags,
    "caladapt",
    "climatechange",
    "california",
  ];
</script>

<style lang="scss">
  .banner {
    background-position: center;
    background-size: cover;
  }

  .social {
    display: flex;
    align-items: center;
    font-size: 1rem;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .share {
    display: flex;
    justify-content: space-between;
  }

  .content {
    margin-top: 2rem;

    :global(> :first-child) {
      margin-top: 0;
    }

    :global(p),
    :global(li) {
      font-size: 1.125rem;
      max-width: 65ch;
    }

    :global(li) {
      line-height: calc(1.75 * 1.125rem);
    }
  }
</style>

<svelte:head>
  <title>{event.metadata.title}</title>
</svelte:head>

<div class="banner-breadcrumbs">
  <NavBreadcrumb items="{items}" />
</div>

<!-- Banner -->
<div
  class="banner overlay overlay-gradient-gray-blue overlay-60 bleed"
  style="background-image: url(/img/blog/webinar.jpg);"
>
  <div class="bx--grid bx--grid--narrow">
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9">
        <h1>{event.metadata.title}</h1>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>
  </div>
</div>

<div class="event">
  <div class="bx--grid">
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9 metadata">
        <p><time class="lead time" datetime> </time></p>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>

    <!-- Row -->
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9 content">
        {@html event.html}
      </div>
      <div class="bx--col-lg-5"></div>
    </div>

    <!-- Row -->
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9">
        <hr />
        <div class="share">
          <div class="social">
            <p>Interested in this event? Share it:</p>
            <ul class="list-social">
              <li>
                <TweetButton
                  text="{tweetText}"
                  hashtags="{tweetTags}"
                  url="{typeof window !== 'undefined'
                    ? window.location.href
                    : ''}"
                />
              </li>
            </ul>
          </div>
          <div class="back">
            <p><a href="/events/">Back to All Events</a></p>
          </div>
        </div>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>
  </div>
</div>

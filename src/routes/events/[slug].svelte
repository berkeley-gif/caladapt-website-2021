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

  const past = +new Date(event.metadata.eventdate) < +new Date();

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
      : "event";
  $: leadText = past ? "Checkout the" : "I'm attending the";
  $: dateText = past ? "" : `on ${event.metadata.eventdatestring}`;
  $: tweetText = `${leadText} ${eventType} "${event.metadata.title}" ${dateText}\n`;
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
    padding: 3rem 0;
  }

  .content {
    margin-top: 2rem;

    :global(:first-child) {
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

  .social-back {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .back {
    p {
      margin-bottom: 0;
    }
  }

  .social {
    display: flex;
    align-items: center;
    font-size: 1rem;
    gap: 0.5rem;
  }
</style>

<svelte:head>
  <title>{event.metadata.title}</title>
</svelte:head>

<div class="banner-breadcrumbs">
  <NavBreadcrumb items="{items}" />
</div>

<!-- Banner -->
<div class="banner overlay overlay-gradient-gray-blue overlay-80 bleed">
  <div class="bx--grid">
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
        <div class="social-back">
          <div class="social">
            <ul class="list-social">
              <li>
                <TweetButton
                  linkText="Share on Twitter"
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
            <p><a sapper:prefetch href="/events/">Back to All Events</a></p>
          </div>
        </div>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>
  </div>
</div>

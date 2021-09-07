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
  import LogoTwitter32 from "carbon-icons-svelte/lib/LogoTwitter32";
  export let event;

  $: items = [
    { href: "/", text: "Home" },
    { href: "/events/", text: "Events" },
    {
      href: "",
      text: `${event.metadata.title}`,
    },
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
  }

  .share {
    display: flex;
    justify-content: space-between;
  }

  .content {
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
            <span style="margin-bottom:0.75rem;"
              >Interested in this event? Share it.</span
            >
            <ul class="list-social">
              <li>
                <a
                  href="https://twitter.com/cal_adapt"
                  aria-label="Cal-Adapt Twitter profile"
                >
                  <LogoTwitter32 />
                </a>
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

<script context="module">
  export async function preload({ params }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte
    const res = await this.fetch(`blog/events/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { event: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import NavBreadcrumb from '../../../partials/NavBreadcrumb.svelte';
  import LogoTwitter32 from 'carbon-icons-svelte/lib/LogoTwitter32';
  import Email32 from 'carbon-icons-svelte/lib/Email32';
  export let event;

  $: items = [
    { href: '/', text: 'Home' },
    { href: '/blog/', text: 'Blog' },
    { href: '/blog/events/', text: 'Events' },
    {
      href: '',
      text: `${event.metadata.title}`
    },
  ];
</script>

<style lang="scss">
  .banner {
    background-position: center;
    background-size: cover;
    min-height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .event {
    padding: 2rem 0;
  }

  .content {
    padding: 1rem;
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
</style>

<svelte:head>
  <title>{event.metadata.title}</title>
</svelte:head>

<div class="banner-breadcrumbs">
  <NavBreadcrumb {items} />
</div>

<!-- Banner -->
<section class="banner overlay overlay-gradient-gray-blue overlay-60" style="background-image: url(/img/blog/webinar.jpg);">
  <div class="bx--grid">
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--col">
        <h1>{event.metadata.title}</h1>
      </div>
    </div>
  </div>    
</section>

<div class="event">
  <div class="bx--grid">
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--offset-lg-3 bx--col-lg-10 metadata">
        <p><time class="lead time" datetime>
          
        </time></p>
      </div>
    </div>
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--offset-lg-3 bx--col-lg-10 content">
        {@html event.html}
      </div>
    </div>
    <!-- Row -->
    <div class="bx--row">
      <div class="bx--offset-lg-3 bx--col-lg-10">
        <hr/>
        <div class="share">
          <div class="social">
            <span style="margin-bottom:0.75rem;">Interested in this event? Share it.</span>
            <ul class="list-social">
              <li>
                <a href="https://twitter.com/cal_adapt" title="Twitter">
                  <LogoTwitter32 />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/cal_adapt" title="Twitter">
                  <Email32 />
                </a>
              </li>
            </ul>
          </div>
          <div class="back">
            <p><a href="/blog/">Back to Cal-Adapt Blog</a></p>
          </div>          
        </div>
      </div>
    </div>
  </div>
</div>


















<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => posts);
    const events = await this.fetch(`events.json`)
      .then((r) => r.json())
      .then((events) => events);
    const data = await this.fetch("index.json")
      .then((r) => r.json())
      .then((data) => data);
    return {
      posts,
      events,
      cardsData: data.cardsData,
    };
  }
</script>

<script>
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import { Card, CardsContainer } from "~/components/cards";
  import { Banner, SidebarRight } from "~/partials";
  import { AlertLink } from "~/components/alert-link";

  import InformationFilled32 from "carbon-icons-svelte/lib/InformationFilled32";

  export let events;
  export let posts;
  export let cardsData;

  const icons = [
    "sun",
    "rainfall",
    "wildfire",
    "snowflake",
    "sea",
    "streamflow",
  ].map((name) => `img/icons/${name}.svg`);
  const cardHeight = 18;
  const cardWidth = 18;
</script>

<style lang="scss">
  @import "scss/site/mixins/media-queries";

  .btn-container {
    margin-top: 2.5rem;
    text-transform: uppercase;
  }

  // The following code creates a grid that has 1/3 and 2/3 column template
  .one-two-column-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    grid-gap: 2rem;
    padding: 0;
    margin: 0;
  }

  .ae-logo-box {
    padding: 14px;

    img {
      display: block;
      margin: auto;
    }
  }

  .ae-logo-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-items: flex-start;
    grid-column: span 2;
  }

  .ae-logo-text {
    @include media("<=1329px") {
      grid-column: span 1;
    }
  }

  .cta-card {
    @include media("<=medium") {
      margin-top: 24px;
    }
  }

  .grants-cta {
    padding: 80px 0 80px 0;
  }
</style>

<svelte:head>
  <title>Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<Banner
  titleText="Explore and analyze climate data from California’s Climate Change Assessments"
  subtitleText="Cal-Adapt provides the public, researchers, government agencies and industry stakeholders with essential data & tools for climate adaptation planning, building resiliency, and fostering community engagement."
  bannerImg="/img/banners/yosemite_1600x540.jpg"
  bannerImgMobile="/img/banners/yosemite_700x800.jpg"
  overlayOpacity="{0.4}"
  titleFontSize="2rem"
  titleFontWeight="600"
  iconPaths="{icons}"
  useOffset="{false}"
>
  <!--   <div class="btn-container" slot="button">
    <Button icon="{ArrowRight16}" href="/about" sapper:prefetch
      >More about Cal-Adapt</Button
    >
  </div> -->
  <div class="cta-card" slot="cta-card">
    <Card
      {...{
        titleText: "Cal-Adapt is evolving!",
        linkPath: `/blog/expanded-caladapt-enterprise`,
        description:
          "Learn about the Cal-Adapt enterprise and our mission to support California's climate change initiatives and preview our future plans.",
        height: 18,
        ctaText: "Read More",
        bgColor: "rgba(255,255,255,0.5)",
        border: "none",
      }}
    >
      <div class="icon-circle bg-teal-60" slot="icon_slot">
        <svelte:component this="{InformationFilled32}" />
      </div>
    </Card>
  </div>
</Banner>

<div class="spacing--v-32"></div>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col-lg-12 bx--col-md-8 bx--col-sm-4">
      <!-- Fifth Assessment Notification -->
      <AlertLink
        titleText="Looking for climate data for California's Fifth Climate Change Assessment?"
        linkUrl="/blog/climate-data-access"
        linkTitle="blog post on accessing next generation climate data"
      />

      <!-- Fourth Assessment Block -->
      <h2>Explore interactive maps and charts</h2>
      <p class="lg-width">
        Visualize and download <strong>downscaled CMIP5 climate data</strong>
        and other datasets developed for California’s
        <a href="https://climateassessment.ca.gov/" target="_blank"
          >Fourth Climate Change Assessment.</a
        >
        Read our <a href="/help/get-started" target="_blank">Get Started</a> guide
        to learn more about working with climate data.
      </p>
      <p class="lg-width">
        Designed for a <strong>broad range of users.</strong>
      </p>

      <CardsContainer gridGap="{2}" cardWidth="{cardWidth}">
        {#each cardsData as cardDatum, index}
          <Card
            {...{
              ...cardDatum,
              height: cardHeight,
              ctaText: "Learn More",
              textColor: "white",
              useRule: true,
            }}
          />
        {/each}
      </CardsContainer>

      <!-- Analytics / Fifth Assessment Block -->
      <div class="spacing--v-24"></div>
      <h2>Analyze next generation climate data</h2>
      <div class="one-two-column-grid">
        <div class="bg-gradient-analytics-engine ae-logo-box shadow">
          <img width="90%" src="img/logos/cae_logo_white.png" alt="" />
        </div>
        <div class="ae-logo-text">
          <p class="lg-width">
            The <a href="https://analytics.cal-adapt.org/" target="_blank"
              >Cal-Adapt Analytics Engine</a
            >
            is a <strong>climate data platform</strong> developed for
            California's
            <a
              href="https://opr.ca.gov/climate/icarp/climate-assessment/"
              target="_blank">Fifth Climate Change Assessment</a
            >.
          </p>
          <p class="lg-width">
            Use cloud computing resources to access <strong
              >downscaled CMIP6 climate data</strong
            >
            and analytics <strong>co-produced</strong> by stakeholders, policy makers,
            scientists and developers.
          </p>
          <p class="lg-width">
            Built for users with <strong>prior computing</strong> experience and
            <strong>data intensive needs.</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Sidebar on desktop only -->
    <div class="bx--col-lg-4 bx--col-md-0 bx--col-sm-0">
      <SidebarRight
        display="{['events', 'posts']}"
        events="{events}"
        posts="{[posts[0]]}"
      />
    </div>
  </div>
</div>

<div class="bx--grid bx--grid--full-width" style="padding: 0;">
  <!-- Grants block -->
  <div class="spacing--v-48"></div>
  <div
    class="grants-cta bx--grid--full-width"
    style="background-color: var(--gray-30);"
  >
    <div class="bx--grid">
      <div class="bx--row">
        <div class="bx--col-lg-12">
          <h3>
            Discover how our <a href="/grants" target="_blank"
              >data development grants and research projects</a
            >
            are helping to shape the next generation of Cal-Adapt
          </h3>
        </div>
        <div class="bx--col-lg-4"></div>
      </div>
    </div>
  </div>
</div>

<div class="bx--grid">
  <!-- Newsletter -->
  <div class="bx--row">
    <div class="bx--col">
      <div class="spacing--v-24"></div>
      <p class="lead">
        Get the latest Cal-Adapt news, updates &amp; events delivered to your
        inbox. Subscribe to the Cal-Adapt Newsletter.
      </p>
      <div class="btn-container">
        <Button icon="{ArrowRight16}" href="/signup/#cal-adapt-newsletter"
          >Subscribe</Button
        >
      </div>
    </div>
  </div>
</div>

<div class="spacing--v-96"></div>

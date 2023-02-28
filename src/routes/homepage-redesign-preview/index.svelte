<script context="module">
  // This is a temporary variable. We can get rid of it once the landing page changes have been finalized and approved
  const cardsDataTemp = [
    {
      titleText: "Local Climate Change Snapshot Tool",
      linkPath: "/tools/local-climate-change-snapshot",
      description:
        "Quickly view a variety of climate data for a city, county, or other place.",
      bgColor: "var(--card-gradient-02)",
    },
    {
      titleText: "Explore all Climate Tools",
      linkPath: "/tools",
      description:
        "Explore data on temperature, precipitation, snowpack, wildfire, and more.",
      bgColor: "var(--card-gradient-03)",
    },
    {
      titleText: "Download Data",
      linkPath: "/data",
      description:
        "Download Fourth Assessment climate data in NetCDF, GeoTIFF and CSV formats.",
      bgColor: "var(--card-gradient-03)",
    },
  ];

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
      cardsData: cardsDataTemp,
      revealNewHomepage: data.revealNewHomepage,
    };
  }
</script>

<script>
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import { Card, CardsContainer } from "~/components/cards";
  import { Banner, SidebarRight } from "~/partials";
  import { InlineNotification } from "carbon-components-svelte";
  import InformationFilled32 from "carbon-icons-svelte/lib/InformationFilled32";

  export let events;
  export let posts;
  export let cardsData;
  export let revealNewHomepage;

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

  .alert :global(.bx--inline-notification) {
    margin: 0;
    max-width: 100%;
    background: $teal-10;

    &::before {
      border: none;
    }
  }

  .alert :global(.bx--inline-notification__text-wrapper) {
    flex-direction: column;
  }

  .bx--inline-notification__subtitle {
    margin-bottom: 0;
  }

  .btn-container {
    margin-top: 2.5rem;
    text-transform: uppercase;
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

    @include media("<=medium") {
      padding-top: 24px;
    }
  }

  .cta-card {
    @include media(">large") {
      float: right;
    }

    @include media("<=medium") {
      margin-top: 24px;
    }
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
        linkPath: `/help/`,
        description:
          "Learn about the Cal-Adapt enterprise and our mission to support California's climate change initiatives and preview our future plans.",
        height: 18,
        ctaText: "Read More",
      }}
    >
      <div class="icon-circle bg-teal-60" slot="icon_slot">
        <svelte:component this="{InformationFilled32}" fill="red" />
      </div>
    </Card>
  </div>
</Banner>

<div class="spacing--v-32"></div>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col-lg-12 bx--col-md-8 bx--col-sm-4">
      <!-- Fifth Assessment Notification -->
      <div class="alert">
        <InlineNotification
          lowContrast
          hideCloseButton
          kind="info"
          title="Looking for climate data for California's Fifth Climate Change Assessment?"
        >
          <p class="bx--inline-notification__subtitle">
            Visit the <a href="/data">Cal-Adapt Analytics Engine</a>
          </p>
        </InlineNotification>
      </div>

      <!-- Fourth Assessment Block -->
      <h2>Explore interactive maps and charts</h2>
      <div class="spacing--v-24"></div>
      <p class="full-width">
        Visualize and download <strong>downscaled CMIP5 climate data</strong>
        and other datasets developed for California’s
        <a href="/blog/slr-cis-tool" target="_blank"
          >Fourth Climate Change Assessment.</a
        >
        Read our <a href="/get-started" target="_blank">Get Started</a> guide to
        learn more about working with climate data.
      </p>
      <p class="full-width">
        Designed for a <strong>broad range of users.</strong>
      </p>
      <div class="spacing--v-24"></div>
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
      <div class="spacing--v-24"></div>

      <div class="bx--grid">
        <div class="bx--row">
          <div
            class="bx--col-lg-4 bg-gradient-analytics-engine ae-logo-box lift"
          >
            <img width="90%" src="img/logos/cae_logo_white.png" alt="" />
          </div>
          <div class="bx--col-lg-12 ae-logo-text">
            <p class="full-width">
              A climate data platform developed for California's Fifth Climate
              Change Assessment.
            </p>
            <p class="full-width">
              Use cloud computing resources to access <strong
                >downscaled CMIP6 climate data</strong
              >
              and analytics <strong>co-produced</strong> by stakeholders, policy
              makers, scientists and developers.
            </p>
            <p class="full-width">
              Built for users with <strong>prior computing</strong> experience
              and <strong>data intensive needs.</strong>
            </p>
          </div>
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

  <div class="bx--row">
    <div class="bx--col">
      <div class="spacing--v-48"></div>
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

<!-- <script>
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Banner, SidebarRight } from "~/partials";
  import { Card, CardsContainer } from "~/components/cards";

  const dummyLink = "/homepage-redesign-preview/#";

  const cardsData = [
    {
      titleText: "Tools, How to Guide, & Data Download",
      linkPath: "/",
      description: `Access climate data via visualizations, downloads, and
        the Cal-Adapt API for your research, outreach, and adaptation planning
        needs.`,
      bgColor:
        "linear-gradient(180deg, #0F9699 0%, #0F9982 0.01%, #035466 100%)",
      ctaText: "Learn More",
    },
    {
      titleText: "Cal-Adapt: Analytics Engine",
      linkPath: "https://analytics.cal-adapt.org",
      description: `Utilize cloud storage and computation to analyze Petabytes
        of stored data supported by scientific guidance.`,
      bgColor: "linear-gradient(180deg, #248DB3 0%, #096180 100%)",
      ctaText: "Visit Site",
    },
    {
      titleText: "Data Development Grants",
      linkPath: dummyLink,
      description: "Description forthcoming.",
      bgColor: "linear-gradient(180deg, #19953E 0%, #196B5B 100%)",
      ctaText: "Learn More",
    },
  ];
  const cardHeight = 20;
  const cardWidth = 18;

  const updateLinksPlaceholders = [
    {
      title: "Update number one",
      linkPath: dummyLink,
    },
    {
      title: "Update number two",
      linkPath: dummyLink,
    },
    {
      title: "Update number three",
      linkPath: dummyLink,
    },
  ];
</script>

<svelte:head>
  <title>Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="Cal-Adapt provides public access to climate data that contribute to
    California’s Climate Change Assessments."
  subtitleText="Cal-Adapt provides interactive, easy-to-use visualization and
    data download tools for a broad range of stakeholders; a “pro” version for
    users with highly technical, data-intensive needs; and links to state-funded
    grants that support development of data for Cal-Adapt."
  titleFontSize="2rem"
  titleFontWeight="600"
  useOffset="{false}"
  bannerImg="linear-gradient(180deg, #003850 0%, #067C74 100%)"
  overlayOpacity="0"
/>

<div class="spacing--v-32"></div>

<Grid>
  <Row>
    <Column lg="{{ span: 12 }}">
      <CardsContainer gridGap="{2}" cardWidth="{cardWidth}">
        {#each cardsData as card}
          <Card
            {...{
              ...card,
              height: cardHeight,
              useRule: true,
              textColor: "var(--white)",
            }}
          />
        {/each}
      </CardsContainer>
    </Column>

    <Column lg="{{ span: 3, offset: 1 }}">
      <h2 class="h4">Latest Updates</h2>
      <p>
        Learn more about the latest changes and improvements to Cal-Adapt on our
        blog.
      </p>
      <ul style="margin-left: 1rem">
        {#each updateLinksPlaceholders as { title, linkPath }}
          <li><a href="{linkPath}">{title}</a></li>
        {/each}
      </ul>
    </Column>
  </Row>
</Grid>

<div class="spacing--v-96"></div>
 -->
<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => posts);
    const events = await this.fetch(`events.json`)
      .then((r) => r.json())
      .then((events) => events);
    const data = await this.fetch("indexV2.json")
      .then((r) => r.json())
      .then((data) => data);
    return {
      posts,
      events,
      cardsData: data.cardsData,
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
</style>

<svelte:head>
  <title>Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<Banner
  titleText="Cal-Adapt provides a way to explore peer-reviewed data that 
    portrays how climate change might affect California at the state and local
    levels."
  subtitleText="We make this data available through downloads, visualizations, 
    and the Cal-Adapt API for your research, outreach, and adaptation planning
    needs."
  bannerImg="/img/banners/yosemite_1600x540.jpg"
  bannerImgMobile="/img/banners/yosemite_700x800.jpg"
  overlayOpacity="{0.4}"
  titleFontSize="2rem"
  titleFontWeight="600"
  iconPaths="{icons}"
  useOffset="{false}"
>
  <div class="btn-container" slot="button">
    <Button icon="{ArrowRight16}" href="/about" sapper:prefetch
      >More about Cal-Adapt</Button
    >
  </div>
</Banner>

<div class="spacing--v-32"></div>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col-lg-12 bx--col-md-8 bx--col-sm-4">
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
              ctaText: "Learn more",
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

  <!-- TODO: remove this before deploying to production -->
  {#if revealNewHomepage}
    <div class="bx--row">
      <div class="bx--col">
        <div class="spacing--v-48"></div>
        <p>
          View the <a rel="external" href="/homepage-redesign-preview/"
            >new homepage design.</a
          >
        </p>
      </div>
    </div>
  {/if}
</div>

<div class="spacing--v-96"></div>

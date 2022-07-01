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
      revealNewHomepage: data.revealNewHomepage,
    };
  }
</script>

<script>
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import { Card, CardsContainer } from "~/components/cards";
  import { Banner, SidebarRight } from "~/partials";

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
  .btn-container {
    margin-top: 2.5rem;
    text-transform: uppercase;
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

<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => posts);
    const events = await this.fetch(`events.json`)
      .then((r) => r.json())
      .then((events) => events);
    const cardsData = await this.fetch("index.json")
      .then((r) => r.json())
      .then((cards) => cards);
    return { posts, events, cardsData };
  }
</script>

<script>
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";

  import { Card, CardsContainer } from "~/components/cards";
  import { Banner, SidebarRight } from "~/partials";
  import Sun from "static/img/icons/sun.svg";
  import Rainfall from "static/img/icons/rainfall.svg";
  import Wildfire from "static/img/icons/wildfire.svg";
  import Snowflake from "static/img/icons/snowflake.svg";
  import Sea from "static/img/icons/sea.svg";
  import Streamflow from "static/img/icons/streamflow.svg";

  export let events;
  export let posts;
  export let cardsData;

  const icons = [Sun, Rainfall, Wildfire, Snowflake, Sea, Streamflow];
  const cardHeight = 18;
  const cardWidth = 18;
</script>

<style lang="scss">
  .banner--icons {
    gap: 0.25rem;
    position: relative;
  }

  .btn-container {
    margin-top: 2.5rem;
    text-transform: uppercase;
  }

  .footer {
    margin-top: 2rem;

    @media (max-width: 1000px) {
      margin-top: 1rem;
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
  overlayOpacity="{0.6}"
  titleFontSize="2rem"
  titleFontWeight="400"
>
  <div
    class="bx--row bx--offset-lg-2 banner--icons"
    aria-hidden="true"
    slot="icons"
  >
    {#each icons as icon}
      <div class="bx--col-1">
        <div class="icon">{@html icon}</div>
      </div>
    {/each}
  </div>

  <div class="btn-container" slot="button">
    <Button icon="{ArrowRight16}" href="/about" sapper:prefetch
      >More about Cal-Adapt</Button
    >
  </div>
</Banner>

<section class="page-grid page-grid--home">
  <div class="content">
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

  <div class="sidebar-right">
    <SidebarRight
      display="{['events', 'posts']}"
      events="{events}"
      posts="{[posts[0]]}"
    />
  </div>

  <div class="footer">
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
</section>

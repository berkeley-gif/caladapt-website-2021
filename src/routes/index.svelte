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
  import { onMount } from "svelte";
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";

  import { Card, CardsContainer } from "~/components/cards";
  import SidebarRight from "../partials/SidebarRight.svelte";
  import Sun from "../../static/img/icons/sun.svg";
  import Rainfall from "../../static/img/icons/rainfall.svg";
  import Wildfire from "../../static/img/icons/wildfire.svg";
  import Snowflake from "../../static/img/icons/snowflake.svg";
  import Sea from "../../static/img/icons/sea.svg";
  import Streamflow from "../../static/img/icons/streamflow.svg";

  export let events;
  export let posts;
  export let cardsData;

  const icons = [Sun, Rainfall, Wildfire, Snowflake, Sea, Streamflow];
  const cardHeight = 18;
  const cardWidth = 18;
  $: cardBgColors = [];

  onMount(() => {
    const styles = getComputedStyle(document.documentElement);
    cardBgColors = [
      styles.getPropertyValue("--card-bg-color-02"),
      styles.getPropertyValue("--card-bg-color-01"),
      styles.getPropertyValue("--card-bg-color-03"),
      styles.getPropertyValue("--card-bg-color-03"),
      styles.getPropertyValue("--card-bg-color-01"),
      styles.getPropertyValue("--card-bg-color-02"),
    ];
  });
</script>

<style lang="scss">
  .banner--icons {
    padding: 0.5rem 1rem;
    gap: 0.25rem;
  }

  .banner--content {
    > * + * {
      margin-top: 2rem;
    }

    h1 {
      font-size: 2rem;
    }
  }

  .btn-container {
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
<section
  class="bleed banner overlay overlay-black overlay-60"
  style="background-image: url(/img/banners/yosemite_2000w.jpg);background-size:cover;"
>
  <div class="bx--grid">
    <div class="bx--row banner--icons">
      {#each icons as icon}
        <div class="bx--col-1">
          <a href="/tools">
            <div class="icon">{@html icon}</div>
          </a>
        </div>
      {/each}
    </div>

    <div class="bx--row">
      <div class="bx--col-lg-10 bx--col-md-8 banner--content">
        <h1>
          Cal-Adapt provides a means of exploring peer-reviewed data portraying
          how climate change might affect California at the state and local
          level.
        </h1>

        <p class="lead">
          We make this data available through downloads, visualizations, and the
          Cal-Adapt API for your research, outreach, and adaptation planning
          needs.
        </p>

        <div class="btn-container">
          <Button icon="{ArrowRight16}" href="/about"
            >More about Cal-Adapt</Button
          >
        </div>
      </div>
    </div>
  </div>
</section>

<section class="page-grid page-grid--home">
  <div class="content">
    {#if cardBgColors.length}
      <CardsContainer gridGap="{2}" cardWidth="{cardWidth}">
        {#each cardsData as cardDatum, index}
          <Card
            {...{
              ...cardDatum,
              height: cardHeight,
              ctaText: "Learn more",
              textColor: "white",
              bgColor: cardBgColors[index],
              useRule: true,
            }}
          />
        {/each}
      </CardsContainer>
    {/if}
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
      <Button icon="{ArrowRight16}" href="/signup">Subscribe</Button>
    </div>
  </div>
</section>

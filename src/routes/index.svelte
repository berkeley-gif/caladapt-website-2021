<script context="module">
  export async function preload() {
    const posts = await this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => posts);
    const events = await this.fetch(`blog/events.json`)
      .then((r) => r.json())
      .then((events) => events);
    return { posts, events };
  }
</script>

<script>
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";

  import { Card, CardContainer } from "~/components/cards";
  import SidebarRight from "../partials/SidebarRight.svelte";
  import Sun from "../../static/img/icons/sun.svg";
  import Rainfall from "../../static/img/icons/rainfall.svg";
  import Wildfire from "../../static/img/icons/wildfire.svg";
  import Snowflake from "../../static/img/icons/snowflake.svg";
  import Sea from "../../static/img/icons/sea.svg";
  import Streamflow from "../../static/img/icons/streamflow.svg";

  export let events;
  export let posts;

  const icons = [Sun, Rainfall, Wildfire, Snowflake, Sea, Streamflow];
  const cardHeight = 18;
  const cardWidth = 16;
  const cardData = [
    {
      titleText: "New to Cal Adapt?",
      linkPath: "/help/get-started",
      description:
        "Learn how to get started with using climate data for California.",
    },
    {
      titleText: "Local Climate Change Snapshot Tool",
      linkPath: "/tools/local-climate-change-snapshot",
      description:
        "Quickly view a variety of climate data for a city, county, or other place.",
    },
    {
      titleText: "Explore all Climate Tools",
      linkPath: "/tools",
      description:
        "Explore data on temperature, precipitation, snowpack, wildfire, and more.",
    },
    {
      titleText: "Download Data",
      linkPath: "/data",
      description:
        "Download climate data in NetCDF, CSV and GeoTIFF formats for your area.",
    },
    {
      titleText: "Tutorials & Webinars",
      linkPath: "/help/tutorials",
      description:
        "Browse our video collection of tool tutorials and past webinars.",
    },
    {
      titleText: "Developers",
      linkPath: "/developer",
      description:
        "Integrate climate data in your workflows with the Cal-Adapt API.",
    },
  ];
</script>

<svelte:head>
  <title>Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<section
  class="banner overlay overlay-black overlay-40"
  style="background-image: url(/img/banners/yosemite_2000w.jpg);background-size:cover;"
>
  <div class="bx--grid">
    <div class="bx--row" style="padding: 0.5rem 1rem;">
      {#each icons as icon}
        <div class="bx--col-1">
          <a href="/tools">
            <div class="icon">{@html icon}</div>
          </a>
        </div>
      {/each}
    </div>

    <div class="bx--row">
      <div class="bx--col-md-16 bx--col-lg-12">
        <h1 style="font-size:2rem;">
          Cal-Adapt provides a means of exploring peer-reviewed data portraying
          how climate change might affect California at the state and local
          level.
        </h1>

        <p class="lead">
          We make this data available through downloads, visualizations, and the
          Cal-Adapt API for your research, outreach, and adaptation planning
          needs.
        </p>

        <Button icon="{ArrowRight16}" href="/about"
          >LEARN MORE ABOUT CAL-ADAPT</Button
        >
      </div>
    </div>
  </div>
</section>

<section class="page-grid page-grid--home">
  <div class="content">
    <CardContainer gridGap="{2}" cardWidth="{cardWidth}">
      {#each cardData as cardDatum}
        <Card card="{{ ...cardDatum, height: cardHeight }}" />
      {/each}
    </CardContainer>
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
    <Button icon="{ArrowRight16}" href="/signup">SUBSCRIBE</Button>
  </div>
</section>

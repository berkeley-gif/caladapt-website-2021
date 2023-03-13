<script context="module">
  export function preload() {
    return this.fetch(`help.json`)
      .then((r) => r.json())
      .then((categories) => {
        return { categories };
      });
  }
</script>

<script>
  import Help32 from "carbon-icons-svelte/lib/Help32";
  import Catalog32 from "carbon-icons-svelte/lib/Catalog32";
  import User32 from "carbon-icons-svelte/lib/User32";
  import Video32 from "carbon-icons-svelte/lib/Video32";
  import { Card, CardsContainer } from "~/components/cards";
  import { Banner, AlertLink } from "~/partials";

  export let categories;

  const subtitleText = [
    `If you're brand new to Cal-Adapt or working with California’s Fourth Climate Change Assessment data we recommend visiting our Get Started articles. `,
    `We also have tutorials and webinars that demonstrate how to use our tools.`,
  ];
  const icons = {
    "get-started": User32,
    tutorials: Video32,
    faqs: Help32,
    glossary: Catalog32,
  };

  const cardWidth = 16;
  const cardHeight = 16;
  const cardGap = 2;
</script>

<style lang="scss">
  @import "scss/site/mixins/media-queries";

  .help-footer {
    .h4 {
      margin-bottom: 0.5rem;
    }
    > div:nth-child(2) {
      text-align: right;
    }

    @include mq-custom-1000px {
      > div:nth-child(2) {
        text-align: left;
      }
    }
  }
</style>

<svelte:head>
  <title>Help | Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="How can we help?"
  subtitleText="{subtitleText}"
  bannerImg="/img/banners/help_1500x400.jpg"
  bannerImgMobile="/img/banners/help_500x500.jpg"
  overlayOpacity="{0.7}"
/>

<div class="spacing--v-48"></div>

<div class="bx--grid">
  <div class="bx--row margin--v-32">
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9">
      <!-- Fifth Assessment Notification -->
      <AlertLink
        titleText="Looking for climate data for California's Fifth Climate Change Assessment?"
        linkUrl="/blog/climate-data-access"
        linkTitle="blog post on accessing next generation climate data"
      />
    </div>
    <div class="bx--col-lg-5"></div>
  </div>
</div>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col-lg-12 bx--offset-lg-2">
      <CardsContainer cardWidth="{cardWidth}" gridGap="{cardGap}">
        {#each categories as { slug, title, text }}
          <Card
            {...{
              titleText: title,
              linkPath: `/help/${slug}`,
              description: text,
              height: cardHeight,
            }}
          >
            <div class="icon-circle bg-teal-60 text-white" slot="icon_slot">
              <svelte:component this="{icons[slug]}" />
            </div>
          </Card>
        {/each}
      </CardsContainer>
    </div>
  </div>

  <div class="spacing--v-32"></div>

  <div class="bx--row">
    <div class="bx--col-lg-12 bx--offset-lg-2">
      <hr />
    </div>
  </div>

  <div class="spacing--v-16"></div>

  <div class="bx--row help-footer">
    <div class="bx--offset-lg-2 bx--col-lg-6 bx--col-md-4">
      <p class="h4">Didn't find what you were looking for?</p>
      <p>
        Email us at <a href="mailto:support@cal-adapt.org"
          >support@cal-adapt.org</a
        >.
      </p>
    </div>
    <div class="bx--col-lg-6 bx--col-md-4">
      <p class="h4">Looking for developer documentation?</p>
      <p>
        Read <a
          href="https://berkeley-gif.github.io/caladapt-docs/"
          target="_blank">Cal-Adapt API Documentation</a
        >.
      </p>
    </div>
  </div>
</div>

<div class="spacing--v-96"></div>

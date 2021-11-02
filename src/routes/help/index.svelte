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
  import { Banner } from "~/partials";

  export let categories;

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
  .help-footer {
    h4 {
      margin-bottom: 0.5rem;
    }
    > div:nth-child(2) {
      text-align: right;
    }

    @media (max-width: 1000px) {
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
  subtitleText="If you're brand new to Cal-Adapt we recommend visiting our 
    Getting Started articles. We also have tutorials and webinars that demonstrate 
    how to use our tools."
  bannerImg="/img/banners/help_1500x400.jpg"
  bannerImgMobile="/img/banners/help_500x500.jpg"
  overlayColor="black"
/>

<section>
  <div class="bx--grid">
    <div class="bx--row" style="max-width: 72rem; margin: 0 auto">
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
  <div class="bx--row">
    <div class="bx--col">
      <hr />
    </div>
  </div>
  <div class="bx--row help-footer">
    <div class="bx--col-lg-8 bx--col-md-4">
      <h4>Didn't find what you were looking for?</h4>
      <p>
        Email us at <a href="mailto:support@cal-adapt.org"
          >support@cal-adapt.org</a
        >.
      </p>
    </div>
    <div class="bx--col-lg-8 bx--col-md-4">
      <h4>Looking for developer documentation?</h4>
      <p>
        Read <a
          href="https://berkeley-gif.github.io/caladapt-docs/"
          target="_blank">Cal-Adapt API Documentation</a
        >.
      </p>
    </div>
  </div>
</section>

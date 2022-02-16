<script context="module">
  export async function preload() {
    const { categories, tools } = await this.fetch(`tools.json`)
      .then((r) => r.json())
      .then((data) => data);

    return { tools, categories };
  }
</script>

<script>
  import { Card, CardsContainer } from "~/components/cards";
  import { Banner, FilterCategories } from "~/partials";

  export let categories;
  export let tools;

  const cardHeight = 20;
  const cardWidth = 18;

  $: toolsByCategory = tools;
  let seletedCategory;

  function getToolsByCategory(e) {
    seletedCategory = e.detail.category;
    if (seletedCategory === "All") {
      toolsByCategory = tools;
    } else {
      toolsByCategory = tools.filter((d) =>
        d.categories.includes(seletedCategory)
      );
    }
  }
</script>

<svelte:head>
  <title>Tools | Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="Climate Tools"
  subtitleText="{`New to climate data? Start with the <a
    href="/tools/local-climate-change-snapshot/">
    Local Climate Change Snapshot Tool</a
    >`}"
  bannerImg="/img/banners/classSubSample.jpg"
  overlayOpacity="{0.7}"
  useOffset="{false}"
/>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col">
      <FilterCategories
        categories="{categories}"
        on:change="{getToolsByCategory}"
      />
    </div>
  </div>
  <div class="bx--row">
    <div class="bx--col">
      <CardsContainer gridGap="{2}" cardWidth="{cardWidth}">
        {#each toolsByCategory as { icons, title, desc, slug, version3 }}
          <Card
            {...{
              titleText: title,
              description: desc,
              height: cardHeight,
              linkPath: `/tools/${slug}`,
              iconPaths: icons,
              ctaText: "Explore",
            }}
          />
        {/each}
      </CardsContainer>
    </div>
  </div>
</div>

<div class="spacing--v-96"></div>

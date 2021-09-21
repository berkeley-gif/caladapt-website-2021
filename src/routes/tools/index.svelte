<script context="module">
  export async function preload() {
    const data = await this.fetch(`tools.json`)
      .then((r) => r.json())
      .then((data) => data);

    return { data };
  }
</script>

<script>
  import { Card, CardsContainer } from "~/components/cards";
  import FilterCategories from "../../partials/FilterCategories.svelte";

  export let data;

  const { categories, tools } = data;
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

<style>
  .banner {
    background-image: url(/img/banners/classSubSample.jpg);
    background-position: center;
    background-size: cover;
    min-height: 250px;
  }
</style>

<svelte:head>
  <title>Tools | Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<section class="banner overlay overlay-black overlay-40">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <h1>Climate Tools</h1>
        <p class="lead">
          New to climate data? Start with the <a
            href="/tools/local-climate-change-snapshot/"
          >
            Local Climate Change Snapshot Tool</a
          >
        </p>
      </div>
    </div>
  </div>
</section>

<section>
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
      <CardsContainer gridGap="{2}" cardWidth="{cardWidth}">
        {#each toolsByCategory as { icons, title, desc, slug, version3 }}
          <Card
            {...{
              titleText: title,
              description: desc,
              height: cardHeight,
              linkPath: version3
                ? `/tools/${slug}`
                : `https://v2.cal-adapt.org/tools/${slug}`,
              iconPaths: icons,
              ctaText: "Explore",
            }}
          />
        {/each}
      </CardsContainer>
    </div>
  </div>
</section>

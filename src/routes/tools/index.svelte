<script>
  import { fade } from "svelte/transition";
  import { categories, tools } from "../../../content/tools/data";

  import FilterCategories from "../../partials/FilterCategories.svelte";

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
      {#each toolsByCategory as opt}
        <div class="bx--col-lg-4" style="padding:1rem;">
          <div transition:fade class="card shadow lift">
            <div class="card-body">
              <div>
                {#each opt.icons as icon}
                  <img
                    src="{icon}"
                    alt="icon"
                    class="icon"
                    style="width:60px;"
                  />
                {/each}
              </div>
              <h3>
                {opt.title}
              </h3>
              <p>
                {opt.desc}
              </p>
              <a
                class="stretched-link"
                href="/tools/{opt.slug}/"
                title="Explore »"
              >
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

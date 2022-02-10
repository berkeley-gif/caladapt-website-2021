<script context="module">
  import { TOOL_SLUG } from "./_constants";
  export async function preload() {
    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const tool = toolsList.find((d) => d.slug === TOOL_SLUG);

    const { categories, indicators } = await (
      await this.fetch("tools/local-climate-change-snapshot.json")
    ).json();

    return {
      tool,
      categories,
      indicators,
    };
  }
</script>

<script>
  import { Loading } from "carbon-components-svelte";

  // Components
  import ExploreData from "./_ExploreData.svelte";

  export let tool;
  export let categories;
  export let indicators;

  let appReady = true;
</script>

<svelte:head>
  <title>{tool.title}</title>
</svelte:head>

<div id="explore-data">
  {#if appReady}
    <ExploreData categories="{categories}" indicators="{indicators}" />
  {:else}
    <Loading />
  {/if}
</div>

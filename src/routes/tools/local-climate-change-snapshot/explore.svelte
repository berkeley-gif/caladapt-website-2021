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

    const { CLIMATE_CATEGORIES, CLIMATE_INDICATORS } = await (
      await this.fetch("tools/local-climate-change-snapshot.json")
    ).json();

    return {
      tool,
      CLIMATE_CATEGORIES,
      CLIMATE_INDICATORS,
    };
  }
</script>

<script>
  export let tool;
  export let CLIMATE_CATEGORIES;
  export let CLIMATE_INDICATORS;
</script>

<svelte:head>
  <title>{tool.title}</title>
</svelte:head>

<!-- placeholder div to add height -->
<div id="explore"></div>

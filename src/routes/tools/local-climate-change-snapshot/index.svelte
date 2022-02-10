<script context="module">
  import { TOOL_SLUG } from "./_constants";
  export async function preload({ query }) {
    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const tool = toolsList.find((d) => d.slug === TOOL_SLUG);

    const { toolIntro, CLIMATE_CATEGORIES, CLIMATE_INDICATORS } = await (
      await this.fetch("tools/local-climate-change-snapshot.json")
    ).json();

    return {
      tool,
      toolIntro,
      CLIMATE_CATEGORIES,
      CLIMATE_INDICATORS,
    };
  }
</script>

<script>
  import { InlineNotification } from "carbon-components-svelte";
  import { Header } from "~/components/tools/Partials";

  export let tool;
  export let toolIntro;
  export let CLIMATE_CATEGORIES;
  export let CLIMATE_INDICATORS;
</script>

<svelte:head>
  <title>{tool.title}</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<Header
  iconPaths="{tool.icons}"
  title="{tool.title}"
  description="{toolIntro}"
/>

<!-- placeholder div to add height -->
<div id="explore"></div>

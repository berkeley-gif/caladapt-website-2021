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

    return { tool };
  }
</script>

<script>
  import Embed from "~/partials/Embed.svelte";

  export let tool;
</script>

<style>
  /* div {
    overflow-x: auto;
  } */
</style>

<svelte:head>
  <title>{tool.title}</title>
</svelte:head>

<div>
  <Embed path="{`tools/${tool.slug}`}" title="{tool.title}" />
</div>

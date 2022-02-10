<script context="module">
  import { TOOL_SLUG } from "./_constants";
  import resourcesList from "content/resources/data";

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

    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));
    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    const { toolIntro } = await (
      await this.fetch("tools/local-climate-change-snapshot.json")
    ).json();

    return {
      tool,
      toolIntro,
      resources: [...relatedTools, ...externalResources],
    };
  }
</script>

<script>
  import { Header, Resources } from "~/components/tools/Partials";

  export let tool;
  export let toolIntro;
  export let resources;
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

<div class="bx--grid">
  <div id="resources">
    <Resources resources="{resources}" />
  </div>
</div>

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
  import { goto } from "@sapper/app";
  import { locationStore } from "~/routes/tools/_common/stores";
  import { serialize } from "~/helpers/utilities";
  import { Resources } from "~/components/tools/Partials";
  import { Header } from "./_common";
  import SelectLocation from "./_select-location/SelectLocation.svelte";

  export let tool;
  export let resources;

  const { location, boundary } = locationStore;

  function handleSubmit() {
    if ($location && $boundary) {
      const {
        center: [lng, lat],
      } = $location;
      const { id } = $boundary;
      const params = { lng, lat, boundary: id };
      const url = `/tools/local-climate-change-snapshot/explore?${serialize(
        params
      )}`;
      goto(url);
    }
  }
</script>

<svelte:head>
  <title>{tool.title}</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<Header pageName="index" iconPaths="{tool.icons}" />

<div class="bx--grid">
  <div id="select-location" class="margin--v-48">
    <SelectLocation on:submit="{handleSubmit}" />
  </div>

  <div id="resources">
    <Resources resources="{resources}" />
  </div>
</div>

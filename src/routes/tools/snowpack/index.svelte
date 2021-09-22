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
  import { InlineNotification } from "carbon-components-svelte";
  import { Header } from "~/components/tools/Partials";

  export let tool;
</script>

<svelte:head>
  <title>{tool.title}</title>
</svelte:head>

<Header iconPaths="{tool.icons}" title="{tool.title}">
  <div slot="description">
    <p class="lead">
      <InlineNotification
        hideCloseButton
        lowContrast
        kind="warning-alt"
        title="Under Construction"
        subtitle=""
      />
    </p>
  </div>
</Header>

<!-- placeholder div to add height -->
<div id="explore"></div>

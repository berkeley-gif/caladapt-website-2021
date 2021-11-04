<script context="module">
  export async function preload({ params }) {
    const { tool } = params;

    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const metadata = toolsList.find((d) => d.slug === tool);

    return { slug: tool, title: metadata.title };
  }
</script>

<script>
  import Embed from "~/partials/Embed.svelte";
  export let slug;
  export let title;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Embed path="{`tools/${slug}`}" title="{title}" />

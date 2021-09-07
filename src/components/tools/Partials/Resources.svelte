<script>
  import { Card, CardsContainer } from "~/components/cards";

  // Props
  export let resources = [];

  const resourceCardWidth = 22;
  const toolCardWidth = 16;

  $: tools = resources.filter((d) => d.category === "caladapt");
  $: other = resources.filter((d) => d.category === "external");
</script>

<!-- Resources -->
<div class="bx--row margin--v-32">
  <div class="bx--col">
    <h2>Resources</h2>
    <slot name="resources">
      {#if Array.isArray(resources) && resources.length}
        <CardsContainer cardWidth="{resourceCardWidth}">
          {#each other as { link, image, title, text }}
            <Card
              {...{
                titleText: title,
                linkPath: link,
                imgSrc: `img/${image}`,
                description: text,
                ctaText: "View resource",
                headingLevel: 3,
              }}
            />
          {/each}
        </CardsContainer>
      {:else}
        <em>[Provide a list of resources for the tool]</em>
      {/if}
    </slot>
  </div>
</div>

<!-- Related Cal-Adapt tools -->
<div class="bx--row margin--v-32">
  <div class="bx--col">
    <h2>Related Cal-Adapt Tools</h2>
    <slot name="tools">
      {#if Array.isArray(tools) && tools.length}
        <CardsContainer cardWidth="{toolCardWidth}">
          {#each tools as { icons, title, desc, slug }}
            <Card
              {...{
                titleText: title,
                description: desc,
                linkPath: `/tools/${slug}`,
                iconPaths: icons,
                ctaText: "Explore",
                headingLevel: 3,
              }}
            />
          {/each}
        </CardsContainer>
      {:else}
        <em>[Provide a list of related Cal-Adapt tools]</em>
      {/if}
    </slot>
  </div>
</div>

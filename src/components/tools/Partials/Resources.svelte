<script>
  import { Card, CardsContainer } from "~/components/cards";

  // Props
  export let resources = [];

  const resourceCardWidth = 22;
  const toolCardWidth = 16;

  $: tools = resources.filter((d) => d.category === "caladapt");
  $: other = resources.filter((d) => d.category === "external");
</script>

<div class="bx--grid">
  <!-- Resources -->
  <div class="bx--row">
    <div class="bx--col">
      <h2>Resources</h2>
      <slot name="resources">
        {#if !resources || resources.length === 0}
          <em>[Provide a list of resources for the tool]</em>
        {:else}
          <CardsContainer cardWidth="{resourceCardWidth}">
            {#each other as { link, image, title, text }}
              <Card
                {...{
                  titleText: title,
                  linkPath: link,
                  imgSrc: `img/${image}`,
                  description: text,
                  ctaText: "View resource",
                }}
              />
            {/each}
          </CardsContainer>
        {/if}
      </slot>
    </div>
  </div>
  <!-- Related Cal-Adapt tools -->
  <div class="bx--row">
    <div class="bx--col">
      <h3>Related Cal-Adapt Tools</h3>
      <slot name="tools">
        {#if !resources || tools.length === 0}
          <em>[Provide a list of related Cal-Adapt tools]</em>
        {:else}
          <CardsContainer cardWidth="{toolCardWidth}">
            {#each tools as { icons, title, desc, slug }}
              <Card
                {...{
                  titleText: title,
                  description: desc,
                  linkPath: `/tools/${slug}`,
                  iconPaths: icons,
                  ctaText: "Explore",
                }}
              />
            {/each}
          </CardsContainer>
        {/if}
      </slot>
    </div>
  </div>
</div>

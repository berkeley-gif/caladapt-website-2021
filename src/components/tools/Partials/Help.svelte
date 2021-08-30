<script>
  import { Card, CardsContainer } from "~/components/cards";

  // Props
  export let items = [];

  const cardWidth = 16;
</script>

<div class="bx--row">
  <div class="bx--col">
    <h2>Help</h2>
    <slot name="help">
      {#if Array.isArray(items) && items.length}
        <CardsContainer cardWidth="{cardWidth}">
          {#each items as { title, text, slug }}
            <Card
              {...{
                titleText: title,
                description: text,
                linkPath: `/help/${slug}`,
                ctaText: "Learn More",
                headingLevel: 3,
              }}
            />
          {/each}
        </CardsContainer>
      {:else}
        <em>[Provide a list of related Help items]</em>
      {/if}
    </slot>
  </div>
</div>

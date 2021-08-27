<script>
  import { Card, CardsContainer } from "~/components/cards";

  // Props
  export let items = [];

  const cardWidth = 16;
</script>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col">
      <h2>Help</h2>
      <slot name="help">
        {#if !items || items.length === 0}
          <em>[Provide a list of related Help items]</em>
        {:else}
          <CardsContainer cardWidth="{cardWidth}">
            {#each items as { title, text, slug }}
              <Card
                {...{
                  titleText: title,
                  description: text,
                  linkPath: `/help/${slug}`,
                  ctaText: "Learn More",
                }}
              />
            {/each}
          </CardsContainer>
        {/if}
      </slot>
    </div>
  </div>
</div>

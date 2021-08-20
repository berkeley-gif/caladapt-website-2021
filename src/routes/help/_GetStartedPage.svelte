<script>
  import { Row, Column } from "carbon-components-svelte";
  import { Card, CardsContainer } from "~/components/cards";
  import { getting_started_topics } from "./_getting-started-topics";

  const cardHeight = 18;
</script>

<style lang="scss">
  p.intro-text {
    max-width: 75ch;
    padding: 1rem;
  }
</style>

<Row>
  <Column>
    <p class="intro-text">
      If you want to start exploring the data right away, our <a
        href="/tools/local-climate-change-snapshot/"
        >Local Climate Change Snapshot tool</a
      > is a great place to begin. In this getting started guide, you can get a background
      on climate change and working with climate data.
    </p>
    <CardsContainer>
      {#each getting_started_topics as { title, text, slug }}
        <Card
          {...{
            height: cardHeight,
            titleText: title,
            description: text,
            linkPath: `/help/get-started/${slug}`,
            ctaText: "learn more",
          }}
        />
      {/each}
    </CardsContainer>
  </Column>
</Row>

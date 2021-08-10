<script>
  import { Row, Column } from "carbon-components-svelte";
  import TopicTile from "./_TopicTile.svelte";
  import { getting_started_topics } from "./_getting-started-topics";
</script>

<style lang="scss">
  p.intro-text {
    max-width: 75ch;
    padding: 1rem;
  }

  .tiles-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    grid-gap: 1.5rem;
    margin-bottom: 3rem;
    padding-right: 1rem;
    padding-left: 0.75rem;
    list-style: none;
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
    <ul class="tiles-list">
      {#each getting_started_topics as topic}
        <TopicTile topic="{topic}" />
      {/each}
    </ul>
  </Column>
</Row>

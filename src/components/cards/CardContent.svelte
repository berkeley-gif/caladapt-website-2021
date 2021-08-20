<script>
  import CardTitle from "./CardTitle.svelte";
  import CardRule from "./CardRule.svelte";
  import CardTags from "./CardTags.svelte";
  import CardDateAuthor from "./CardDateAuthor.svelte";

  export let headingLevel = 2;
  export let titleText = "Title Me";
  export let linkPath = "#";
  export let description = "";
  export let ctaText = "";
  export let useRule = false;
  export let author = null;
  export let pubDate = null;
  export let pubDateStr = "";
  export let tags = [];
  export let isVariant = false;
</script>

<style lang="scss">
  .card--content-container {
    max-width: 60ch;
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 25% 65% 10%;
    padding: 1rem;
    overflow: hidden;

    &.card--layout-img-icon {
      height: auto;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
    }
  }

  p {
    font-size: 1.125rem;
    line-height: 1.3;
    margin-bottom: 1rem;
    color: var(--text-color, var(--gray-80));
  }

  small {
    font-size: 1rem;
    color: var(--text-color, var(--link-01));
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.01rem;
    pointer-events: none;
  }
</style>

<div class="card--content-container" class:card--layout-img-icon="{isVariant}">
  <div>
    <CardTitle {...{ titleText, headingLevel, linkPath }} />

    {#if pubDate || author}
      <CardDateAuthor {...{ pubDate, pubDateStr, author }} />
    {/if}
  </div>

  <div>
    {#if useRule}
      <CardRule />
    {/if}
    <p>{description}</p>
  </div>

  <div>
    {#if Array.isArray(tags) && tags.length}
      <CardTags tags="{tags}" />
    {/if}

    {#if ctaText}
      <small aria-hidden="true">{ctaText}</small>
    {/if}
  </div>
</div>

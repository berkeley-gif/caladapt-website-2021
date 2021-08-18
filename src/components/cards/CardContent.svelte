<script>
  import CardTitle from "./CardTitle.svelte";

  export let headingLevel = 2;
  export let titleText = "Title Me";
  export let linkPath = "#";
  export let description = "";
  export let ctaText = "";
</script>

<style lang="scss">
  .card--content-container {
    max-width: 60ch;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    padding: 1rem;

    & > * + * {
      margin-top: 0.75rem;
    }

    &:last-child {
      margin-top: auto;
    }

    &:nth-last-child(2) {
      margin-bottom: 0.75rem;
    }
  }

  p {
    font-size: 1.125rem;
  }

  small {
    font-size: 1rem;
    color: var(--link-01);
  }
</style>

<div class="card--content-container">
  <CardTitle {...{ titleText, headingLevel, linkPath }} />

  <!-- TODO: truncate description text using CSS -->
  <p>{description}</p>

  {#if ctaText}
    <small aria-hidden="true">{ctaText}</small>
  {/if}
</div>

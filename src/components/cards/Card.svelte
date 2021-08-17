<script>
  import CardTitle from "./CardTitle.svelte";
  import CardImage from "./CardImage.svelte";

  export let height = "auto";
  export let width = "auto";

  export let headingLevel = 2;
  export let titleText = "Title me";
  export let linkPath = "#";

  export let description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  export let ctaText = "Learn more";
  export let variant = "default"; // "icon", "author"?
  export let imgSrc = null;
</script>

<style lang="scss">
  li,
  .card--content-container {
    display: flex;
    flex-direction: column;
  }

  li {
    height: var(--card-height, auto);
    width: var(--card-width, auto);
    box-sizing: border-box;
    position: relative;
    background-color: var(--white);
    border: 1px solid var(--gray-20);

    // a11y fix for Safari
    // see: https://developer.mozilla.org/en-US/docs/Web/CSS/list-style#accessibility_concerns
    &::before {
      content: "\200B";
    }

    &:focus-within {
      box-shadow: 0 0 0 0.25rem;
    }
  }

  .card--content-container {
    max-width: 60ch;
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

  small {
    color: var(--link-01);
  }
</style>

<li class="shadow lift" style="--card-height:{height}; --card-width:{width}">
  {#if imgSrc}
    <CardImage imgSrc="{imgSrc}" />
  {/if}
  <div class="card--content-container">
    <!-- TODO: create CardContents child component -->
    <CardTitle {...{ titleText, headingLevel, linkPath }} />
    <p>{description}</p>
    <small aria-hidden="true">{ctaText}</small>
  </div>
</li>

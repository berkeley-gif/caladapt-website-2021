<script>
  import CardContent from "./CardContent.svelte";
  import CardImage from "./CardImage.svelte";

  export let height = "auto";
  export let width = "auto";

  export let headingLevel = 2;
  export let titleText = "Title me";
  export let linkPath = "#";

  export let description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  export let ctaText = "Learn more";
  export let imgSrc = null;
  //   export let variant = "default"; // "icon", "author"?
</script>

<style lang="scss">
  li {
    display: flex;
    flex-direction: column;
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
</style>

<li class="shadow lift" style="--card-height:{height}; --card-width:{width}">
  {#if imgSrc}
    <CardImage imgSrc="{imgSrc}" />
  {/if}
  <CardContent
    {...{ headingLevel, titleText, linkPath, description, ctaText }}
  />
</li>

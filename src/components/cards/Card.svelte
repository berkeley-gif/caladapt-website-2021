<script>
  import CardContent from "./CardContent.svelte";
  import CardIcons from "./CardIcons.svelte";
  import CardImage from "./CardImage.svelte";
  import { CARD_DEFAULT_HEIGHT } from "./Card.constants";

  export let height = CARD_DEFAULT_HEIGHT;
  export let headingLevel = 2;
  export let titleText = "Title me";
  export let description = "...";
  export let linkPath = "#";
  export let ctaText = "Learn more";
  export let imgSrc = null;
  export let iconPaths = [];
  export let textColor = "inherit";
  export let bgColor = "inherit";

  $: varCardHeight =
    height && typeof height === "number" ? `${height}rem` : CARD_DEFAULT_HEIGHT;
</script>

<style lang="scss">
  li {
    display: flex;
    flex-direction: column;
    height: var(--card-height, auto);
    box-sizing: border-box;
    position: relative;
    background-color: var(--card-bg-color, var(--white));
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

<li
  class="shadow lift"
  style="--card-height:{varCardHeight};--text-color:{textColor}; --card-bg-color:{bgColor}"
>
  {#if imgSrc}
    <CardImage imgSrc="{imgSrc}" />
  {/if}

  {#if Array.isArray(iconPaths) && iconPaths.length}
    <CardIcons iconPaths="{iconPaths}" />
  {/if}

  <CardContent
    {...{ headingLevel, titleText, description, linkPath, ctaText }}
  />
</li>

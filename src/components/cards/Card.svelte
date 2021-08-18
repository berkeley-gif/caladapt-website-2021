<script>
  import CardContent from "./CardContent.svelte";
  import CardIcons from "./CardIcons.svelte";
  import CardImage from "./CardImage.svelte";
  import { CARD_DEFAULT_HEIGHT } from "./Card.constants";

  export let card = {
    height: CARD_DEFAULT_HEIGHT,
    headingLevel: 2,
    titleText: "Title me",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    linkPath: "#",
    ctaText: "Learn more",
    imgSrc: null,
    iconPaths: [],
  };

  $: varCardHeight =
    card.height && typeof card.height === "number"
      ? `${card.height}rem`
      : CARD_DEFAULT_HEIGHT;
</script>

<style lang="scss">
  li {
    display: flex;
    flex-direction: column;
    height: var(--card-height, auto);
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

<li class="shadow lift" style="--card-height:{varCardHeight}">
  {#if card.imgSrc}
    <CardImage imgSrc="{card.imgSrc}" />
  {/if}

  {#if Array.isArray(card.iconPaths) && card.iconPaths.length}
    <CardIcons iconPaths="{card.iconPaths}" />
  {/if}

  <CardContent {...card} />
</li>

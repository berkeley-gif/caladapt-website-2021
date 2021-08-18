<script>
  import CardContent from "./CardContent.svelte";
  import CardImage from "./CardImage.svelte";

  export let card = {
    height: "auto",
    width: "auto",
    headingLevel: 2,
    titleText: "Title me",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    linkPath: "#",
    ctaText: "Learn more",
    imgSrc: null,
  };
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

<li
  class="shadow lift"
  style="--card-height:{card.height}; --card-width:{card.width}"
>
  {#if card.imgSrc}
    <CardImage imgSrc="{card.imgSrc}" />
  {/if}
  <CardContent {...card} />
</li>

<script>
  import CardContent from "./CardContent.svelte";
  import CardIcons from "./CardIcons.svelte";
  import CardImage from "./CardImage.svelte";
  import { CARD_DEFAULT_HEIGHT } from "./Card.constants";

  export let height = CARD_DEFAULT_HEIGHT;
  export let headingLevel = 2;
  export let titleText = "Title me";
  export let description = "...";
  export let author = null;
  export let pubDate = null;
  export let pubDateStr = "";
  export let tags = [];
  export let linkPath = "#";
  export let ctaText = "Learn more";
  export let imgSrc = null;
  export let iconPaths = [];
  export let textColor = null;
  export let bgColor = null;
  export let border = "";
  export let useRule = false;

  $: isVariant = Boolean(
    imgSrc ||
      (Array.isArray(iconPaths) && iconPaths.length) ||
      $$slots.icon_slot
  );
  $: varCardHeight =
    height && typeof height === "number" ? `${height}rem` : CARD_DEFAULT_HEIGHT;
</script>

<style lang="scss">
  $default-border: 1px solid var(--gray-20);

  li {
    display: flex;
    flex-direction: column;
    height: var(--card-height, auto);
    box-sizing: border-box;
    position: relative;
    background: var(--card-bg-color, var(--white));
    border: var(--card-border, $default-border);

    // a11y fix for Safari
    // see: https://developer.mozilla.org/en-US/docs/Web/CSS/list-style#accessibility_concerns
    &::before {
      content: "\200B";
      width: 0;
      height: 0;
    }

    &:focus-within {
      box-shadow: 0 0 0 0.25rem;
    }
  }
</style>

<li
  class="shadow lift"
  style="--card-height:{varCardHeight};--text-color:{textColor}; --card-bg-color:{bgColor}; --card-border:{border};"
>
  {#if imgSrc}
    <CardImage imgSrc="{imgSrc}" />
  {/if}

  {#if Array.isArray(iconPaths) && iconPaths.length}
    <CardIcons iconPaths="{iconPaths}" />
  {/if}

  {#if $$slots.icon_slot}
    <CardIcons>
      <slot slot="icon_slot" name="icon_slot" />
    </CardIcons>
  {/if}

  <CardContent
    {...{
      headingLevel,
      titleText,
      description,
      author,
      pubDate,
      pubDateStr,
      tags,
      linkPath,
      ctaText,
      useRule,
      isVariant,
    }}
  />
</li>

<script>
  import {
    CARD_DEFAULT_WIDTH,
    CARD_CONTAINER_DEFAULT_GAP,
  } from "./Card.constants";

  export let gridGap = CARD_CONTAINER_DEFAULT_GAP;
  export let cardWidth = CARD_DEFAULT_WIDTH;
</script>

<style>
  ul {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(var(--card-width, 16rem), 1fr)
    );
    grid-gap: var(--gap, 1rem);
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>

<ul
  class="card--list--container"
  style="--gap:{gridGap}rem; --card-width:{cardWidth}rem"
>
  <slot />
</ul>

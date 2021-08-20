<script>
  import { Tag } from "carbon-components-svelte";
  import { CARD_TAG_COLOR_MAP } from "./Card.constants";

  export let tags = [];
</script>

<style>
  div {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
</style>

<div class="card--tags-conatiner">
  {#each tags as tag, index}
    <Tag
      size="default"
      type="{CARD_TAG_COLOR_MAP.get(tag) || 'gray'}"
      style="{index === 0 ? 'margin-left: 0;' : ''}">{tag}</Tag
    >
  {/each}
</div>

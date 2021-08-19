<script>
  import { Tag } from "carbon-components-svelte";

  export let tags = [];
</script>

<style lang="scss">
  div {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
</style>

<div class="card--tags-conatiner">
  {#each tags as tag, index}
    <Tag
      size="default"
      type="teal"
      style="{index === 0 ? 'margin-left: 0;' : ''}">{tag}</Tag
    >
  {/each}
</div>

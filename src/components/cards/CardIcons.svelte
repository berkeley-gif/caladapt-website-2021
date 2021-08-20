<script>
  export let iconPaths = [];
</script>

<style lang="scss">
  div {
    padding: 1rem 1rem 0;
  }

  img {
    width: 60px;
    margin-left: 0.5rem;

    &:first-of-type {
      margin-left: 0;
    }
  }
</style>

<div>
  {#if iconPaths}
    {#each iconPaths as src}
      <img src="{src}" alt="" class="icon" />
    {/each}
  {/if}
</div>

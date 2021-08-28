<script>
  export let title;
  export let iconPaths;
</script>

<style lang="scss">
  :global(.banner .lead a) {
    color: var(--link-01);
    text-decoration: none;
  }

  img {
    width: 60px;
    margin-left: 0.5rem;

    &:first-of-type {
      margin-left: 0;
    }
  }
</style>

<!-- Banner -->
<div class="banner bg-gray-100">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <div class="title">
          {#if Array.isArray(iconPaths) && iconPaths.length}
            {#each iconPaths as icon}
              <img src="{icon}" alt="icon" class="icon" />
            {/each}
          {/if}
        </div>
        <h1>{title}</h1>
        <slot name="description">
          <em>[Provide a brief description for this tool]</em>
        </slot>
      </div>
    </div>
  </div>
</div>

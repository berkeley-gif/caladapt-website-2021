<script>
  export let title;
  export let iconPaths;
</script>

<style lang="scss">
  .banner-tool {
    padding: 2rem;
    background: var(--gray-10);
    color: var(--text-01);

    h1 {
      margin-top: var(--spacing-8);
    }

    img {
      width: 60px;
      margin-left: 0.5rem;

      &:first-of-type {
        margin-left: 0;
      }
    }
  }
</style>

<!-- Banner -->
<div class="banner-tool bg-gray-100">
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

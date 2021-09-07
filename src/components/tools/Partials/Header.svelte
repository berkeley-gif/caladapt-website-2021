<script>
  export let title;
  export let iconPaths;
</script>

<style lang="scss">
  .banner {
    background: var(--gray-10);
    color: var(--text-01);
    padding: 3rem 0;

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

  .banner :global(.lead a) {
    color: var(--link-01);
    text-decoration: none;
  }
</style>

<!-- Banner -->
<div class="bleed banner">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col-lg-12 bx--col-md-8 bx--col-sm-4">
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

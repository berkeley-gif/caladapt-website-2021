<style lang="scss">
  .prev-next--container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .card {
    padding: 0.5rem;
    width: calc(50% - 1rem);

    &.disabled {
      opacity: 0;
    }
  }

  .prev-next--label {
    color: var(--gray-60);
  }

  .prev-next--article-link {
    font-size: 1.2rem;
  }
</style>

<nav class="prev-next--container" aria-label="Previous and Next Articles">
  <div class="{prev ? 'card shadow' : 'card shadow disabled'}">
    {#if prev}
      <p class="prev-next--label">Previous Article</p>
      <p class="prev-next--article-link">
        <a href="{prev.href}">{prev.title}</a>
      </p>
    {/if}
  </div>

  <div class="{next ? 'card shadow' : 'card shadow disabled'}">
    {#if next}
      <p class="prev-next--label">Next Article</p>
      <p class="prev-next--article-link">
        <a href="{next.href}">{next.title}</a>
      </p>
    {/if}
  </div>
</nav>

<script>
  export let prev;
  export let next;
</script>

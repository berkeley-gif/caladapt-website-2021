<script>
  export let prev;
  export let next;
</script>

<style lang="scss">
  .prev-next--container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .card {
    padding: 1rem;
    position: relative;

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

  a {
    text-decoration: none;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }
  }
</style>

<nav aria-label="Previous and Next Articles">
  <ul class="prev-next--container">
    <li class="{prev ? 'card shadow lift' : 'card disabled'}">
      {#if prev}
        <p class="prev-next--label">Previous article</p>
        <p class="prev-next--article-link">
          <a href="{prev.href}">{prev.title}</a>
        </p>
      {/if}
    </li>

    <li class="{next ? 'card shadow lift' : 'card disabled'}">
      {#if next}
        <p class="prev-next--label">Next article</p>
        <p class="prev-next--article-link">
          <a href="{next.href}">{next.title}</a>
        </p>
      {/if}
    </li>
  </ul>
</nav>

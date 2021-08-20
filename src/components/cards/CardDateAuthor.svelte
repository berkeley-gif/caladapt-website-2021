<script>
  export let author = "";
  export let pubDate = "";
  export let pubDateStr = "";

  const hasDate = Boolean(pubDate && pubDateStr);
</script>

<style>
  p {
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 0.875rem;
    color: var(--text-color, var(--gray-60));
    margin-bottom: 1rem;
  }

  span.dot {
    display: inline-block;
    padding: 0 0.25rem;
    font-size: 1.5rem;
    transform: translate(0, -0.1rem);
  }
</style>

<p>
  {#if hasDate}
    <time datetime="{pubDate}">{pubDateStr}</time>
  {/if}

  {#if hasDate && author}
    <span class="dot"> · </span>
  {/if}

  <span>{author}</span>
</p>

<script>
  export let status;
  export let error;

  const dev = process.env.NODE_ENV === "development";
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col">
      <h1>{status}</h1>
      <p>{error.message}</p>
      <p>Sorry about that! Try going back to <a href="/">the home page</a>.</p>
      {#if dev && error.stack}
        <pre>{error.stack}</pre>
      {/if}
    </div>
  </div>
</div>

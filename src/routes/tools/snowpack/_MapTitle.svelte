<script>
  export let title;
  export let caveat;
</script>

<style>
  div {
    max-width: 60ch;
    margin: 0;
  }
  p {
    margin: 0.5rem 0 0;
    color: var(--gray-80);
  }
</style>

<div class="h3">
  {title}
</div>
{#if caveat}
  <p>*{caveat}</p>
{/if}

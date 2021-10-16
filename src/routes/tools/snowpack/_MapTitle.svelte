<script>
  export let month;
  export let scenarioLabel;
  export let model;
  export let year;
  export let duration;
  export let caveat;
</script>

<style>
  div {
    max-width: 60ch;
    margin: 0;
    font-weight: 400;
  }

  div span {
    font-weight: 600;
  }

  p {
    margin: 0.5rem 0 0;
    color: var(--gray-80);
  }
</style>

<div class="h3">
  <span>{month}</span> Snow Water Equivalent under a
  <span>{scenarioLabel}</span>
  for <span>{model}</span> averaged over
  <span>{year} – {year + duration - 1}</span>*
</div>
{#if caveat}
  <p>*{caveat}</p>
{/if}

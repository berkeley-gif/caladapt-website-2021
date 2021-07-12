<script>
  import { SkeletonPlaceholder } from 'carbon-components-svelte';

  export let data;
  export let height = '350px';
  export let units;

  let chartContainer;

</script>

<style>
  .items {
    display: flex;
    flex-wrap: wrap;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    flex: 0 0 32%;
    margin: 0.25rem;
    border: 1px solid #bcc2c7;
  }

  .item .day {
    font-size: 1.1rem;
    padding: 0.5rem;
    text-transform: uppercase;
  }

  .item .value {
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0.5rem;
  }
</style>

{#if data}
  <div style={`height:${height}`} bind:this={chartContainer}>
    <div class="items">
      {#each data as opt}
        <div class="item">
          <span class="day">{opt.day}</span>
          <span class="value">{opt.value} {units}</span>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div style={`height:${height}`}>
    <SkeletonPlaceholder style="height:100%;width:100%;" />
  </div>
{/if}
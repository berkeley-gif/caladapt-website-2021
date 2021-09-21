<script>
  import { getContext } from "svelte";

  const legendItems = getContext("Legend");
</script>

<style>
  .legend-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0.75rem 0;
  }

  .legend-item {
    margin: 3px;
    padding: 0.1rem 0.5rem;
    font-size: 0.9rem;
    font-weight: 400;
  }

  span.key {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }
</style>

<div class="legend-group">
  {#each $legendItems as item}
    <div class="legend-item">
      <span class="key" style="{`background:${item.color};`}"
      ></span>{item.label}
    </div>
  {/each}
</div>

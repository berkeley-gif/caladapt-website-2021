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

  .legend-group .legend-item {
    margin: 3px;
  }

  .legend-item {
    /*    opacity: 0.4;*/
    opacity: 1;
    padding: 0.1rem 0.5rem;
    font-size: 0.9rem;
    font-weight: 400;
    background: #fff;
    border: 1px solid #dadee1;
    border-radius: 0.975rem;
    /*    cursor: pointer;*/
  }

  /*  .legend-item:hover {
    background: #bcc2c7;
  }*/

  /*  .legend-item.show {
    opacity: 1;
  }*/

  span.key {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }
</style>

<div class="legend-group">
  {#each $legendItems as item}
    <button size="{'sm'}" class="legend-item" role="{'button'}" tabindex="{0}">
      <span class="key" style="{`background:${item.color};`}"
      ></span>{item.label}
    </button>
  {/each}
</div>

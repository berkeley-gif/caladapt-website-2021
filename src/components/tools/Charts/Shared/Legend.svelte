<script>
  import { getContext } from "svelte";

  const legendItems = getContext("Legend");

  function onClick(e) {
    const target = e.target;
    target.classList.toggle("show");
    const key = target.getAttribute("data-value");
    $legendItems = $legendItems.map((d) => {
      if (d.key === key) {
        d.visible = !d.visible;
      }
      return d;
    });
  }
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
    opacity: 0.4;
    padding: 0.1rem 0.5rem;
    font-size: 0.9rem;
    font-weight: 400;
    background: #fff;
    border: 1px solid #dadee1;
    border-radius: 0.975rem;
    cursor: pointer;
  }

  .legend-item:hover {
    background: #var(--gray-30);
  }

  span.key {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }

  span.key.area {
    width: 20px;
  }

  .legend-item.show {
    opacity: 1;
  }
</style>

<div class="legend-group">
  {#each $legendItems as item}
    <button
      size="{'sm'}"
      class="legend-item"
      class:show="{item.visible}"
      role="{'button'}"
      tabindex="{0}"
      data-value="{item.key}"
      on:click="{onClick}"
    >
      {#if item.mark === "area"}
        <span
          class="key area"
          style="{`background:${item.color.replace(/[^,]+(?=\))/, '0.7')};`}"
        ></span>{item.label}
      {:else}
        <span class="key line" style="{`background:${item.color};`}"
        ></span>{item.label}
      {/if}
    </button>
  {/each}
</div>

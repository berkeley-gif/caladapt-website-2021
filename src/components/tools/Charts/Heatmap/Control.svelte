<script>
  import { getContext } from "svelte";

  const controlItems = getContext("Control");

  const toggleDisplay = (id) => {
    return [...$controlItems].map((series) => {
      return {
        ...series,
        visible: series.id === id ? true : false,
      };
    });
  };

  function onClick(e) {
    const target = e.target;
    target.classList.toggle("show");
    const id = target.getAttribute("data-value");
    $controlItems = toggleDisplay(id);
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
    background: var(--gray-30);
  }

  .legend-item.show {
    opacity: 1;
  }
</style>

<div class="legend-group">
  {#each $controlItems as item}
    <button
      size="{'sm'}"
      class="legend-item"
      class:show="{item.visible}"
      role="{'button'}"
      tabindex="{0}"
      data-value="{item.id}"
      on:click="{onClick}"
    >
      {item.label}
    </button>
  {/each}
</div>

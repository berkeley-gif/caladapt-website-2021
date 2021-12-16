<script>
  import { createEventDispatcher } from "svelte";
  import { RadioButtonGroup, RadioButton } from "carbon-components-svelte";

  export let titleText = "Select basemap style";
  export let styles = [
    { label: "Grayscale", id: "light-v10" },
    { label: "Satellite", id: "satellite-v9" },
    { label: "Satellite Streets", id: "satellite-streets-v11" },
  ];
  export let selected =
    Array.isArray(styles) && styles.length ? styles[0].id : "";

  const dispatch = createEventDispatcher();

  function change({ target: { checked, value } }) {
    if (checked) {
      const url = `mapbox://styles/mapbox/${value}`;
      dispatch("change", url);
    }
  }
</script>

<style>
  div {
    position: var(--position, absolute);
    top: var(--top, initial);
    right: var(--right, 10px);
    left: var(--left, initial);
    bottom: var(--bottom, 10px);
    padding: var(--padding, 0.5rem);
    background-color: var(--white, #fff);
    border-color: var(--border-color, var(--gray-40));
    border-style: var(--border-style, solid);
    border-width: var(--border-width, 0.0625rem);
  }
</style>

<div class="style-control">
  <RadioButtonGroup legendText="{titleText}" bind:selected>
    {#each styles as { id, label }}
      <RadioButton labelText="{label}" value="{id}" on:change="{change}" />
    {/each}
  </RadioButtonGroup>
</div>

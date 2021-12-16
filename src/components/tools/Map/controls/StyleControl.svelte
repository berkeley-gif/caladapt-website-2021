<script>
  import { createEventDispatcher } from "svelte";
  import { RadioButtonGroup, RadioButton } from "carbon-components-svelte";

  export let titleText = "Select basemap style";
  export let position = {
    bottom: 10,
    right: 10,
  };
  export let styles = [
    { label: "Grayscale", id: "light-v10" },
    { label: "Satellite", id: "satellite-v9" },
    { label: "Satellite Streets", id: "satellite-streets-v11" },
  ];
  export let selected =
    Array.isArray(styles) && styles.length ? styles[0].id : "";

  const dispatch = createEventDispatcher();

  const styleProps = Object.entries(position)
    .map(([key, value]) => `--${key}:${value}px`)
    .join(";");

  function change({ target: { checked, value } }) {
    if (checked) {
      const url = `mapbox://styles/mapbox/${value}`;
      dispatch("change", url);
    }
  }
</script>

<style>
  div {
    position: absolute;
    top: var(--top, initial);
    right: var(--right, initial);
    left: var(--left, initial);
    bottom: var(--bottom, initial);
    padding: 0.5rem;
    background-color: var(--white, #fff);
    border: 0.0625rem solid var(--gray-40);
  }
</style>

<div class="style-control" style="{styleProps}">
  <RadioButtonGroup legendText="{titleText}" bind:selected>
    {#each styles as { id, label }}
      <RadioButton labelText="{label}" value="{id}" on:change="{change}" />
    {/each}
  </RadioButtonGroup>
</div>

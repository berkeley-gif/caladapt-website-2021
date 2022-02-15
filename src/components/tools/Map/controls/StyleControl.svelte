<script>
  import { createEventDispatcher, onMount } from "svelte";

  // NOTE: carbon components need direct path imports for tests not to fail
  import RadioButtonGroup from "carbon-components-svelte/src/RadioButtonGroup/RadioButtonGroup.svelte";
  import RadioButton from "carbon-components-svelte/src/RadioButton/RadioButton.svelte";

  export let titleText = "Select basemap style";
  export let styles = [
    { label: "Light", id: "light-v10" },
    { label: "Dark", id: "dark-v10" },
    { label: "Satellite", id: "satellite-v9" },
    { label: "Satellite with Streets", id: "satellite-streets-v11" },
  ];
  export let selected =
    Array.isArray(styles) && styles.length ? styles[0].id : "";

  const dispatch = createEventDispatcher();

  function change({ target: { checked, value } }) {
    if (checked) {
      dispatch("change", value);
    }
  }

  onMount(() => {
    dispatch("change", selected);
  });
</script>

<style>
  div {
    position: var(--position, absolute);
    top: var(--top, initial);
    right: var(--right, 10px);
    left: var(--left, initial);
    bottom: var(--bottom, 10px);
    padding: var(--padding, 0.5rem);
    background: var(--background, var(--white));
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

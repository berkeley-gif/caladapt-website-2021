<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { Checkbox } from "carbon-components-svelte";

  export let title = "Select Layers";
  export let items;
  export let name = "selected-layers";
  export let disableAll = false;

  const dispatch = createEventDispatcher();
  let ready = false;

  function handleChange(event, id) {
    dispatch("change", { checked: event.target.checked, id });
  }

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<fieldset disabled="{disableAll}">
  <legend class="bx--label">{title}</legend>
  {#if ready}
    {#each items as { id, label, checked, disabled } (id)}
      <!--
        NOTE: this mirrors the markup for the checkbox in carbon-components-svlete.
        That component does not properly update when its attributes/properties change.
      -->
      <div class="bx--form-item bx--checkbox-wrapper">
        <input
          id="{id}"
          class="bx--checkbox"
          type="checkbox"
          name="{name}"
          disabled="{disabled}"
          checked="{checked}"
          on:change="{(event) => handleChange(event, id)}"
        />
        <label for="{id}" class="bx--checkbox-label">
          <span class="bx--checkbox-label-text">{label}</span>
        </label>
      </div>
    {/each}
  {:else}
    <Checkbox skeleton />
    <Checkbox skeleton />
    <Checkbox skeleton />
  {/if}
</fieldset>

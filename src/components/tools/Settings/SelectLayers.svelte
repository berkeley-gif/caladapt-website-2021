<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { Checkbox } from "carbon-components-svelte";

  export let items;

  const dispatch = createEventDispatcher();
  let ready = false;

  function change(event, id) {
    dispatch("change", { checked: event.target.checked, id });
  }

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<fieldset>
  {#if ready}
    {#each items as { id, label, checked, disabled }}
      <Checkbox
        id="{id}"
        labelText="{label}"
        checked="{checked}"
        disabled="{disabled}"
        on:change="{(event) => change(event, id)}"
      />
    {/each}
  {:else}
    <Checkbox skeleton />
    <Checkbox skeleton />
    <Checkbox skeleton />
  {/if}
</fieldset>

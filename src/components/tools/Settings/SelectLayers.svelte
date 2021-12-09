<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { Checkbox } from "carbon-components-svelte";

  export let items;

  const dispatch = createEventDispatcher();
  let ready = false;

  function change(event) {
    dispatch(event);
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
        on:change="{change}"
      />
    {/each}
  {:else}
    <Checkbox skeleton />
    <Checkbox skeleton />
    <Checkbox skeleton />
  {/if}
</fieldset>

<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { NumberInput, NumberInputSkeleton } from "carbon-components-svelte";
  import { debounce } from "~/helpers/utilities";

  export let value = 0;
  export let title = "Select Threshold";
  export let minValue = -Infinity;
  export let maxValue = Infinity;
  export let hideSteppers = false;
  export let delay = 350; // milliseconds

  const dispatch = debounce(createEventDispatcher(), delay);

  let ready = false;

  $: value, dispatch("change", value);

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<style></style>

{#if ready}
  <NumberInput
    bind:value
    label="{title}"
    mix="{minValue}"
    max="{maxValue}"
    hideSteppers="{hideSteppers}"
  />
{:else}
  <NumberInputSkeleton />
{/if}

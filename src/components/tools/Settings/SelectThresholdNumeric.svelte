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
  export let invalidText = "Invalid value";

  const dispatch = debounce(createEventDispatcher(), delay);

  let ready = false;
  let invalid = false;

  $: value, !invalid && dispatch("change", value);

  $: if (value < minValue || value > maxValue) {
    invalid = true;
  } else {
    invalid = false;
  }

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
    invalid="{invalid}"
    invalidText="{invalidText}"
  />
{:else}
  <NumberInputSkeleton />
{/if}

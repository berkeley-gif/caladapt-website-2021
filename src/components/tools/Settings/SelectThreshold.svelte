<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    Button,
    RadioButton,
    RadioButtonGroup,
    RadioButtonSkeleton,
    NumberInput,
  } from "carbon-components-svelte";
  import Delete16 from "carbon-icons-svelte/lib/Delete16";
  import { debounce } from "~/helpers/utilities";

  export let items;
  export let selected;
  export let units;
  export let title = "Select Threshold";
  export let helperText;

  const dispatch = createEventDispatcher();
  let ready = false;

  $: selected, dispatch("change", selected);

  const addThreshold = debounce((e) => {
    console.log("add", e);
    const value = Number(e.target.value);
    dispatch("add", value);
    e.target.value = "";
  }, 500);

  const removeThreshold = (e) => {
    dispatch("remove", e);
  };

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<style>
  .flex-center {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
</style>

{#if ready}
  <RadioButtonGroup legendText="{title}" orientation="vertical" bind:selected>
    {#each items as threshold (threshold.id)}
      <div class="flex-center">
        <RadioButton
          labelText="{`${threshold.value} ${units} (${threshold.label})`}"
          value="{threshold.value}"
        />
        {#if threshold.label === "Custom"}
          <Button
            size="small"
            kind="ghost"
            iconDescription="Remove value"
            icon="{Delete16}"
            on:click="{() => removeThreshold(threshold)}"
          />
        {/if}
      </div>
    {/each}
  </RadioButtonGroup>
  <div style="margin-top: 0.5rem;">
    <NumberInput
      hideLabel
      hideSteppers
      helperText="{helperText}"
      on:input="{addThreshold}"
    />
  </div>
{:else}
  <RadioButtonGroup orientation="vertical">
    <RadioButtonSkeleton />
    <RadioButtonSkeleton />
  </RadioButtonGroup>
{/if}

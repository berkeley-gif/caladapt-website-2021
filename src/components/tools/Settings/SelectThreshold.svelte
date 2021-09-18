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

  export let items;
  export let selected;
  export let units;
  export let title = "Select Threshold";
  export let helperText;

  $: selected, dispatch("change", selected);

  const dispatch = createEventDispatcher();
  let ready = false;

  function addThreshold(e) {
    if (e.key === "Enter") {
      const value = Number(e.target.value);
      dispatch("add", value);
      e.target.value = "";
    }
  }

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

  .input-label {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.34;
    letter-spacing: 0.32px;
    display: inline-block;
    margin: 0.5rem 0;
    color: var(--gray-70);
    font-weight: 400;
    line-height: 1rem;
    vertical-align: baseline;
  }
</style>

{#if ready}
  <RadioButtonGroup legendText="{title}" orientation="vertical" bind:selected>
    {#each items as threshold (threshold.id)}
      <div class="flex-center">
        <RadioButton
          labelText="{`${threshold.label}: ${threshold.value} ${units}`}"
          value="{threshold.value}"
        />
        {#if threshold.label === "Custom"}
          <Button
            size="small"
            kind="ghost"
            iconDescription="Remove value"
            icon="{Delete16}"
            on:click="{() => items.remove(threshold)}"
          />
        {/if}
      </div>
    {/each}
  </RadioButtonGroup>
  <div style="margin-top: 0.5rem;">
    <NumberInput
      hideLabel
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

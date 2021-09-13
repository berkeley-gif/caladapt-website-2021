<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    Button,
    RadioButton,
    RadioButtonGroup,
    RadioButtonSkeleton,
  } from "carbon-components-svelte";
  import Delete16 from "carbon-icons-svelte/lib/Delete16";

  export let items;
  export let selected;
  export let units;
  export let title = "Select Threshold";

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
          labelText="{`${threshold.label} - ${threshold.value} ${units}`}"
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
  <div class="bx--form-item">
    <div class="bx--number bx--number--sm">
      <label for="threshold-input" class="input-label"
        >Add custom threshold</label
      >
      <div class="bx--number__input-wrapper">
        <input
          style="padding-right:0.5rem;width:50%;"
          type="number"
          id="threshold-input"
          step="1"
          on:keydown="{addThreshold}"
        />
      </div>
    </div>
  </div>
{:else}
  <RadioButtonGroup orientation="vertical">
    <RadioButtonSkeleton />
    <RadioButtonSkeleton />
  </RadioButtonGroup>
{/if}

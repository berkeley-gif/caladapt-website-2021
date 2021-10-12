<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    Button,
    Form,
    FormGroup,
    RadioButton,
    RadioButtonGroup,
    RadioButtonSkeleton,
    NumberInput,
  } from "carbon-components-svelte";

  export let items;
  export let selected;
  export let units;
  export let title = "Set Threshold";
  export let helperText;

  const dispatch = createEventDispatcher();
  let ready = false;

  $: selected, dispatch("change", selected);

  const addThreshold = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    dispatch("add", formProps.newThreshold);
    e.target.reset();
  };

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<style>
  .add-threshold :global(.bx--fieldset) {
    display: flex;
  }

  .bx--form__helper-text {
    margin-bottom: 0.25rem;
  }
</style>

{#if ready}
  <RadioButtonGroup legendText="{title}" orientation="vertical" bind:selected>
    <div class="bx--form__helper-text">{helperText}</div>
    {#each items as threshold (threshold.id)}
      {#if threshold.label.includes("Percentile")}
        <RadioButton
          labelText="{`${threshold.value} ${units} (${threshold.label})`}"
          value="{threshold.value}"
        />
      {:else}
        <RadioButton
          labelText="{`${threshold.value} ${units}`}"
          value="{threshold.value}"
        />
      {/if}
    {/each}
  </RadioButtonGroup>
  <div class="add-threshold">
    <Form on:submit="{addThreshold}">
      <FormGroup noMargin>
        <NumberInput name="newThreshold" hideLabel hideSteppers required />
        <Button size="small" type="submit" kind="tertiary">Add</Button>
      </FormGroup>
    </Form>
  </div>
{:else}
  <RadioButtonGroup orientation="vertical">
    <RadioButtonSkeleton />
    <RadioButtonSkeleton />
  </RadioButtonGroup>
{/if}

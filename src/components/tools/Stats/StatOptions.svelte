<script>
  import { createEventDispatcher, afterUpdate } from "svelte";
  import NumberInput from "carbon-components-svelte/src/NumberInput/NumberInput.svelte";
  import Modal from "carbon-components-svelte/src/Modal/Modal.svelte";
  import RadioButton from "carbon-components-svelte/src/RadioButton/RadioButton.svelte";
  import RadioButtonGroup from "carbon-components-svelte/src/RadioButtonGroup/RadioButtonGroup.svelte";
  import {
    MODELED_FUTURE_PROJECTIONS_YEAR,
    MODELED_MAX_YEAR,
  } from "~/helpers/app-constants";

  export let groupList;
  export let periodList;
  export let group;
  export let period;
  export let dateRange = [MODELED_FUTURE_PROJECTIONS_YEAR, MODELED_MAX_YEAR];
  export let open = false;

  const dispatch = createEventDispatcher();
  const [minYear, maxYear] = dateRange;

  // Props for binding to RadioButtonGroup
  let selectedGroupId = group && group.id;
  let selectedPeriodId = period && period.id;

  let customStartYear = period ? period.start : MODELED_FUTURE_PROJECTIONS_YEAR;
  let customEndYear = period ? period.end : MODELED_MAX_YEAR - 1;

  $: invalidCustomStart = !isCustomStartValid(customStartYear);
  $: invalidCustomEnd = !isCustomEndValid(customEndYear);
  $: preventModalSubmit = invalidCustomStart || invalidCustomEnd;

  function isCustomStartValid(value) {
    return isValidNumber(value) && value >= minYear && value < maxYear;
  }

  function isCustomEndValid(value) {
    return (
      isValidNumber(value) &&
      value > Math.max(customStartYear, minYear) &&
      value < maxYear
    );
  }

  function isValidNumber(value) {
    return (
      typeof value === "number" && !isNaN(value) && Number.isInteger(value)
    );
  }

  function getCustomPeriod(startYear, endYear) {
    return {
      id: "custom",
      label: `${startYear}-${endYear}`,
      start: startYear,
      end: endYear,
    };
  }

  function update() {
    group = groupList.find(({ id }) => id === selectedGroupId);
    if (selectedPeriodId === "custom") {
      period = getCustomPeriod(customStartYear, customEndYear);
    } else {
      period = periodList.find(({ id }) => id === selectedPeriodId);
    }
    dispatch("change", { group, period });
  }

  function close() {
    dispatch("cancel");
  }

  afterUpdate(() => {
    // reset the custom year values if they were invalid and selectedPeriodId changed
    if (selectedPeriodId !== "custom" && preventModalSubmit) {
      customStartYear = period.start;
      customEndYear = period.end;
    }
  });
</script>

<style>
  .years-select {
    display: flex;
    gap: 2rem;
    margin-top: 1.5rem;
  }

  .years-select :global(.bx--label) {
    text-transform: none;
  }
</style>

<Modal
  on:click:button--secondary="{() => (open = false)}"
  bind:open
  on:submit="{update}"
  on:close="{close}"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  modalHeading="Change Stats"
  primaryButtonDisabled="{preventModalSubmit}"
>
  <div class="h5">Select Group</div>
  <RadioButtonGroup bind:selected="{selectedGroupId}">
    {#each groupList as { id, label }}
      <RadioButton labelText="{label}" value="{id}" />
    {/each}
  </RadioButtonGroup>

  <div class="h5">Select Time Period</div>
  <RadioButtonGroup bind:selected="{selectedPeriodId}">
    {#each periodList as { id, label }}
      <RadioButton labelText="{label}" value="{id}" />
    {/each}
    <RadioButton labelText="Enter custom year range" value="custom" />
  </RadioButtonGroup>

  {#if selectedPeriodId === "custom"}
    <div class="years-select">
      <NumberInput
        bind:value="{customStartYear}"
        min="{minYear}"
        max="{maxYear}"
        label="Custom Start Year"
        invalid="{invalidCustomStart}"
        invalidText="{`Value must be between ${minYear} and ${maxYear}.`}"
        helperText="{`Enter a year between ${minYear} and ${maxYear}.`}"
        hideSteppers="{true}"
      />
      <NumberInput
        bind:value="{customEndYear}"
        min="{(customStartYear || minYear) + 1}"
        max="{maxYear}"
        label="Custom End Year"
        invalid="{invalidCustomEnd}"
        invalidText="{`Value must be greater than ${Math.max(
          customStartYear,
          minYear
        )} and less than ${maxYear}`}"
        helperText="{`Enter a year greater than the start year.`}"
        hideSteppers="{true}"
      />
    </div>
  {/if}

  <p style="margin-top:1.5rem;">
    <strong>
      Climate scientists recommend a period length of at least a few decades.
    </strong>
  </p>
  <p>
    Future climate projections express natural climate variability. Analyzing a
    longer time period can provide a better sense of overall future conditions
    compared to analyzing only a few years which may turn out to be anomalous.
  </p>
</Modal>

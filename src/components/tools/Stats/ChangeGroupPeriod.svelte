<script>
  import { createEventDispatcher } from "svelte";
  import { range } from "d3-array";
  import {
    RadioButtonGroup,
    RadioButton,
    ComboBox,
    Modal,
  } from "carbon-components-svelte";

  export let groupList;
  export let periodList;
  export let dataExtent;
  export let open = false;

  const dispatch = createEventDispatcher();

  let groupId = groupList[0].id;
  let periodId = periodList[0].id;

  // Props and functions for custom year range selection
  const yearRange = range(dataExtent[0], dataExtent[1], 1);
  const items = yearRange.map((d) => ({ id: d, text: `${d}` }));
  let startYear_selectedIndex = -1;
  let endYear_selectedIndex = -1;
  let filteredItems;

  function updateLinkedList() {
    if (startYear_selectedIndex < 0) {
      filteredItems = items;
      endYear_selectedIndex = -1;
    } else {
      filteredItems = items.splice(startYear_selectedIndex + 1);
    }
  }

  function shouldFilterItem(item, value) {
    if (!value) return true;
    return item.text.includes(value);
  }

  $: startYear_selectedIndex, updateLinkedList();
  $: console.log(periodId, groupId);

  // Dispatch change event is user confirms changes
  function update() {
    dispatch("change", { groupId, periodId });
  }
</script>

<style>
  .year-select {
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
  }
</style>

<Modal
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary="{() => (open = false)}"
  bind:open
  modalHeading="Change Stats"
  on:submit="{update}"
  on:close="{() => dispatch('cancel')}"
>
  <h5>Select Group</h5>
  <RadioButtonGroup bind:selected="{groupId}">
    {#each groupList as { id, label }}
      <RadioButton labelText="{label}" value="{id}" />
    {/each}
  </RadioButtonGroup>

  <h5>Select Time Period</h5>
  <RadioButtonGroup bind:selected="{periodId}">
    {#each periodList as { id, label }}
      <RadioButton labelText="{label}" value="{id}" />
    {/each}
    <RadioButton labelText="Enter custom year range" value="custom" />
  </RadioButtonGroup>

  {#if periodId === "custom"}
    <div class="year-select">
      <ComboBox
        bind:selectedIndex="{startYear_selectedIndex}"
        titleText="Start"
        placeholder="Select start year"
        items="{items}"
        shouldFilterItem="{shouldFilterItem}"
      />
      <ComboBox
        bind:selectedIndex="{endYear_selectedIndex}"
        titleText="End"
        placeholder="Select end year"
        items="{filteredItems}"
      />
    </div>
  {/if}

  <p style="margin-top:1.5rem;">
    <strong
      >Scientists recommend looking at a period of at least a few decades like a
      30 year period.</strong
    >
  </p>
  <p>
    Future climate projections express natural climate variability. If you
    analyze just a few years of a future climate projection, you might happen to
    select years that are anomalous. Analyzing a longer time selected gives you
    a better sense of overall future conditions.
  </p>
</Modal>

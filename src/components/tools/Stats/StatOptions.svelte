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
  export let group;
  export let period;
  export let dataExtent;
  export let open = false;

  const dispatch = createEventDispatcher();

  // Props and functions for custom year range selection
  let startYear_selectedIndex = -1;
  let endYear_selectedIndex = -1;
  let filteredItems;

  const formatSelected = (i) => (items[i] ? +items[i].text : "N/A");

  function updateLinkedList() {
    if (startYear_selectedIndex < 0) {
      filteredItems = items;
      endYear_selectedIndex = -1;
    } else {
      filteredItems = items.slice(startYear_selectedIndex + 1);
    }
  }

  $: yearRange = range(dataExtent[0], dataExtent[1], 1);
  $: items = yearRange.map((d) => ({ id: d, text: `${d}` }));
  $: startYear_selectedIndex, updateLinkedList();

  // If user confirms changes, dispatch change event
  // with selected groupdId and periodId
  // If user has selected a custom period, add start and end years.
  function update() {
    const options = { groupId: group.id, periodId: period.id };
    if (period.id === "custom") {
      options.start = formatSelected(startYear_selectedIndex);
      options.end = formatSelected(endYear_selectedIndex) + 1;
    }
    dispatch("change", options);
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
  <RadioButtonGroup bind:selected="{group.id}">
    {#each groupList as { id, label }}
      <RadioButton labelText="{label}" value="{id}" />
    {/each}
  </RadioButtonGroup>

  <h5>Select Time Period</h5>
  <RadioButtonGroup bind:selected="{period.id}">
    {#each periodList as { id, label }}
      <RadioButton labelText="{label}" value="{id}" />
    {/each}
    <RadioButton labelText="Enter custom year range" value="custom" />
  </RadioButtonGroup>

  {#if period.id === "custom"}
    <div class="year-select">
      <ComboBox
        bind:selectedIndex="{startYear_selectedIndex}"
        titleText="Start"
        placeholder="Select start year"
        items="{items}"
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

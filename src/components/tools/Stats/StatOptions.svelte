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
  export let dateRange;
  export let open = false;

  const dispatch = createEventDispatcher();

  // Props for binding to RadioButtonGroup
  let selectedGroupId = group.id;
  let selectedPeriodId = period.id;

  // Props and functions for defining a custom period
  let startYear_selectedIndex = -1;
  let endYear_selectedIndex = -1;
  let filteredItems;

  const getItem = (i) => (items[i] ? +items[i].text : "N/A");
  const getFilteredItem = (i) =>
    filteredItems[i] ? +filteredItems[i].text : "N/A";

  function updateLinkedList() {
    if (startYear_selectedIndex < 0) {
      filteredItems = items;
      endYear_selectedIndex = -1;
    } else {
      filteredItems = items.slice(startYear_selectedIndex + 1);
    }
  }

  $: yearsList = range(dateRange[0], dateRange[1] + 1, 1);
  $: items = yearsList.map((d) => ({ id: d, text: `${d}` }));
  $: startYear_selectedIndex, updateLinkedList();

  // If user confirms changes, dispatch change event with selected groupd and period
  // If user has selected a custom period, create a new period object
  function update() {
    group = groupList.find(({ id }) => id === selectedGroupId);
    if (selectedPeriodId === "custom") {
      const start = getItem(startYear_selectedIndex);
      const end = getFilteredItem(endYear_selectedIndex);
      period = {
        id: "custom",
        label: `${start}-${end}`,
        start,
        end,
      };
    } else {
      period = periodList.find(({ id }) => id === selectedPeriodId);
    }
    dispatch("change", { group, period });
  }
</script>

<style>
  .years-select {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
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
      >Climate scientists recommend a period length of at least a few decades.</strong
    >
  </p>
  <p>
    Future climate projections express natural climate variability. Analyzing a
    longer time period can provide a better sense of overall future conditions
    compared to analyzing only a few years which may turn out to be anomalous.
  </p>
</Modal>

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

  const getItemByIndex = (i, arr) => (arr[i] ? arr[i].text : null);

  /**
   * When start year is selected, the items in the end year combobox dropdown menu are filtered
   * to show only values greater than the start year
   **/
  function updateLinkedList() {
    if (startYear_selectedIndex < 0) {
      filteredItems = items;
      endYear_selectedIndex = -1;
    } else {
      filteredItems = items.slice(startYear_selectedIndex + 1);
    }
  }

  /**
   * When user types in the year, the combobox dropdown menu is filtered to show only
   * values that complete the characters typed in the combobox
   **/
  function shouldFilterItem(item, value) {
    if (!value) return true;
    return item.text.includes(value);
  }

  /**
   * When user presses the Enter or Tab key in combobox after typing in a year, update
   * the combobox selected index if the year matches an item in the combobox dropdown menu
   **/
  function updateIndex(e) {
    const { key, target } = e;
    if (["Enter", "Tab"].includes(key)) {
      const { value, id } = target;
      switch (id) {
        case "years-select-start":
          startYear_selectedIndex = items.findIndex((d) => d.text === value);
          return;
        case "years-select-end":
          endYear_selectedIndex = filteredItems.findIndex(
            (d) => d.text === value
          );
          return;
        default:
          return;
      }
    }
  }

  $: yearsList = range(dateRange[0], dateRange[1] + 1, 1);
  $: items = yearsList.map((d) => ({ id: d, text: `${d}` }));
  $: startYear_selectedIndex, updateLinkedList();

  /**
   * Dispatch change event with current group object and selected period object when user selects Confirm.
   * For custom period:
   *  - check if both start and end year are defined
   *  - create a new period object
   **/
  function update() {
    group = groupList.find(({ id }) => id === selectedGroupId);
    if (selectedPeriodId === "custom") {
      if (startYear_selectedIndex < 0 || endYear_selectedIndex < 0) {
        return;
      }
      const start = getItemByIndex(startYear_selectedIndex, items);
      const end = getItemByIndex(endYear_selectedIndex, filteredItems);
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
        invalid="{startYear_selectedIndex < 0}"
        invalidText="Select a year from the list"
        shouldFilterItem="{shouldFilterItem}"
        on:keydown="{updateIndex}"
        id="years-select-start"
      />
      <ComboBox
        bind:selectedIndex="{endYear_selectedIndex}"
        titleText="End"
        placeholder="Select end year"
        items="{filteredItems}"
        invalid="{endYear_selectedIndex < 0}"
        invalidText="Select a year from the list"
        shouldFilterItem="{shouldFilterItem}"
        on:keydown="{updateIndex}"
        id="years-select-end"
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

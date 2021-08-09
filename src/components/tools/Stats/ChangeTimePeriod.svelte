<script>
  import { createEventDispatcher } from "svelte";
  import { range } from "d3-array";
  import {
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    ComboBox,
    Modal,
  } from "carbon-components-svelte";

  export let historicalOnly = false;
  export let open = false;

  let selected = "baseline";
  let yearRange;

  const dispatch = createEventDispatcher();
  if (historicalOnly) {
    yearRange = range(1950, 2006, 1);
  } else {
    yearRange = range(1950, 2100, 1);
  }
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

  $: startYear_selectedIndex, updateLinkedList();

  function shouldFilterItem(item, value) {
    if (!value) return true;
    return item.text.includes(value);
  }

  function update() {
    let period;
    let start;
    let end;
    switch (selected) {
      case "midcentury":
        start = 2035;
        end = 2064;
        period = "Mid-Century";
        break;
      case "endcentury":
        start = 2070;
        end = 2099;
        period = "End of Century";
        break;
      case "custom":
        start = items[startYear_selectedIndex].text;
        end = filteredItems[endYear_selectedIndex].text;
        period = "";
        break;
      default:
        start = 1961;
        end = 1990;
        period = "Baseline";
    }
    dispatch("change", { period, range: [start, end] });
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
  modalHeading="Change Time Period"
  on:submit="{update}"
  on:open
  on:close
>
  <RadioButtonGroup orientation="vertical" bind:selected>
    <RadioButton labelText="Baseline (1961-1990)" value="baseline" />
    {#if !historicalOnly}
      <RadioButton labelText="Mid-Century (2035-2064)" value="midcentury" />
      <RadioButton labelText="End-Century (2070-2099)" value="endcentury" />
    {/if}
    <RadioButton labelText="Enter custom year range" value="custom" />
  </RadioButtonGroup>

  {#if selected === "custom"}
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

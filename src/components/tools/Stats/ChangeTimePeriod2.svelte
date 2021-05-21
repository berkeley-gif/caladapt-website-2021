<script>
  import { createEventDispatcher } from 'svelte';
  import { range } from 'd3-array';
  import {
    RadioButtonGroup,
    RadioButton,
    ComboBox,
    Modal,
  } from 'carbon-components-svelte';

  export let isHistorical = true;
  export let seriesList;
  export let periodList;
  export let seriesId;
  export let periodId;
  export let open = false;

  let yearRange;

  const dispatch = createEventDispatcher();
  if (isHistorical) {
    yearRange = range(1950, 2006, 1);
  } else {
    yearRange = range(2006, 2100, 1);
  }
  
  const items = yearRange.map(d => ({ id: d, text: `${d}` }));

  let startYear_selectedIndex = -1;
  let endYear_selectedIndex = -1;
  let filteredItems;

  function updateLinkedList() {
    if (startYear_selectedIndex < 0) {
      filteredItems = items;
      endYear_selectedIndex = -1
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
    let start;
    let end;
    if (periodId === 'custom') {
      start = items[startYear_selectedIndex].text;
      end = filteredItems[endYear_selectedIndex].text;
    } else {
      const period = periodList.find(d => d.id === periodId);
      start = period.start;
      end = period.end;
    }
    dispatch('change', {
      seriesId,
      periodId,
      range: [start, end],
    });
  };
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
  on:click:button--secondary={() => (open = false)}
  bind:open
  modalHeading="Change Stats"
  on:submit={update}
  on:close={() => dispatch('cancel')}>
    <h5>Select Series</h5>
    <RadioButtonGroup bind:selected={seriesId}>
      {#each seriesList as opt}
        <RadioButton labelText={opt.label} value={opt.id} />
      {/each}
    </RadioButtonGroup>
    <h5>Select Time Period</h5>
    <RadioButtonGroup bind:selected={periodId}>
      {#each periodList as opt}
        <RadioButton labelText={opt.label} value={opt.id} />
      {/each}
      <RadioButton labelText="Enter custom year range" value="custom" />
    </RadioButtonGroup>

    {#if periodId === 'custom'}
      <div class='year-select'>
        <ComboBox
          bind:selectedIndex={startYear_selectedIndex}
          titleText="Start"
          placeholder="Select start year"
          items={items}
          {shouldFilterItem}
        />
        <ComboBox
          bind:selectedIndex={endYear_selectedIndex}
          titleText="End"
          placeholder="Select end year"
          items={filteredItems}
        />
      </div>
    {/if}

    <p style="margin-top:1.5rem;">
      <strong>Scientists recommend looking at a period of at least a few decades like a 30 year period.</strong>
    </p>
    <p>
      Future climate projections express natural climate variability. If you analyze just a few years of a future climate projection, you might happen to select years that are anomalous. Analyzing a longer time selected gives you a better sense of overall future conditions.
    </p>  
</Modal>


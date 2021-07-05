<script>
  import { timeFormat } from 'd3-time-format';
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    DatePickerInput,
  } from 'carbon-components-svelte';

  export let value;

  $: placeholder = timeFormat('%m/%d')(value);

  let DatePicker;
  const dispatch = createEventDispatcher();

  function change(e) {
    dispatch('change', e.detail.selectedDates[0]);
  }

  // DatePicker ability to append to HTML body throws a document node defined
  // error everytime component is rebuild
  // https://github.com/IBM/carbon-components-svelte/issues/522
  onMount(async() => {
    const module = await import('carbon-components-svelte/src/DatePicker/DatePicker.svelte');
    DatePicker = module.default;
  });
</script>

<div class="doy-select">
  <svelte:component
    this={DatePicker}
    datePickerType="single"
    dateFormat="m/d"
    on:change={change}>
      <DatePickerInput
        hideLabel
        {placeholder}
        pattern="\\d{1,2}\\/\\d{1,2}" />
  </svelte:component>
</div>
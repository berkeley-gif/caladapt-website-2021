<script>
  import { createEventDispatcher } from 'svelte';
  import {
    DatePicker,
    DatePickerInput,
  } from 'carbon-components-svelte';

  export let value = '7/04';

  const dispatch = createEventDispatcher();

  function change(e) {
    dispatch('change', e.detail.selectedDates[0]);
  }
</script>

<style>
  .flatpickr-calendar .numInputWrapper {
    display: none;
  }
</style>


<div class="doy-select">
  <DatePicker
    {value}
    datePickerType="single"
    dateFormat="m/d"
    on:change={change}>
    <DatePickerInput
      hideLabel
      placeholder={value}
      pattern="\\d{1,2}\\/\\d{1,2}" />
  </DatePicker>  
</div>
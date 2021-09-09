<script>
  import { timeFormat, timeParse } from "d3-time-format";
  import { createEventDispatcher } from "svelte";
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";

  export let value;
  export let labelText;
  export let formatFn = timeFormat("%m/%d");

  $: placeholder = formatFn(value);

  const dispatch = createEventDispatcher();

  function change(e) {
    dispatch("change", timeParse("%m/%d")(e.detail));
  }
</script>

<style>
</style>

<div class="doy-select">
  <DatePicker dateFormat="m/d" on:change="{change}">
    <DatePickerInput
      labelText="{labelText}"
      placeholder="{placeholder}"
      pattern="\\d{(1, 2)}\\/\\d{(1, 2)}"
    />
  </DatePicker>
</div>

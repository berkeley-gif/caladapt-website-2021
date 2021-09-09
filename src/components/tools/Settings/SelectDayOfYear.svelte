<script>
  import { timeFormat } from "d3-time-format";
  import { createEventDispatcher } from "svelte";
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";

  export let value;
  export let labelText;
  export let formatStr = timeFormat("%-m/%-d");

  let invalid = false;
  $: placeholder = timeFormat(formatStr)(value);

  const dispatch = createEventDispatcher();

  function isDateValid(m, d) {
    const daysInMonth = new Date(2020, m, 0).getDate();
    return typeof d === "number" && d <= daysInMonth;
  }

  function isMonthValid(m) {
    return typeof m === "number" && m > 0 && m <= 12;
  }

  function change(e) {
    console.log("change 1", e.detail);
    const parts = e.detail.split("/");
    const month = +parts[0];
    const date = +parts[1];
    const monthValid = isMonthValid(month);
    const dateValid = isDateValid(month, date);
    if (monthValid && dateValid) {
      invalid = false;
      dispatch("change", new Date(2020, month - 1, date));
    } else {
      invalid = true;
    }
  }
</script>

<style>
  :global(.bx--date-picker.bx--date-picker--simple .bx--date-picker__input) {
    width: 100%;
  }

  :global(.bx--date-picker.bx--date-picker--simple .bx--label) {
    width: 100%;
  }
</style>

<div class="doy-select">
  <DatePicker dateFormat="m/d" on:change="{change}">
    <DatePickerInput
      invalid="{invalid}"
      invalidText="{`Invalid date. 3/24 is an example of a valid date.`}"
      labelText="{labelText}"
      placeholder="{placeholder}"
      pattern="\\d{(1, 2)}\\/\\d{(1, 2)}"
    />
  </DatePicker>
</div>

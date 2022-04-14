<script>
  import {
    Button,
    RadioButton,
    RadioButtonGroup,
    Search,
  } from "carbon-components-svelte";

  const buttonText = "Generate Snapshot".toUpperCase();
  const searchLabelText = "Search for a place or address";
  const radioLegendText = "Select a location type to search for";
  const radios = [
    {
      label: "Address",
      value: "address",
    },
    {
      label: "County",
      value: "county",
    },
    {
      label: "City",
      value: "city",
    },
    {
      label: "Census Tract",
      value: "census-tract",
    },
    {
      label: "Watershed (HUC10)",
      value: "watershed",
    },
  ];

  let isValid = false;
  let selectedRadio = "address";

  $: console.log("selected radio: ", selectedRadio);
</script>

<style>
  p {
    font-size: 1.25rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
</style>

<p>
  Start by selecting a location using either the search box or map. To find a
  specific location, enter an address or zipcode into the search box, or click
  on the map. To select a geographic area, first choose one of the County, City,
  Census Tract or Watershed boundary options.
</p>

<form on:submit|preventDefault>
  <Search placeholder="{searchLabelText}" labelText="{searchLabelText}" />
  <RadioButtonGroup
    bind:selected="{selectedRadio}"
    legendText="{radioLegendText}"
  >
    {#each radios as { label, value }}
      <RadioButton labelText="{label}" value="{value}" />
    {/each}
  </RadioButtonGroup>
  <Button disabled="{!isValid}" size="field" type="submit">{buttonText}</Button>
</form>

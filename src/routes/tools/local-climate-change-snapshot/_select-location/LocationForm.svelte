<script>
  import { Search } from "@berkeley-gif/cal-adapt-svelte-components";
  import {
    Button,
    InlineNotification,
    RadioButton,
    RadioButtonGroup,
  } from "carbon-components-svelte";
  import { debounce } from "~/helpers/utilities";
  import { logException } from "~/helpers/logging";
  import { BOUNDARY_TYPE_SELECTIONS } from "../_constants";
  import {
    handleAbortFetch,
    geocodeSearch,
    formatSearchResult,
  } from "./geocode-search";

  /** the selected location's data as chosen by the user, this could also be set by the map */
  export let selectedLocation = null;

  /** the value of the search box */
  export let searchValue = "";

  /** the selected radio button boundary type */
  export let selectedRadio = "locagrid";

  const buttonText = "Generate Snapshot".toUpperCase();
  const inputDebounceMS = 350;
  const minSearchLength = 3;
  const searchLabelText = "Search for a place name or address";
  const radioLegendText = "Select the type of location to search for";

  let searchSuggestions = [];
  let abortController;
  let notFound = false;
  let showError = false;

  $: isValid = selectedLocation !== null && !notFound;

  $: if (searchValue === "") {
    notFound = false;
    selectedLocation = null;
    searchSuggestions = [];
  }

  $: if (searchValue && searchValue.length && showError) {
    showError = false;
  }

  $: if (selectedLocation && notFound) {
    notFound = false;
  }

  function handleBtnClick() {
    if (!searchValue) {
      showError = true;
    }
  }

  function handleRadioChange(event) {
    if (event.isTrusted) {
      abortController = handleAbortFetch(abortController);
      searchValue = "";
    }
  }

  function handleSearchSelect(event) {
    selectedLocation = event.detail;
  }

  function handleSearchInput() {
    if (searchValue.length >= minSearchLength) {
      abortController = handleAbortFetch(abortController);
      handleGeocodeSearch();
    } else {
      searchSuggestions = [];
    }
  }

  async function handleGeocodeSearch() {
    let results;
    notFound = false;
    try {
      results = await geocodeSearch(searchValue, {
        boundaryType: selectedRadio,
        signal: abortController.signal,
      });
    } catch (error) {
      console.warn(error);
      logException(
        `lccs geocodeSearch error for ${searchValue} and ${selectedRadio}`
      );
    }
    if (results && results.features && results.features.length) {
      searchSuggestions = formatSearchResult(results, selectedRadio);
    } else {
      searchSuggestions = [];
      notFound = true;
    }
  }
</script>

<style lang="scss">
  p {
    font-size: 1.25rem;
    margin-bottom: 3rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    :global(.cac--search) {
      max-width: 80ch;
    }

    :global(legend.bx--label) {
      font-size: 1rem;
    }
  }

  .location-form--help-text {
    min-height: 5rem;
  }
</style>

<p>
  Start by selecting a location using either the search box or map. To find a
  specific location, enter an address or zipcode into the search box, or click
  on the map. To select a geographic area, first choose one of the County, City,
  Census Tract or Watershed boundary options.
</p>

<form on:submit|preventDefault>
  <Search
    bind:searchValue
    on:input="{debounce(handleSearchInput, inputDebounceMS)}"
    on:select
    on:select="{handleSearchSelect}"
    description="{searchLabelText}"
    suggestions="{searchSuggestions}"
    outlineColor="var(--gray-90)"
  />

  <RadioButtonGroup
    bind:selected="{selectedRadio}"
    legendText="{radioLegendText}"
  >
    {#each BOUNDARY_TYPE_SELECTIONS as { label, value }}
      <RadioButton
        on:change="{handleRadioChange}"
        labelText="{label}"
        value="{value}"
      />
    {/each}
  </RadioButtonGroup>

  <div class="location-form--help-text" aria-live="polite">
    {#if showError}
      <InlineNotification
        lowContrast="{true}"
        hideCloseButton="{true}"
        kind="error"
        title="Error:"
        subtitle="Please select a location to continue."
      />
    {/if}

    {#if notFound}
      <InlineNotification
        lowContrast="{true}"
        hideCloseButton="{true}"
        kind="warning"
        title="Location not found."
        subtitle="Please try a different search."
      />
    {/if}

    {#if isValid}
      <InlineNotification
        lowContrast="{true}"
        hideCloseButton="{true}"
        kind="success"
        title="Location found."
        subtitle="Click the Generate Snapshot button to continue."
      />
    {/if}
  </div>

  <Button
    on:click="{handleBtnClick}"
    aria-disabled="{!isValid}"
    size="field"
    type="submit">{buttonText}</Button
  >
</form>

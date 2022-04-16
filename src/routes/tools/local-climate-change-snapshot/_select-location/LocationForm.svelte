<script>
  import { Search } from "@berkeley-gif/cal-adapt-svelte-components";
  import {
    Button,
    InlineNotification,
    RadioButton,
    RadioButtonGroup,
  } from "carbon-components-svelte";
  import { getTitle } from "~/helpers/geocode";
  import { debounce } from "~/helpers/utilities";
  import { geocodeSearch } from "./geocode-search";

  /** the selected location's data as chosen by the user, this could also be set by the map */
  export let selectedLocation = null;

  /** the value of the search box */
  export let searchValue = "";

  /** the selected radio button boundary type */
  export let selectedRadio = "address";

  const buttonText = "Generate Snapshot".toUpperCase();
  const inputDebounceMS = 300;
  const minSearchLength = 3;
  const searchLabelText = "Search for a place name or address";
  const radioLegendText = "Select the type of location to search for";
  const radios = [
    {
      label: "Address",
      value: "address",
    },
    {
      label: "County",
      value: "counties",
    },
    {
      label: "City",
      value: "place",
    },
    {
      label: "Census Tract",
      value: "censustracts",
    },
    {
      label: "Watershed (HUC10)",
      value: "hydrounits",
    },
  ];

  let searchSuggestions = [];
  let abortController;
  let notFound = false;

  $: isValid = selectedLocation !== null && !notFound;

  $: if (searchValue === "") {
    notFound = false;
    selectedLocation = null;
    searchSuggestions = [];
  }

  $: {
    console.log("searchSuggestions: ", searchSuggestions);
    console.log("selectedLocation: ", selectedLocation);
  }

  function handleRadioChange() {
    handleAbortFetch();
    searchValue = "";
    searchSuggestions = [];
    selectedLocation = null;
  }

  function handleAbortFetch() {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
  }

  function handleSearchSelect(event) {
    selectedLocation = event.detail;
  }

  function handleSearchInput() {
    if (searchValue.length >= minSearchLength) {
      handleAbortFetch();
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
    }
    if (results && results.features && results.features.length) {
      searchSuggestions = parseSearchResults(results.features);
    } else {
      searchSuggestions = [];
      notFound = true;
    }
  }

  function parseSearchResults(searchResults) {
    return searchResults.map(
      selectedRadio === "address" ? mapAddressResults : mapBoundaryResults
    );
  }

  function mapAddressResults({ id, place_name, ...rest }) {
    return {
      id,
      title: place_name,
      ...rest,
    };
  }

  function mapBoundaryResults(feature) {
    return {
      id: feature.id,
      title: getTitle(feature, selectedRadio, ""),
      ...feature,
    };
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
    gap: 3rem;

    :global(.cac--search) {
      max-width: 80ch;
    }

    :global(legend.bx--label) {
      font-size: 1rem;
    }

    :global(.bx--search-input::placeholder) {
      color: var(--gray-80);
    }
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
    on:change="{handleRadioChange}"
    legendText="{radioLegendText}"
  >
    {#each radios as { label, value }}
      <RadioButton labelText="{label}" value="{value}" />
    {/each}
  </RadioButtonGroup>

  {#if notFound}
    <InlineNotification
      lowContrast="{true}"
      hideCloseButton="{true}"
      kind="error"
      subtitle="Location not found. Please try a different search."
    />
  {/if}

  {#if isValid}
    <p>
      <strong>
        Next, click the Generate Snapshot button to view climate data for
        {searchValue}.
      </strong>
    </p>
  {/if}

  <Button disabled="{!isValid}" size="field" type="submit">{buttonText}</Button>
</form>

<script>
  import { Search } from "@berkeley-gif/cal-adapt-svelte-components";
  import {
    Button,
    RadioButton,
    RadioButtonGroup,
  } from "carbon-components-svelte";
  import { getTitle } from "~/helpers/geocode";
  import { debounce } from "~/helpers/utilities";
  import { geocodeSearch } from "./geocode-search";

  /** the selected location's data as chosen by the user, this could also be set by the map */
  export let selectedLocation = null;

  const buttonText = "Generate Snapshot".toUpperCase();
  const inputDebounceMS = 300;
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

  let selectedRadio = "address";

  let searchBox;
  let searchValue = "";
  let searchSuggestions = [];

  let abortController;

  $: {
    console.log("selectedLocation: ", selectedLocation);
    console.log("selected radio: ", selectedRadio);
    console.log("searchSuggestions: ", searchSuggestions);
  }

  $: isValid = selectedLocation !== null;

  $: if (searchValue === "" && (selectedLocation || searchSuggestions.length)) {
    selectedLocation = null;
    searchSuggestions = [];
  }

  function handleRadioChange() {
    handleAbortFetch();
    clearSearch();
  }

  function clearSearch() {
    console.log("clear search");
    if (searchBox) {
      searchBox.clearSearch();
    }
  }

  function handleAbortFetch() {
    console.log("abort fetch request");
    if (abortController) {
      abortController.abort();
    }
  }

  function handleSearchSelect(event) {
    console.log("Search selection made: ", event.detail);
    selectedLocation = event.detail;
  }

  function handleSearchInput() {
    if (searchValue.length >= 3) {
      handleAbortFetch();
      abortController = new AbortController();
      handleGeocodeSearch();
    } else {
      searchSuggestions = [];
    }
  }

  async function handleGeocodeSearch() {
    let results;
    try {
      results = await geocodeSearch(searchValue, {
        boundaryType: selectedRadio,
        signal: abortController.signal,
      });
    } catch (error) {
      console.warn(error);
    }
    if (results && results.features && results.features.length) {
      searchSuggestions = parseSearchResults(results.features, selectedRadio);
    } else {
      searchSuggestions = [];
    }
  }

  function parseSearchResults(searchResults, boundaryType) {
    const mapAddressResults = ({ id, place_name, ...rest }) => ({
      id,
      title: place_name,
      ...rest,
    });
    const mapBoundaryResults = (feature) => ({
      id: feature.id,
      title: getTitle(feature, boundaryType, ""),
      ...feature,
    });
    return searchResults.map(
      boundaryType === "address" ? mapAddressResults : mapBoundaryResults
    );
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
    bind:this="{searchBox}"
    bind:searchValue
    on:input="{debounce(handleSearchInput, inputDebounceMS)}"
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

  <Button disabled="{!isValid}" size="field" type="submit">{buttonText}</Button>
</form>

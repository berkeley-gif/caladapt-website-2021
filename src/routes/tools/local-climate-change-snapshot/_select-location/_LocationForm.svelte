<script>
  import { Search } from "@berkeley-gif/cal-adapt-svelte-components";
  import {
    Button,
    RadioButton,
    RadioButtonGroup,
  } from "carbon-components-svelte";
  import { getTitle } from "~/helpers/geocode";
  import { debounce } from "~/helpers/utilities";
  import { geocodeAddress, geocodeBoundary } from "./_fetchLocation";

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

  let isValid = false;
  let selectedRadio = "address";

  let searchBox;
  let searchValue = "";
  let searchSuggestions = [];

  let abortController;

  $: {
    console.log("selected radio: ", selectedRadio);
    console.log("searchSuggestions: ", searchSuggestions);
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
    searchSuggestions = [];
  }

  function handleAbortFetch() {
    console.log("abort fetch request");
    if (abortController) {
      abortController.abort();
    }
  }

  function handleSearchSelect(event) {
    console.log("Search selection made: ", event.detail);
    // TODO: dispatch selected suggestion
  }

  function handleSearchInput() {
    if (searchValue.length >= 3) {
      handleAbortFetch();
      abortController = new AbortController();
      if (selectedRadio === "address") {
        handleAddressSearch(searchValue);
      } else {
        handleBoundarySearch(searchValue, selectedRadio);
      }
    } else {
      searchSuggestions = [];
    }
  }

  async function handleAddressSearch(string) {
    console.log("address search: ", string);
    let results;
    try {
      results = await geocodeAddress(string, {
        signal: abortController.signal,
      });
      console.log(results);
    } catch (error) {
      console.warn(error);
    }
    if (results && results.features && results.features.length) {
      searchSuggestions = results.features.map(
        ({ id, place_name, ...rest }) => ({
          id,
          title: place_name,
          ...rest,
        })
      );
    } else {
      searchSuggestions = [];
    }
  }

  async function handleBoundarySearch(string, boundaryType) {
    console.log("boundary search: ", string, boundaryType);
    let results;
    try {
      results = await geocodeBoundary(string, {
        boundaryType,
        signal: abortController.signal,
      });
      console.log(results);
    } catch (error) {
      console.warn(error);
    }
    if (results && results.features && results.features.length) {
      searchSuggestions = results.features.map((feature) => ({
        id: feature.id,
        title: getTitle(feature, boundaryType, ""),
        ...feature,
      }));
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

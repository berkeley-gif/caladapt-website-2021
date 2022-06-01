<script>
  import { createEventDispatcher } from "svelte";
  import { InlineLoading } from "carbon-components-svelte";
  import Search from "@berkeley-gif/cal-adapt-svelte-components/Search/Search.svelte";

  import { debounce } from "~/helpers/utilities";
  import { logException, logGetFeatureErr } from "~/helpers/logging";
  import { getFeature, getNearestFeature } from "~/helpers/geocode";

  import { formatSearchResult, geocodeSearch, handleAbortFetch } from "./utils";

  export let isStationSelector = false;
  export let currentLayer = null;
  export let currentBoundary = null;
  export let stationsLayerId = null;

  const dispatch = createEventDispatcher();

  const MIN_SEARCH_TEXT_LENGTH = 3;
  const SEARCH_INPUT_DEBOUNCE_MS = 350;

  let abortController;
  let isSearching = false;
  let searchValue = "";
  let searchPlaceholder = "Enter place name or address";
  let suggestions = [];

  $: currentLayer, handleClearSearch();
  $: currentBoundary, updatePlaceholderText();

  function updatePlaceholderText() {
    if (
      currentBoundary &&
      currentBoundary.metadata &&
      currentBoundary.metadata.placeholder
    ) {
      searchPlaceholder = `Enter ${currentBoundary.metadata.placeholder}`;
    }
  }

  function handleClearSearch() {
    suggestions = [];
    searchValue = "";
  }

  function handleSearchInput() {
    if (searchValue.length >= MIN_SEARCH_TEXT_LENGTH) {
      abortController = handleAbortFetch(abortController);
      handleGeocodeSearch();
    } else {
      suggestions = [];
    }
  }

  async function handleGeocodeSearch() {
    const { id: boundaryType } = currentLayer;
    try {
      isSearching = true;

      let results = await geocodeSearch(searchValue, {
        boundaryType,
        signal: abortController.signal,
        isStationLayer: isStationSelector,
      });

      if (results && results.features && results.features.length) {
        suggestions = formatSearchResult(
          results,
          boundaryType,
          isStationSelector
        );
      } else {
        suggestions = [];
      }
    } catch (error) {
      console.warn(error);
      logException(
        `lccs geocodeSearch error for ${searchValue} and ${boundaryType}`
      );
    } finally {
      isSearching = false;
    }
  }

  async function handleSearchSelect({ detail }) {
    let result;
    if (isStationSelector || currentLayer.id === "locagrid") {
      try {
        result = isStationSelector
          ? await getNearestFeature(
              detail.center[0],
              detail.center[1],
              stationsLayerId
            )
          : await getFeature(detail, currentLayer.id);
        searchValue = result.title;
      } catch (error) {
        logGetFeatureErr(detail.center, currentLayer && currentLayer.id);
        console.error(error.message);
      }
    } else {
      result = detail;
    }
    if (result) {
      dispatch("select", result);
    }
    suggestions = [];
  }
</script>

<style>
  .search-box-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    position: absolute;
    left: 0.75rem;
    top: 0.75rem;
    right: 3rem;

    z-index: 3;
  }

  .search-box {
    width: 100%;
  }

  .search-status {
    width: 2rem;
  }
</style>

<div class="search-box-wrapper">
  <div class="search-box">
    <Search
      bind:searchValue
      on:select="{handleSearchSelect}"
      on:input="{debounce(handleSearchInput, SEARCH_INPUT_DEBOUNCE_MS)}"
      on:clear="{handleClearSearch}"
      description="{searchPlaceholder}"
      suggestions="{suggestions}"
      outlineColor="var(--gray-90)"
    />
  </div>

  <div class="search-status">
    {#if isSearching}
      <InlineLoading />
    {/if}
  </div>
</div>

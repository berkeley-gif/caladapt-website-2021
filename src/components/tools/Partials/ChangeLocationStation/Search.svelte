<script>
  import { createEventDispatcher } from "svelte";
  import Search from "@berkeley-gif/cal-adapt-svelte-components/Search/Search.svelte";

  import { debounce } from "~/helpers/utilities";
  import { logException, logGetFeatureErr } from "~/helpers/logging";
  import { getFeature, getNearestFeature } from "~/helpers/geocode";

  import { formatSearchResult, geocodeSearch, handleAbortFetch } from "./utils";

  export let isStationSelector = false;
  export let currentBoundary = null;
  export let searchPlaceholder = "";
  export let stationsLayerId = null;

  const dispatch = createEventDispatcher();

  const MIN_SEARCH_TEXT_LENGTH = 3;
  const SEARCH_INPUT_DEBOUNCE_MS = 350;

  let suggestions = [];
  let searchValue = "";
  let abortController;

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
    const { id: boundaryType } = currentBoundary;
    try {
      let results = await geocodeSearch(searchValue, {
        boundaryType,
        signal: abortController.signal,
      });
      if (results && results.features && results.features.length) {
        suggestions = formatSearchResult(results, boundaryType);
      } else {
        suggestions = [];
      }
    } catch (error) {
      console.warn(error);
      logException(
        `lccs geocodeSearch error for ${searchValue} and ${boundaryType}`
      );
    }
  }

  async function handleSearchSelect({ detail }) {
    let result;
    if (currentBoundary.id === "locagrid") {
      try {
        result = isStationSelector
          ? await getNearestFeature(
              detail.center[0],
              detail.center[1],
              stationsLayerId
            )
          : await getFeature(detail, currentBoundary.id);
      } catch (error) {
        logGetFeatureErr(detail.center, currentBoundary && currentBoundary.id);
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
  div {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 3;
    box-shadow: var(--box-shadow);
    width: 50ch;
  }
</style>

<div>
  <Search
    bind:searchValue
    on:select="{handleSearchSelect}"
    on:input="{debounce(handleSearchInput, SEARCH_INPUT_DEBOUNCE_MS)}"
    on:clear="{handleClearSearch}"
    description="{searchPlaceholder}"
    suggestions="{suggestions}"
  />
</div>

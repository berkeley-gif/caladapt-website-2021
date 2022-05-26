<script>
  import { createEventDispatcher } from "svelte";
  import { InlineLoading, Search, Modal } from "carbon-components-svelte";
  // import Search from "@berkeley-gif/cal-adapt-svelte-components/Search/Search.svelte";

  import {
    getFeature,
    getNearestFeature,
    searchFeature,
  } from "~/helpers/geocode";
  import { logException, logGetFeatureErr } from "~/helpers/logging";
  import { DEFAULT_LOCATION } from "~/routes/tools/_common/constants";

  import Boundary from "./Boundary.svelte";
  import LocationMap from "./Map.svelte";
  import Suggestions from "./Suggestions.svelte";

  export let location;
  export let enableUpload = false;
  export let addStateBoundary = false;
  export let boundary;
  export let boundaryList;
  export let stationsLayer;
  export let open = false;

  const dispatch = createEventDispatcher();

  let isStationSelector = Boolean(stationsLayer);

  let helpText = isStationSelector
    ? `Select a station on the map or enter an address in the search box to 
        select the nearest station.`
    : `Click on the map or enter an address in the search box. To explore data
        for a larger extent (e.g. county), select a boundary first.`;

  let headingTitleText = isStationSelector
    ? "Change Station"
    : "Change Location";

  let currentLocation = location;
  let currentBoundary = boundary;

  let geocodeResults = [];

  let searchValue = "";
  let searchPlaceholder = isStationSelector
    ? "Enter place name or address"
    : boundary
    ? boundary.metadata.placeholder
    : null;

  let isSearching = false;
  let showSuggestions = false;

  async function search({ key }) {
    if (key === "Escape") {
      clearSearch();
      return;
    }
    if (key !== "Enter") return;
    const layer = isStationSelector ? stationsLayer : currentBoundary;
    isSearching = true;
    showSuggestions = false;
    geocodeResults.length = 0;
    try {
      geocodeResults = await searchFeature(searchValue, layer.id);
      // Add groupname for results from all geocoders
      geocodeResults &&
        geocodeResults.forEach((item) => {
          if (item.geocoder === "caladapt") {
            item.category = layer.metadata.title;
          } else {
            item.category = "Places & Addresses";
          }
        });
    } catch (error) {
      console.error(error.message);
      logException(
        `searchFeature failed: ${searchValue}, ${layer && layer.id}`
      );
    } finally {
      isSearching = false;
      showSuggestions = true;
    }
  }

  function clearSearch() {
    geocodeResults.length = 0;
    searchValue = "";
    showSuggestions = false;
  }

  async function selectSuggestion(opt) {
    if (opt && opt.geocoder === "mapbox") {
      try {
        currentLocation = isStationSelector
          ? await getNearestFeature(
              opt.center[0],
              opt.center[1],
              stationsLayer.id
            )
          : await getFeature(opt, currentBoundary.id);
      } catch (error) {
        logGetFeatureErr(opt.center, currentBoundary && currentBoundary.id);
        console.error(error.message);
      }
    } else {
      currentLocation = opt;
    }
    clearSearch();
  }

  async function change() {
    open = false;
    dispatch("change", {
      ...(currentBoundary && { boundaryId: currentBoundary.id }),
      location: currentLocation,
    });
  }

  // NOTE: a side effect of the boundary type being updated is that it changes
  // the value of the currentLocation reactive variable
  async function updateBoundary({ detail }) {
    if (!detail) return;

    const {
      id,
      metadata: { placeholder },
    } = detail;
    currentBoundary = detail;
    searchPlaceholder = `Enter ${placeholder}`;

    // Set current location after current boundary has changed
    // first attempt an intersection spatial query
    try {
      let intersectingFeature = await getFeature(currentLocation, id);
      if (intersectingFeature) {
        currentLocation = intersectingFeature;
        return;
      }
    } catch (error) {
      logGetFeatureErr(currentLocation && currentLocation.center, id);
      console.error(error.message);
    }

    // if intersection fails, try a nearest neighbor spatial query
    // most likey this is for when id === "place"
    if (id === "place") {
      try {
        const {
          center: [lng, lat],
        } = currentLocation;
        let nearest = await getNearestFeature(lng, lat, id);
        if (nearest) {
          currentLocation = nearest;
          return;
        }
      } catch (error) {
        logException(
          `getNearestFeature failed: ${
            currentLocation &&
            currentLocation.center &&
            currentLocation.center.join(",")
          }`
        );
        console.error(error.message);
      }
    }

    // as a last resort use the default location's center to set the current location
    try {
      let defaultLocation = await getFeature(
        { center: DEFAULT_LOCATION.center },
        id
      );
      if (defaultLocation) {
        currentLocation = defaultLocation;
      }
    } catch (error) {
      logGetFeatureErr(DEFAULT_LOCATION.center, id);
      console.error(error.message);
    }
  }

  function handleMapClick(e) {
    if (e.detail && typeof e.detail === "object") {
      currentLocation = e.detail;
    }
  }

  function uploadBoundary(e) {
    currentBoundary = { id: "custom" };
    currentLocation = e.detail.location;
  }

  function clearUpload() {
    currentLocation = location;
    if (currentBoundary.id === "custom") {
      currentBoundary = boundary;
    }
  }

  function cancel() {
    currentLocation = location;
    currentBoundary = boundary;
    open = false;
  }
</script>

<style lang="scss">
  .change-location {
    position: relative;

    .search-control {
      position: absolute;
      left: 10px;
      top: 10px;
      z-index: 3;
      box-shadow: var(--box-shadow);
      width: 50ch;
    }

    .search-status {
      position: absolute;
      z-index: 2;
      left: 13rem;
      top: 10px;
      z-index: 3;
    }
  }
</style>

<Modal
  bind:open
  on:click:button--secondary="{cancel}"
  on:submit="{change}"
  on:open
  on:close
  preventCloseOnClickOutside
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  modalHeading="{headingTitleText}"
  shouldSubmitOnEnter="{false}"
>
  <div>
    <p>{helpText}</p>
    {#if !isStationSelector}
      <Boundary
        on:upload="{uploadBoundary}"
        on:change="{updateBoundary}"
        on:clear="{clearUpload}"
        enableUpload="{enableUpload}"
        currentBoundary="{currentBoundary}"
        boundaryList="{boundaryList}"
        addStateBoundary="{addStateBoundary}"
      />
    {/if}
    <div class="change-location">
      <div class="search-control">
        <Search
          bind:value="{searchValue}"
          on:keydown="{search}"
          on:clear="{clearSearch}"
          size="sm"
          id="location-search"
          labelText="{searchPlaceholder}"
          placeholder="{searchPlaceholder}"
        />
        {#if showSuggestions}
          <Suggestions {...{ geocodeResults, selectSuggestion, clearSearch }} />
        {/if}
      </div>
      {#if isSearching}
        <div class="search-status">
          <InlineLoading />
        </div>
      {/if}

      <!-- <div class="search-control">
        <Search
          bind:searchValue
          on:select
          on:input
          description="{searchPlaceholder}"
          suggestions="{geocodeResults}"
          debug="{true}"
        />
      </div> -->

      {#if isSearching}
        <div class="search-status">
          <InlineLoading />
        </div>
      {/if}

      <LocationMap
        on:click="{handleMapClick}"
        {...{ currentLocation, currentBoundary, stationsLayer }}
      />
    </div>
  </div>
</Modal>

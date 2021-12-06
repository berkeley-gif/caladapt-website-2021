<script>
  import { createEventDispatcher } from "svelte";
  import { InlineLoading, Search, Modal } from "carbon-components-svelte";
  import getBbox from "@turf/bbox";

  import {
    getFeature,
    getNearestFeature,
    getStationById,
    searchFeature,
    reverseGeocode,
    getNearestPlace,
    getTitle,
  } from "~/helpers/geocode";

  import { SelectBoundary, UploadBoundary } from "~/components/tools/Settings";
  import { Location } from "~/components/tools/Location";
  import { DEFAULT_LOCATION } from "~/routes/tools/_common/constants";

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
  let currentLoc = location;
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

  async function mapClick({ detail: center }) {
    const { id } = currentBoundary;
    let newLocation;
    try {
      newLocation = await getFeature({ center }, id);
    } catch (e) {
      console.error(e.message);
    }
    if (newLocation) {
      currentLoc = newLocation;
    }
  }

  async function overlayClick(e) {
    currentLoc = await getStationById(e.detail, stationsLayer.id);
    currentLoc.bbox = getBbox(currentLoc.geometry);
  }

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
    geocodeResults = await searchFeature(searchValue, layer.id);
    // Add groupname for results from all geocoders
    geocodeResults.forEach((item) => {
      if (item.geocoder === "caladapt") {
        item.category = layer.metadata.title;
      } else {
        item.category = "Places & Addresses";
      }
    });
    isSearching = false;
    showSuggestions = true;
  }

  function clearSearch() {
    geocodeResults.length = 0;
    searchValue = "";
    showSuggestions = false;
  }

  // NOTE: a side effect of the boundary type being updated is that it changes
  // the value of the currentLoc reactive variable
  async function updateBoundary(event) {
    if (!event.detail) return;
    currentBoundary = event.detail;
    const { id } = currentBoundary;
    let intersectingFeature;
    let nearest;
    let defaultLocation;
    searchPlaceholder = `Enter ${currentBoundary.metadata.placeholder}`;

    // first attempt an intersection spatial query
    try {
      intersectingFeature = await getFeature(currentLoc, id);
    } catch (error) {
      console.error(error.message);
    }
    if (intersectingFeature) {
      currentLoc = intersectingFeature;
      return;
    }
    // most likely this is a place boundary type if no intersection was found
    if (!intersectingFeature && id === "place") {
      try {
        nearest = await getNearestPlace(currentLoc);
      } catch (error) {
        console.error(error.message);
      }
    }
    if (nearest) {
      currentLoc = nearest;
      return;
    }
    // as a last resort use the default location's center to set the current location
    try {
      defaultLocation = await getFeature(
        { center: DEFAULT_LOCATION.center },
        id
      );
    } catch (error) {
      console.error(error.message);
    }
    if (defaultLocation) {
      currentLoc = defaultLocation;
    }
  }

  async function selectSuggestion(opt) {
    if (opt.geocoder === "mapbox") {
      currentLoc = isStationSelector
        ? await getNearestFeature(
            opt.center[0],
            opt.center[1],
            stationsLayer.id
          )
        : await getFeature(opt, currentBoundary.id);
    } else {
      currentLoc = opt;
    }
    clearSearch();
  }

  async function assignLocationTitle(location, boundaryId) {
    const { center } = location;
    const { place_name } = (await reverseGeocode(`${center[0]}, ${center[1]}`))
      .features[0];
    location.title = getTitle(location, boundaryId, place_name);
  }

  function uploadBoundary(e) {
    currentBoundary = { id: "custom" };
    currentLoc = e.detail.location;
  }

  function clearUpload() {
    currentLoc = location;
    currentBoundary = boundary;
  }

  async function change() {
    // get name for locagrid cell here via reverseGeocode
    if (currentBoundary.id === "locagrid" && !currentLoc.title) {
      try {
        await assignLocationTitle(currentLoc, currentBoundary.id);
      } catch (error) {
        console.error(error.message);
      }
    }

    open = false;
    dispatch("change", {
      ...(currentBoundary && { boundaryId: currentBoundary.id }),
      location: currentLoc,
    });
  }

  function cancel() {
    currentLoc = location;
    currentBoundary = boundary;
    open = false;
  }

  function noop() {}
</script>

<style lang="scss">
  .change-boundary {
    margin: 1.5rem 0;
    max-width: 75%;
  }

  .change-location {
    position: relative;

    .search-control {
      position: absolute;
      left: 10px;
      top: 10px;
      z-index: 3;
      box-shadow: var(--box-shadow);
      width: 14rem;
    }

    .search-status {
      position: absolute;
      z-index: 2;
      left: 13rem;
      top: 10px;
      z-index: 3;
    }

    .suggestions-wrapper {
      background-color: var(--white);
      border-radius: 4px;
      position: absolute;
      width: 100%;
      left: 0;
      list-style: none;
      margin: 0;
      padding: 0;
      z-index: 1000;
      overflow: hidden;
      box-shadow: var(--box-shadow);

      .suggestions .suggestion {
        cursor: default;
        display: block;
        padding: 3px 12px;
        color: var(--gray-80);
      }

      .suggestions .suggestion:hover {
        background-color: var(--gray-20);
        text-decoration: none;
        cursor: pointer;
      }

      .suggestion-text {
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 0.8rem;
      }

      .suggestion-category {
        display: block;
        margin: 0.5rem;
        font-size: 0.9rem;
        font-weight: bold;
      }
    }
  }
</style>

<Modal
  preventCloseOnClickOutside
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary="{cancel}"
  bind:open
  modalHeading="{headingTitleText}"
  shouldSubmitOnEnter="{false}"
  on:submit="{change}"
  on:open
  on:close
>
  <div>
    <p>{helpText}</p>
    {#if !isStationSelector}
      <div class="change-boundary">
        <!-- Boundary Selection -->
        <SelectBoundary
          selectedId="{currentBoundary.id}"
          items="{boundaryList}"
          addStateBoundary="{addStateBoundary}"
          on:change="{updateBoundary}"
        />
        {#if enableUpload}
          <UploadBoundary
            on:upload="{uploadBoundary}"
            on:clear="{clearUpload}"
          />
        {/if}
      </div>
    {/if}
    <div class="change-location">
      <!-- Search -->
      <div class="search-control">
        <Search
          size="sm"
          id="location-search"
          labelText="{searchPlaceholder}"
          placeholder="{searchPlaceholder}"
          on:keydown="{search}"
          on:clear="{clearSearch}"
          bind:value="{searchValue}"
        />
        {#if showSuggestions}
          <div class="suggestions-wrapper">
            {#each geocodeResults as item}
              <span class="suggestion-category">{item.category}</span>
              <ul class="suggestions">
                {#if item.data.length > 0}
                  {#each item.data as opt}
                    <li>
                      <div
                        class="suggestion"
                        on:click="{() =>
                          selectSuggestion({
                            ...opt,
                            geocoder: item.geocoder,
                          })}"
                      >
                        <div class="suggestion-text">{opt.title}</div>
                      </div>
                    </li>
                  {/each}
                {:else}
                  <li>
                    <div
                      class="suggestion"
                      on:click="{() => selectSuggestion()}"
                    >
                      <div class="suggestion-nodata">No Results Found</div>
                    </div>
                  </li>
                {/if}
              </ul>
            {/each}
          </div>
        {/if}
      </div>
      {#if isSearching}
        <div class="search-status">
          <InlineLoading />
        </div>
      {/if}
      <!-- Map-->
      <Location
        lng="{currentLoc.center[0]}"
        lat="{currentLoc.center[1]}"
        boundary="{currentBoundary}"
        stations="{stationsLayer}"
        location="{currentLoc}"
        imageOverlayShow="{false}"
        zoomToLocationOnLoad="{!isStationSelector}"
        on:overlayclick="{isStationSelector ? overlayClick : noop}"
        on:mapclick="{isStationSelector ? noop : mapClick}"
        on:ready="{() => dispatch('ready')}"
      />
    </div>
  </div>
</Modal>

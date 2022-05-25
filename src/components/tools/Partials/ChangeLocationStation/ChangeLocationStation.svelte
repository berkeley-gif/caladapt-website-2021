<script>
  import { createEventDispatcher } from "svelte";
  import { InlineLoading, Search, Modal } from "carbon-components-svelte";

  import {
    getFeature,
    getNearestFeature,
    getStationById,
    searchFeature,
    reverseGeocode,
    getTitle,
  } from "~/helpers/geocode";
  import { logException, logGetFeatureErr } from "~/helpers/logging";
  import { Location } from "~/components/tools/Location";
  import { DEFAULT_LOCATION } from "~/routes/tools/_common/constants";

  import Boundary from "./Boundary.svelte";

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

  async function mapClick({ detail: center }) {
    const { id } = currentBoundary;
    let newLocation;
    try {
      newLocation = await getFeature({ center }, id);
    } catch (error) {
      console.error(error.message);
      logGetFeatureErr(center, id);
    }
    if (newLocation) {
      currentLocation = newLocation;
    }
  }

  async function overlayClick({ detail: stationId }) {
    try {
      currentLocation = await getStationById(stationId, stationsLayer.id);
    } catch (error) {
      console.error(error.message);
      logException(`getStationById failed: ${stationId}; ${stationsLayer.id}`);
    }
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

  async function assignLocationTitle(location, boundaryId) {
    const { center } = location;
    const { place_name } = (await reverseGeocode(`${center[0]}, ${center[1]}`))
      .features[0];
    location.title = getTitle(location, boundaryId, place_name);
  }

  async function change() {
    // get name for locagrid cell here via reverseGeocode
    if (
      currentBoundary &&
      currentBoundary.id === "locagrid" &&
      !currentLocation.title
    ) {
      try {
        await assignLocationTitle(currentLocation, currentBoundary.id);
      } catch (error) {
        logException(
          `AssignLocationTitle failed: ${
            currentLocation &&
            currentLocation.center &&
            currentLocation.center.join(",")
          }, ${currentBoundary && currentBoundary.id}`
        );
        console.error(error.message);
      }
    }
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
    const currentBoundary = detail;
    const { id } = currentBoundary;
    let intersectingFeature;
    let nearest;
    let defaultLocation;
    searchPlaceholder = `Enter ${currentBoundary.metadata.placeholder}`;
    // Set current location after current boundary has changed
    // first attempt an intersection spatial query
    try {
      intersectingFeature = await getFeature(currentLocation, id);
    } catch (error) {
      logGetFeatureErr(currentLocation && currentLocation.center, id);
      console.error(error.message);
    }
    if (intersectingFeature) {
      currentLocation = intersectingFeature;
      return;
    }
    // if intersection fails, try a nearest neighbor spatial query
    // most likey this is for when id === "place"
    if (id === "place") {
      try {
        const {
          center: [lng, lat],
        } = currentLocation;
        nearest = await getNearestFeature(lng, lat, id);
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
      if (nearest) {
        currentLocation = nearest;
        return;
      }
    }
    // as a last resort use the default location's center to set the current location
    try {
      defaultLocation = await getFeature(
        { center: DEFAULT_LOCATION.center },
        id
      );
    } catch (error) {
      logGetFeatureErr(DEFAULT_LOCATION.center, id);
      console.error(error.message);
    }
    if (defaultLocation) {
      currentLocation = defaultLocation;
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

  function noop() {}
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
      <Boundary
        on:upload="{uploadBoundary}"
        on:change="{updateBoundary}"
        enableUpload="{enableUpload}"
        currentBoundary="{currentBoundary}"
        boundaryList="{boundaryList}"
        addStateBoundary="{addStateBoundary}"
      />
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
                    <div class="suggestion" on:click="{() => clearSearch()}">
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
        lng="{currentLocation.center[0]}"
        lat="{currentLocation.center[1]}"
        boundary="{currentBoundary}"
        stations="{stationsLayer}"
        location="{currentLocation}"
        imageOverlayShow="{false}"
        zoomToLocationOnLoad="{!isStationSelector}"
        on:overlayclick="{isStationSelector ? overlayClick : noop}"
        on:mapclick="{isStationSelector ? noop : mapClick}"
        on:ready="{() => dispatch('ready')}"
      />
    </div>
  </div>
</Modal>

<script>
  import { createEventDispatcher } from "svelte";
  import { InlineLoading, Search, Modal } from "carbon-components-svelte";

  // Helpers
  import {
    getFeature,
    searchFeature,
    reverseGeocode,
    getNearestFeature,
  } from "../../../helpers/geocode";

  import {
    SelectBoundary,
    UploadBoundary,
  } from "../../../components/tools/Settings";
  import { Location } from "../../../components/tools/Location";

  // Props
  export let location;
  export let enableUpload = false;
  export let addStateBoundary = false;
  export let boundary;
  export let boundaryList;
  export let open = false;

  const dispatch = createEventDispatcher();

  let currentLoc = location;
  let currentBoundary = boundary;
  let geocodeResults = [];
  let searchValue = "";
  let searchPlaceholder = boundary.metadata.placeholder;
  let isSearching = false;
  let showSuggestions = false;

  async function mapClick(e) {
    const addresses = await reverseGeocode(`${e.detail[0]}, ${e.detail[1]}`);
    const feature = addresses.features[0];
    currentLoc = await getFeature(feature, currentBoundary.id);
  }

  function clearSearch() {
    geocodeResults.length = 0;
    searchValue = "";
    showSuggestions = false;
  }

  async function search({ key }) {
    if (key === "Escape") {
      clearSearch();
      return;
    }
    if (key !== "Enter") return;
    isSearching = true;
    showSuggestions = false;
    geocodeResults.length = 0;
    geocodeResults = await searchFeature(searchValue, currentBoundary.id);
    // Add groupname for results from all geocoders
    geocodeResults.forEach((item) => {
      if (item.geocoder === "caladapt") {
        item.category = currentBoundary.metadata.title;
      } else {
        item.category = "Places & Addresses";
      }
    });
    isSearching = false;
    showSuggestions = true;
  }

  async function updateBoundary(e) {
    if (!e.detail) return;
    const [lng, lat] = currentLoc.center || [];
    currentBoundary = e.detail;
    searchPlaceholder = `Enter ${currentBoundary.metadata.placeholder}`;
    const intersectingFeature = await getFeature(
      currentLoc,
      currentBoundary.id
    );
    if (intersectingFeature) {
      currentLoc = intersectingFeature;
    } else {
      const nearestFeature = await getNearestFeature(
        lng,
        lat,
        currentBoundary.id
      );
      currentLoc = nearestFeature;
    }
  }

  async function selectSuggestion(opt) {
    if (opt) {
      if (opt.geocoder === "mapbox") {
        currentLoc = await getFeature(opt, currentBoundary.id);
      } else {
        currentLoc = opt;
      }
    }
    clearSearch();
  }

  function uploadBoundary(e) {
    currentBoundary = { id: "custom" };
    currentLoc = e.detail.location;
  }

  function clearUpload() {
    currentLoc = location;
    currentBoundary = boundary;
  }

  function change() {
    open = false;
    dispatch("change", {
      boundaryId: currentBoundary.id,
      location: currentLoc,
    });
  }

  function cancel() {
    currentLoc = location;
    currentBoundary = boundary;
    open = false;
  }
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
  modalHeading="Change Location"
  shouldSubmitOnEnter="{false}"
  on:submit="{change}"
  on:open
  on:close
>
  <div>
    <p>
      Click on the map or enter an address in the search box. To explore data
      for a larger extent (e.g. county), select a boundary first.
    </p>
    <div class="change-boundary">
      <!-- Boundary Selection -->
      <SelectBoundary
        selectedId="{currentBoundary.id}"
        items="{boundaryList}"
        addStateBoundary="{addStateBoundary}"
        on:change="{updateBoundary}"
      />
      {#if enableUpload}
        <!-- Upload Boundary -->
        <UploadBoundary on:upload="{uploadBoundary}" on:clear="{clearUpload}" />
      {/if}
    </div>
    <div class="change-location">
      <!-- Search -->
      <div class="search-control">
        <Search
          size="sm"
          id="search"
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
        location="{currentLoc}"
        imageOverlayShow="{false}"
        on:mapclick="{mapClick}"
        on:ready="{() => dispatch('ready')}"
      />
    </div>
  </div>
</Modal>

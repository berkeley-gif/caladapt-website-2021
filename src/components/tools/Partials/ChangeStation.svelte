<script>
  import { onDestroy, createEventDispatcher } from "svelte";
  import { InlineLoading, Search, Modal } from "carbon-components-svelte";
  import getBbox from "@turf/bbox";

  // Helpers
  import {
    getNearestStation,
    getStationById,
    searchFeature,
  } from "../../../helpers/geocode";

  import { Location } from "../../../components/tools/Location";

  // Props
  export let location;
  export let stationsLayer;
  export let open = false;

  const dispatch = createEventDispatcher();

  let currentLoc = location;
  let geocodeResults = [];
  let searchValue = "";
  let searchPlaceholder = "Enter place name or address";
  let isSearching = false;
  let showSuggestions = false;

  async function overlayClick(e) {
    currentLoc = await getStationById(e.detail, stationsLayer.id);
    currentLoc.bbox = getBbox(currentLoc.geometry);
    console.log("overlay result", currentLoc);
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
    geocodeResults = await searchFeature(searchValue, stationsLayer.id);
    // Add groupname for results from all geocoders
    geocodeResults.forEach((item) => {
      if (item.geocoder === "caladapt") {
        item.category = stationsLayer.metadata.title;
      } else {
        item.category = "Places & Addresses";
      }
    });
    isSearching = false;
    showSuggestions = true;
  }

  async function selectSuggestion(opt) {
    if (opt.geocoder === "mapbox") {
      currentLoc = await getNearestStation(
        opt.center[0],
        opt.center[1],
        stationsLayer.id
      );
    } else {
      currentLoc = opt;
    }
    clearSearch();
  }

  function change() {
    open = false;
    dispatch("change", {
      location: currentLoc,
    });
  }

  function cancel() {
    currentLoc = location;
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
  modalHeading="Change Station"
  shouldSubmitOnEnter="{false}"
  on:submit="{change}"
  on:open
  on:close
>
  <div>
    <p>
      Select a station on the map or enter an address in the search box to
      select the nearest station.
    </p>
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
        zoom="{7}"
        lng="{currentLoc.center[0]}"
        lat="{currentLoc.center[1]}"
        stations="{stationsLayer}"
        location="{currentLoc}"
        imageOverlayShow="{false}"
        zoomToLocationOnLoad="{false}"
        on:overlayclick="{overlayClick}"
        on:ready="{() => dispatch('ready')}"
      />
    </div>
  </div>
</Modal>

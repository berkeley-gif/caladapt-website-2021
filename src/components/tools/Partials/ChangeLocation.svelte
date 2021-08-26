<script>
  import { createEventDispatcher } from "svelte";
  import { InlineLoading, Search, Modal } from "carbon-components-svelte";

  // Helpers
  import {
    getFeature,
    searchFeature,
    reverseGeocode,
  } from "../../../helpers/geocode";

  import {
    SelectBoundary,
    UploadBoundary,
  } from "../../../components/tools/Settings";
  import { Location } from "../../../components/tools/Location";

  // Props
  export let location;
  export let enableUpload = true;
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
    currentBoundary = e.detail;
    searchPlaceholder = `Enter ${currentBoundary.metadata.placeholder}`;
    currentLoc = await getFeature(currentLoc, currentBoundary.id);
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
        addStateBoundary="{true}"
        on:change="{updateBoundary}"
      />
      {#if enableUpload}
        <!-- Upload Boundary -->
        <UploadBoundary on:upload="{uploadBoundary}" />
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

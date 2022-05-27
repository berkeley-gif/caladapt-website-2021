<script>
  import { createEventDispatcher } from "svelte";
  import { InlineLoading, Modal } from "carbon-components-svelte";

  import SelectBoundary from "./Boundary.svelte";
  import LocationMap from "./Map.svelte";
  import Search from "./Search.svelte";

  export let location;
  export let enableUpload = false;
  export let addStateBoundary = false;
  export let boundary;
  export let boundaryList;
  export let stationsLayer;
  export let open = false;

  const dispatch = createEventDispatcher();

  let isStationSelector = Boolean(stationsLayer);
  let stationsLayerId = isStationSelector ? stationsLayer.id : null;

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

  let isSearching = false;
  let searchPlaceholder = isStationSelector
    ? "Enter place name or address"
    : boundary && boundary.metadata
    ? updatePlaceholderText(boundary.metadata.placeholder)
    : "";

  function updatePlaceholderText(boundary) {
    if (boundary && boundary.metadata) {
      searchPlaceholder = `Enter ${boundary.metadata.placeholder}`;
    }
  }

  async function change() {
    open = false;
    dispatch("change", {
      ...(currentBoundary && { boundaryId: currentBoundary.id }),
      location: currentLocation,
    });
  }

  function handleSearchSelect({ detail }) {
    currentLocation = detail;
  }

  function handleChangeBoundary({ detail }) {
    currentBoundary = detail;
    updatePlaceholderText(currentBoundary);
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
      <SelectBoundary
        on:upload="{uploadBoundary}"
        on:clear="{clearUpload}"
        on:change:boundary="{handleChangeBoundary}"
        on:change:location="{handleSearchSelect}"
        enableUpload="{enableUpload}"
        currentBoundary="{currentBoundary}"
        currentLocation="{currentLocation}"
        boundaryList="{boundaryList}"
        addStateBoundary="{addStateBoundary}"
      />
    {/if}
    <div class="change-location">
      <div class="search-control">
        <Search
          on:select="{handleSearchSelect}"
          isStationSelector="{isStationSelector}"
          currentBoundary="{currentBoundary}"
          searchPlaceholder="{searchPlaceholder}"
          stationsLayerId="{stationsLayerId}"
        />
      </div>

      {#if isSearching}
        <div class="search-status">
          <InlineLoading />
        </div>
      {/if}

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

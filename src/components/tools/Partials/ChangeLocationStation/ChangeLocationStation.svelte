<script>
  import { createEventDispatcher } from "svelte";
  import { Modal } from "carbon-components-svelte";

  import SelectBoundary from "./Boundary.svelte";
  import LocationMap from "./Map.svelte";
  import Search from "./Search.svelte";

  /** @type {!Object} the locationStore's location object */
  export let location;

  /** @type {?Object} the locationStore's boundary object */
  export let boundary;

  /** @type {?Array} specify the list of boundaries to be displayed in the dropdown */
  export let boundaryList;

  /** @type {?Object} specify which station layer to use. Overrides boundaryList */
  export let stationsLayer;

  /** @type {!boolean} specify whether the CA state boundary should be included in the boundaryList */
  export let addStateBoundary = false;

  /** @type {!boolean} specify whether a user may upload custom boundary data */
  export let enableUpload = false;

  /** @type {!boolean} specify whether or not the modal is shown */
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

  async function handleSubmit() {
    if (
      (isStationSelector && currentLocation) ||
      (!isStationSelector && currentBoundary && currentLocation)
    ) {
      open = false;
      dispatch("change", {
        ...(currentBoundary && { boundaryId: currentBoundary.id }),
        location: currentLocation,
      });
    }
  }

  function handleSearchSelect({ detail }) {
    currentLocation = detail;
  }

  function handleChangeBoundary({ detail }) {
    currentBoundary = detail;
  }

  function handleMapClick({ detail }) {
    if (detail && typeof detail === "object") {
      currentLocation = detail;
    }
  }

  function uploadBoundary({ detail }) {
    currentBoundary = { id: "custom" };
    currentLocation = detail.location;
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

<style>
  .change-location {
    position: relative;
  }
</style>

<Modal
  bind:open
  on:click:button--secondary="{cancel}"
  on:submit="{handleSubmit}"
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
    <!-- tools that use stations only have that type of boundary and no others -->
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
      <Search
        on:select="{handleSearchSelect}"
        isStationSelector="{isStationSelector}"
        currentLayer="{isStationSelector ? stationsLayer : currentBoundary}"
        currentBoundary="{currentBoundary}"
        stationsLayerId="{isStationSelector ? stationsLayer.id : null}"
      />

      <LocationMap
        on:click="{handleMapClick}"
        {...{ currentLocation, currentBoundary, stationsLayer }}
      />
    </div>
  </div>
</Modal>

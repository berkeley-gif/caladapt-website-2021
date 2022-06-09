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

  function handleChangeLocation({ detail }) {
    if (detail && typeof detail === "object") {
      currentLocation = detail;
    }
  }

  function handleChangeBoundary({ detail }) {
    currentBoundary = detail;
  }

  function uploadBoundary({ detail }) {
    currentBoundary = { id: "custom" };
    currentLocation = detail.location;
  }

  function clearUpload() {
    currentLocation = location;
    // this resets the boundary to whatever it initially was prior to uploading
    // a custom boundary.
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
  :global(.bx--modal-container .bx--modal-content) {
    padding-right: 1rem;
  }

  div {
    height: 50vh;
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 2rem;
  }

  div > :global(div:first-child) {
    width: calc(40% - 1rem);
  }

  div > :global(div:last-child) {
    width: calc(60% - 1rem);
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
  size="lg"
>
  <div>
    <SelectBoundary
      on:upload="{uploadBoundary}"
      on:clear="{clearUpload}"
      on:change:boundary="{handleChangeBoundary}"
      on:change:location="{handleChangeLocation}"
      enableUpload="{enableUpload}"
      currentBoundary="{currentBoundary}"
      currentLocation="{currentLocation}"
      boundaryList="{boundaryList}"
      addStateBoundary="{addStateBoundary}"
      isStationSelector="{isStationSelector}"
    />

    <LocationMap
      on:click="{handleChangeLocation}"
      {...{
        currentLocation,
        currentBoundary,
        stationsLayer,
        isStationSelector,
      }}
    >
      <Search
        on:select="{handleChangeLocation}"
        isStationSelector="{isStationSelector}"
        currentLayer="{isStationSelector ? stationsLayer : currentBoundary}"
        currentBoundary="{currentBoundary}"
        stationsLayerId="{isStationSelector ? stationsLayer.id : null}"
      />
    </LocationMap>
  </div>
</Modal>

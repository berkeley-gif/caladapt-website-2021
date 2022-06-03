<script>
  import { createEventDispatcher } from "svelte";
  import { SelectBoundary, UploadBoundary } from "~/components/tools/Settings";
  import { logException, logGetFeatureErr } from "~/helpers/logging";
  import { getFeature, getNearestFeature } from "~/helpers/geocode";
  import { DEFAULT_LOCATION } from "~/routes/tools/_common/constants";

  export let currentBoundary = null;
  export let currentLocation = null;
  export let boundaryList = [];
  export let addStateBoundary = false;
  export let enableUpload = false;

  const dispatch = createEventDispatcher();

  let uploadBoundaryRef = null;
  let uploadBoundaryFiles = [];

  // Reset the UploadBoundary component state when opening / closing or
  // when selecting a different boundary type.
  $: currentBoundary, maybeClearUploadBoundary();

  function maybeClearUploadBoundary() {
    if (
      uploadBoundaryRef &&
      uploadBoundaryFiles.length &&
      currentBoundary &&
      currentBoundary.id !== "custom"
    ) {
      uploadBoundaryRef.clearFiles();
    }
  }

  // NOTE: a side effect of the boundary type being updated is that it changes
  // the value of the currentLocation reactive variable
  async function updateBoundary({ detail }) {
    if (!detail) return;

    dispatch("change:boundary", detail);

    const { id: boundaryType } = detail;

    // Set current location after current boundary has changed
    // first attempt an intersection spatial query
    try {
      let intersectingFeature = await getFeature(currentLocation, boundaryType);
      if (intersectingFeature) {
        dispatch("change:location", intersectingFeature);
        return;
      }
    } catch (error) {
      logGetFeatureErr(currentLocation && currentLocation.center, boundaryType);
      console.error(error.message);
    }

    // if intersection fails, try a nearest neighbor spatial query
    // most likey this is for when id === "place"
    if (boundaryType === "place") {
      try {
        const {
          center: [lng, lat],
        } = currentLocation;
        let nearest = await getNearestFeature(lng, lat, boundaryType);
        if (nearest) {
          dispatch("change:location", nearest);
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

    // As a last resort use the default location's center to set the current location
    try {
      let defaultLocation = await getFeature(
        { center: DEFAULT_LOCATION.center },
        boundaryType
      );
      if (defaultLocation) {
        dispatch("change:location", defaultLocation);
      }
    } catch (error) {
      logGetFeatureErr(DEFAULT_LOCATION.center, boundaryType);
      console.error(error.message);
    }
  }
</script>

<style>
  div {
    margin: 1.5rem 0;
    max-width: 50ch;
  }
</style>

<div>
  <SelectBoundary
    on:change="{updateBoundary}"
    selectedId="{currentBoundary.id}"
    items="{boundaryList}"
    addStateBoundary="{addStateBoundary}"
  />
  {#if enableUpload}
    <UploadBoundary
      bind:this="{uploadBoundaryRef}"
      bind:files="{uploadBoundaryFiles}"
      on:upload
      on:clear
    />
  {/if}
</div>

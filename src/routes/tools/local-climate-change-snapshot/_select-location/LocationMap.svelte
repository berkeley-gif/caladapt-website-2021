<script>
  import { createEventDispatcher } from "svelte";
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { debounce } from "~/helpers/utilities";
  import { logException } from "~/helpers/logging";
  import { DEFAULT_BOUNDARIES } from "../../_common/constants";
  import { Location } from "~/components/tools/Location";
  import {
    handleAbortFetch,
    formatFeature,
    formatLocaGridFeature,
    reverseGeocodeBoundary,
    reverseGeocodeAddress,
  } from "./geocode-search";

  export let selectedLocation;
  export let boundary;

  const dispatch = createEventDispatcher();
  const clickDebounceMs = 250;
  let abortController;

  async function handleClick({ detail: center }) {
    let boundaryResults;
    let boundaryFeature;

    abortController = handleAbortFetch(abortController);

    if (boundary.id === "locagrid") {
      try {
        boundaryResults = await getLocaGridStreetAddress(center);
      } catch (error) {
        console.warn(error);
        logException(
          `lccs error: map click: locagrid at ${JSON.stringify(center)}`
        );
      }
    } else {
      try {
        boundaryResults = await getIntersectingBoundary(center);
      } catch (error) {
        console.warn(error);
        logException(
          `lccs error: map click: ${boundary.id} at ${JSON.stringify(center)}`
        );
      }
    }

    if (
      boundaryResults &&
      boundaryResults.features &&
      boundaryResults.features.length
    ) {
      boundaryFeature = formatBoundaryFeature(
        boundaryResults.features[0],
        boundary.id
      );
    }

    dispatch("click", boundaryFeature);
  }

  function formatBoundaryFeature(feature) {
    if (boundary.id === "locagrid") {
      return formatLocaGridFeature(feature);
    } else {
      return formatFeature(feature, boundary.id);
    }
  }

  async function getIntersectingBoundary(coords) {
    const { id: boundaryType } = boundary;
    return await reverseGeocodeBoundary(coords, {
      boundaryType,
      signal: abortController.signal,
    });
  }

  async function getLocaGridStreetAddress(coords) {
    return await reverseGeocodeAddress(coords, abortController.signal);
  }
</script>

<style>
  :global(.map-container) {
    background-color: var(--white);
  }
</style>

<Grid fullWidth="{true}" condensed="{true}">
  <Row>
    <Column aspectRatio="1x1" class="map-container">
      <Location
        on:mapclick="{debounce(handleClick, clickDebounceMs)}"
        location="{selectedLocation}"
        boundary="{boundary}"
      />
    </Column>
  </Row>
</Grid>

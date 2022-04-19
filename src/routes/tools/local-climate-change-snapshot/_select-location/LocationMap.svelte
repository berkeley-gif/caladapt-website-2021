<script>
  import { createEventDispatcher } from "svelte";
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Location } from "~/components/tools/Location";
  import { DEFAULT_BOUNDARIES } from "../../_common/constants";
  import {
    reverseGeocodeBoundary,
    reverseGeocodeAddress,
    formatFeature,
  } from "./geocode-search";

  export let location;
  export let boundary;

  const dispatch = createEventDispatcher();
  let abortController;

  $: {
    console.log("LocationMap boundary: ", boundary);
  }

  async function handleClick({ detail: center }) {
    let boundaryResults;
    let boundaryFeature;
    let locaGridPlaceName = "";
    console.log(center); // [lng, lat]

    handleAbortFetch();

    try {
      boundaryResults = await getBoundary(center);
      console.log(boundaryResults);
    } catch (error) {
      console.warn(error);
    }

    if (
      boundaryResults &&
      boundaryResults.features &&
      boundaryResults.features.length
    ) {
      boundaryFeature = boundaryResults.features[0];
    } else {
      dispatch("click", undefined);
      return;
    }

    if (boundary.id === "locagrid") {
      let address;
      try {
        address = await getLocaGridStreetAddress(center);
        console.log(address);
      } catch (error) {
        console.warn(error);
      }
      if (address && address.features && address.features.length) {
        locaGridPlaceName = address.features[0].place_name;
      } else {
        locaGridPlaceName = "Address could not be determined";
      }
    }

    try {
      boundaryFeature = formatFeature(
        boundaryFeature,
        boundary.id,
        locaGridPlaceName
      );
    } catch (error) {
      console.warn(error);
    } finally {
      dispatch("click", boundaryFeature);
    }
  }

  async function getBoundary(coords) {
    const { id: boundaryType } = boundary;
    return await reverseGeocodeBoundary(coords, {
      boundaryType,
      signal: abortController.signal,
    });
  }

  async function getLocaGridStreetAddress(coords) {
    return await reverseGeocodeAddress(coords, abortController.signal);
  }

  function handleAbortFetch() {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
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
        on:mapclick="{handleClick}"
        boundaryList="{DEFAULT_BOUNDARIES}"
        location="{location}"
        boundary="{boundary}"
      />
    </Column>
  </Row>
</Grid>

<script>
  import getBbox from "@turf/bbox";
  import { createEventDispatcher } from "svelte";
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Location } from "~/components/tools/Location";
  import { DEFAULT_BOUNDARIES } from "../../_common/constants";
  import {
    handleAbortFetch,
    formatFeature,
    reverseGeocodeBoundary,
    reverseGeocodeAddress,
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

    abortController = handleAbortFetch(abortController);

    if (boundary.id === "locagrid") {
      try {
        boundaryResults = await getLocaGridStreetAddress(center);
      } catch (error) {
        console.warn(error);
      }
    } else {
      try {
        boundaryResults = await getIntersectingBoundary(center);
      } catch (error) {
        console.warn(error);
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
      // bbox prop for a point geom is bogus but is added so that the map zoom works
      feature.bbox = getBbox(feature.geometry);
      feature.title = feature.place_name_en || "Unknown address";
      feature.title && feature.title.replace(", United States", "");
      return feature;
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
        on:mapclick="{handleClick}"
        boundaryList="{DEFAULT_BOUNDARIES}"
        location="{location}"
        boundary="{boundary}"
      />
    </Column>
  </Row>
</Grid>

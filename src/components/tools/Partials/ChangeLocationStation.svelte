<script>
  import { createEventDispatcher } from "svelte";
  import { InlineLoading, Search, Modal } from "carbon-components-svelte";
  import getBbox from "@turf/bbox";

  import {
    getFeature,
    getNearestFeature,
    getStationById,
    searchFeature,
    reverseGeocode,
  } from "~/helpers/geocode";

  import { SelectBoundary, UploadBoundary } from "~/components/tools/Settings";
  import { Location } from "~/components/tools/Location";

  export let location;
  export let enableUpload = false;
  export let addStateBoundary = false;
  export let boundary;
  export let boundaryList;
  export let stationsLayer;
  export let open = false;

  const dispatch = createEventDispatcher();

  $: isStationsSelector = Boolean(stationsLayer);

  let currentLoc = location;
  let currentBoundary = boundary;
  let geocodeResults = [];
  let searchValue = "";
  let searchPlaceholder = isStationsSelector
    ? "Enter place name or address"
    : boundary.metadata.placeholder;
  let isSearching = false;
  let showSuggestions = false;

  async function overlayClick(e) {
    currentLoc = await getStationById(e.detail, stationsLayer.id);
    currentLoc.bbox = getBbox(currentLoc.geometry);
  }

  async function mapClick(e) {
    const addresses = await reverseGeocode(`${e.detail[0]}, ${e.detail[1]}`);
    const feature = addresses.features[0];
    currentLoc = await getFeature(feature, currentBoundary.id);
  }

  async function search({ key }) {
    if (key === "Escape") {
      clearSearch();
      return;
    }
    if (key !== "Enter") return;
    const layer = isStationsSelector ? stationsLayer : currentBoundary;
    isSearching = true;
    showSuggestions = false;
    geocodeResults.length = 0;
    geocodeResults = await searchFeature(searchValue, layer.id);
    // Add groupname for results from all geocoders
    geocodeResults.forEach((item) => {
      if (item.geocoder === "caladapt") {
        item.category = layer.metadata.title;
      } else {
        item.category = "Places & Addresses";
      }
    });
    isSearching = false;
    showSuggestions = true;
  }

  function clearSearch() {}
</script>

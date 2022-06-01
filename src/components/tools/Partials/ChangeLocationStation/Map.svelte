<script>
  import { createEventDispatcher } from "svelte";
  import { Location } from "~/components/tools/Location";
  import { getFeature, getStationById } from "~/helpers/geocode";
  import { logException, logGetFeatureErr } from "~/helpers/logging";

  export let currentLocation = null;
  export let currentBoundary = null;
  export let stationsLayer = null;

  const dispatch = createEventDispatcher();

  let lng;
  let lat;

  $: isStationSelector = Boolean(stationsLayer);
  $: {
    if (currentLocation && currentLocation.center) {
      [lng, lat] = currentLocation.center;
    }
  }

  async function mapClick({ detail: center }) {
    const { id } = currentBoundary;
    try {
      let newLocation = await getFeature({ center }, id);
      if (newLocation) {
        dispatch("click", newLocation);
      }
    } catch (error) {
      console.error(error.message);
      logGetFeatureErr(center, id);
    }
  }

  async function overlayClick({ detail: stationId }) {
    try {
      let newStation = await getStationById(stationId, stationsLayer.id);
      if (newStation) {
        dispatch("click", newStation);
      }
    } catch (error) {
      console.error(error.message);
      logException(`getStationById failed: ${stationId}; ${stationsLayer.id}`);
    }
  }

  function noop() {}
</script>

<Location
  on:overlayclick="{isStationSelector ? overlayClick : noop}"
  on:mapclick="{isStationSelector ? noop : mapClick}"
  on:ready="{() => dispatch('ready')}"
  lng="{lng}"
  lat="{lat}"
  boundary="{currentBoundary}"
  stations="{stationsLayer}"
  location="{currentLocation}"
  imageOverlayShow="{false}"
  zoomToLocationOnLoad="{!isStationSelector}"
>
  <slot />
</Location>

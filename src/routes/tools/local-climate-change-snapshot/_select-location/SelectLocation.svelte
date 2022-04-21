<script>
  import { Row, Column } from "carbon-components-svelte";
  import { locationStore } from "~/routes/tools/_common/stores";
  import LocationMap from "./LocationMap.svelte";
  import LocationForm from "./LocationForm.svelte";

  const { location, boundary } = locationStore;

  let searchValue = $location ? $location.title : "";
  let selectedLocation = $location;
  let selectedRadio = $boundary ? $boundary.id : "locagrid";

  $: handleSelectBoundaryId(selectedRadio);
  $: handleSelectLocation(selectedLocation);

  $: {
    console.log("$locationStore update: ", $locationStore);
  }

  function handleSelectLocation(value) {
    locationStore.updateLocation(value);
  }

  function handleSelectBoundaryId(value) {
    locationStore.updateBoundary(value);
  }

  function handleMapClick({ detail }) {
    if (detail) {
      searchValue = detail.title;
      selectedLocation = detail;
    }
  }
</script>

<Row>
  <Column lg="{8}" md="{8}" sm="{4}">
    <LocationForm
      on:submit
      bind:selectedLocation
      bind:selectedRadio
      searchValue="{searchValue}"
    />
  </Column>
  <Column lg="{8}" md="{8}" sm="{4}" noGutter="{true}">
    <LocationMap
      on:click="{handleMapClick}"
      bind:selectedLocation
      boundary="{$boundary}"
    />
  </Column>
</Row>

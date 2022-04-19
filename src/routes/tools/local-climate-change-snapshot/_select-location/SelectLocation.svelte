<script>
  import { goto } from "@sapper/app";
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
    if (value) {
      locationStore.updateLocation(value);
    }
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

  function handleLocationFormSubmit() {
    if (selectedLocation) {
      goto("/tools/local-climate-change-snapshot/explore");
    }
  }
</script>

<Row>
  <Column lg="{8}" md="{8}" sm="{4}">
    <LocationForm
      on:submit="{handleLocationFormSubmit}"
      bind:selectedLocation
      bind:selectedRadio
      searchValue="{searchValue}"
    />
  </Column>
  <Column lg="{8}" md="{8}" sm="{4}" noGutter="{true}">
    <LocationMap
      on:click="{handleMapClick}"
      bind:location="{selectedLocation}"
      boundary="{$boundary}"
    />
  </Column>
</Row>

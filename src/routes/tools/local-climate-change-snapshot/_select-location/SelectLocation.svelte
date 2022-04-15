<script>
  import { goto } from "@sapper/app";
  import { Row, Column } from "carbon-components-svelte";
  import { locationStore } from "~/routes/tools/_common/stores";
  import LocationMap from "./LocationMap.svelte";
  import LocationForm from "./LocationForm.svelte";

  let searchValue =
    $locationStore && $locationStore.location
      ? $locationStore.location.title
      : "";
  let selectedLocation = $locationStore.location;
  let selectedRadio = $locationStore.boundaryId || "address";

  function handleSelectLocation({ detail }) {
    locationStore.updateLocation(detail);
    locationStore.updateBoundary(selectedRadio);
  }

  function handleLocationFormSubmit() {
    goto("/tools/local-climate-change-snapshot/explore");
  }
</script>

<Row>
  <Column lg="{8}" md="{8}" sm="{4}">
    <LocationForm
      on:select="{handleSelectLocation}"
      on:submit="{handleLocationFormSubmit}"
      bind:selectedLocation
      bind:selectedRadio
      searchValue="{searchValue}"
    />
  </Column>
  <Column lg="{8}" md="{8}" sm="{4}">
    <LocationMap
      boundaryType="{selectedRadio}"
      selectedLocation="{selectedLocation}"
    />
  </Column>
</Row>

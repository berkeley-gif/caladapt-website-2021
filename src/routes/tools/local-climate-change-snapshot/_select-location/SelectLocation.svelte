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

  $: console.log("$locationStore: ", $locationStore);

  function handleSelectLocation({ detail }) {
    locationStore.updateLocation(detail);
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
      on:select="{handleSelectLocation}"
      on:submit="{handleLocationFormSubmit}"
      bind:selectedLocation
      bind:selectedRadio
      searchValue="{searchValue}"
    />
  </Column>
  <Column lg="{8}" md="{8}" sm="{4}" noGutter="{true}">
    <LocationMap
      on:select="{handleSelectLocation}"
      boundaryType="{selectedRadio}"
      selectedLocation="{selectedLocation}"
    />
  </Column>
</Row>

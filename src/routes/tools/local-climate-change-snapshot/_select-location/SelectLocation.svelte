<script>
  import { goto } from "@sapper/app";
  import { Row, Column } from "carbon-components-svelte";
  import LocationMap from "./LocationMap.svelte";
  import LocationForm from "./LocationForm.svelte";

  let searchValue = "";
  let selectedLocation = null;
  let selectedRadio = "address";

  // $: {
  //   console.log("searchValue: ", searchValue);
  //   console.log("selectedLocation: ", selectedLocation);
  //   console.log("selected radio: ", selectedRadio);
  // }

  function handleSelectLocation({ detail }) {
    // TODO: set location store
    console.log(detail);
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

<script>
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Map } from "~/components/tools/Map";

  export let boundaryType = "";
  export let selectedLocation = null;

  $: {
    console.log("LocationMap boundaryType: ", boundaryType);
    console.log("LocationMap selectedLocation: ", selectedLocation);
  }
</script>

<style>
  :global(.map-container) {
    background-color: var(--gray-40);
  }
</style>

<Grid fullWidth="{true}" condensed="{true}">
  <Row>
    <Column aspectRatio="1x1" class="map-container">
      <Map />
    </Column>
  </Row>
</Grid>

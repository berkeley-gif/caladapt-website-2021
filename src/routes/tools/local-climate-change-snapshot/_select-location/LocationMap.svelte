<script>
  import { Grid, Row, Column } from "carbon-components-svelte";
  import { Location } from "~/components/tools/Location";
  import { DEFAULT_BOUNDARIES } from "../../_common/constants";

  export let location;
  export let boundary;

  $: {
    console.log("LocationMap boundary: ", boundary);
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
      <Location
        boundaryList="{DEFAULT_BOUNDARIES}"
        location="{location}"
        boundary="{boundary}"
      />
    </Column>
  </Row>
</Grid>

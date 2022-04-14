<script>
  import { Grid, Row, Column } from "carbon-components-svelte";
</script>

<style>
  :global(.map-container) {
    background-color: var(--gray-40);
  }
</style>

<Grid>
  <Row>
    <Column aspectRatio="1x1" class="map-container" />
  </Row>
</Grid>

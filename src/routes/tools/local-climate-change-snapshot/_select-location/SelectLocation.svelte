<script>
  import { Row, Column } from "carbon-components-svelte";
  import LocationMap from "./LocationMap.svelte";
  import LocationForm from "./LocationForm.svelte";
</script>

<Row>
  <Column lg="{8}" md="{8}" sm="{4}">
    <LocationForm />
  </Column>
  <Column lg="{8}" md="{8}" sm="{4}">
    <LocationMap />
  </Column>
</Row>

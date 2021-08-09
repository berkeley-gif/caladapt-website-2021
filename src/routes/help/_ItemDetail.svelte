<script>
  import { Row, Column } from "carbon-components-svelte";
  export let item;
</script>

<Row>
  <Column>
    {@html item.html}
    <hr />
  </Column>
</Row>

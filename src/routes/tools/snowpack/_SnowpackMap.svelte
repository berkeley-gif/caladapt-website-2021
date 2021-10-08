<script>
  import { Map, NavigationControl } from "~/components/tools/Map";

  export let mapboxMap;
</script>

<Map bind:this="{mapboxMap}">
  <NavigationControl />
</Map>

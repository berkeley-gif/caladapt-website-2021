<script>
  import { Map, NavigationControl, ImageOverlay } from "~/components/tools/Map";

  export let imgOverlayPath;
</script>

<Map>
  <NavigationControl />
  <ImageOverlay overlay="{`${imgOverlayPath}?style=swe&scale=10`}" />
</Map>

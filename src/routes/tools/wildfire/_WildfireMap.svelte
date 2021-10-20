<script>
  import {
    Map,
    NavigationControl,
    ImageOverlay,
    Legend,
  } from "~/components/tools/Map";
  import { DEFAULT_OVERLAY_BOUNDS, colorRamp, colorValues } from "./_constants";
  export let imgOverlayPath;
</script>

<Map>
  <NavigationControl />
  <ImageOverlay
    overlay="{imgOverlayPath}"
    coordinates="{DEFAULT_OVERLAY_BOUNDS}"
  />
  <Legend
    values="{colorValues}"
    ramp="{colorRamp}"
    title="Snow Water Equivalent (inches)"
    columns="{3}"
  />
</Map>

<script>
  import {
    Map,
    NavigationControl,
    ImageOverlay,
    Legend,
  } from "~/components/tools/Map";
  import { colorRamp, colorValues } from "./_constants";
  export let imgOverlayPath;
</script>

<Map>
  <NavigationControl />
  <ImageOverlay overlay="{`${imgOverlayPath}?style=swe&scale=10`}" />
  <Legend
    values="{colorValues}"
    ramp="{colorRamp}"
    title="Snow Water Equivalent"
    subtitle="Inches per month"
  />
</Map>

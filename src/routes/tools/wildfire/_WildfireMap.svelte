<script>
  import {
    Map,
    NavigationControl,
    ImageOverlay,
    Legend,
  } from "~/components/tools/Map";
  import {
    DEFAULT_OVERLAY_BOUNDS,
    colorRampFire,
    colorValuesFire,
  } from "./_constants";
  export let imgOverlayPath;

  const values = colorValuesFire;
  const tickValues = values;
  const ramp = colorRampFire;
  const height = 34;
  const width = 320;
  const scaleType = "continuous";
</script>

<Map>
  <NavigationControl />
  <ImageOverlay
    overlay="{imgOverlayPath}"
    coordinates="{DEFAULT_OVERLAY_BOUNDS}"
  />
  <Legend
    title="Area Burned (hectares)"
    {...{ ramp, values, scaleType, width, height, tickValues }}
  />
</Map>

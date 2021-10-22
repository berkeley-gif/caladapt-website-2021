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
    colorValuesFireprob,
    colorRampFireprob,
  } from "./_constants";

  export let imgOverlayPath;
  export let climvarId;

  const height = 34;
  const width = 320;
  const scaleType = "continuous";

  let title;
  let values;
  let ramp;
  let tickValues;

  $: if (climvarId === "fire") {
    title = "Area burned (hectares)";
    values = colorValuesFire;
    ramp = colorRampFire;
  } else {
    title = "Decadal wildfire probability";
    values = colorValuesFireprob;
    ramp = colorRampFireprob;
  }

  $: tickValues = values.slice();
</script>

<Map>
  <NavigationControl />
  <ImageOverlay
    overlay="{imgOverlayPath}"
    coordinates="{DEFAULT_OVERLAY_BOUNDS}"
  />
  <Legend {...{ title, ramp, values, scaleType, width, height, tickValues }} />
</Map>

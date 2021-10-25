<script>
  import {
    Map,
    NavigationControl,
    ImageOverlay,
    Legend,
    GeoJsonLayer,
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
  export let stateBoundary;

  const height = 34;
  const width = 280;
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
  <GeoJsonLayer data="{stateBoundary}" layerName="no-data" />
  <ImageOverlay
    overlay="{imgOverlayPath}"
    coordinates="{DEFAULT_OVERLAY_BOUNDS}"
  />
  <Legend {...{ title, ramp, values, scaleType, width, height, tickValues }} />
</Map>

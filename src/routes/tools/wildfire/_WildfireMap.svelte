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

  let legendProps = {
    height: 34,
    width: 280,
    scaleType: "continuous",
    noDataColor: "rgba(51,51,51,0.8)",
    rectWidth: "1.25rem",
    rectHeight: "0.75rem",
    title: "",
    values: [],
    ramp: [],
    tickValues: [],
  };

  $: if (climvarId === "fire") {
    legendProps = {
      ...legendProps,
      title: "Area burned (hectares)",
      values: colorValuesFire,
      ramp: colorRampFire,
      tickValues: colorValuesFire.slice(),
    };
  } else {
    legendProps = {
      ...legendProps,
      title: "Decadal wildfire probability",
      values: colorValuesFireprob,
      ramp: colorRampFireprob,
      tickValues: colorValuesFireprob.slice(),
    };
  }
</script>

<Map>
  <NavigationControl />
  <GeoJsonLayer data="{stateBoundary}" layerName="no-data" />
  <ImageOverlay
    overlay="{imgOverlayPath}"
    coordinates="{DEFAULT_OVERLAY_BOUNDS}"
  />
  <Legend {...legendProps} />
</Map>

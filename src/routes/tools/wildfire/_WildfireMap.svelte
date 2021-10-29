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

  const beforeId = "settlement-subdivision-label";
  const geojsonStyleProps = {
    "fill-pattern": "pattern",
  };

  let legendProps = {
    height: 34,
    width: 280,
    scaleType: "continuous",
    noData: true,
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
  <GeoJsonLayer
    data="{stateBoundary}"
    layerName="no-data"
    beforeId="{beforeId}"
    patternFillURL="/img/patterns/diagonal-lines.png"
    styleProps="{geojsonStyleProps}"
  />
  <ImageOverlay
    overlay="{imgOverlayPath}"
    coordinates="{DEFAULT_OVERLAY_BOUNDS}"
    beforeId="{beforeId}"
  />
  <Legend {...legendProps} />
</Map>

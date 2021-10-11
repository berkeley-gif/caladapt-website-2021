<script>
  import { Map, NavigationControl, ImageOverlay } from "~/components/tools/Map";
  import { getImgOverlayPath } from "./_data";

  export let climvarId;
  export let modelId;
  export let scenarioId;
  export let yearStart;
  export let yearEnd;
  export let monthNumber;

  $: imgOverlayPath = getImgOverlayPath({
    climvarId,
    modelId,
    scenarioId,
    yearStart,
    yearEnd,
    monthNumber,
  });
  $: console.log(imgOverlayPath);
</script>

<Map>
  <NavigationControl />
  <ImageOverlay overlay="{`${imgOverlayPath}?style=swe&scale=10`}" />
</Map>

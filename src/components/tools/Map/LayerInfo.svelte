<script>
  import { onMount, createEventDispatcher, getContext } from "svelte";
  import MapboxCustomControl from "./../../../helpers/mapbox-gl-custom-control";
  import { contextKey } from "./../../../helpers/mapbox";

  export let position = "top-right";
  export let options = {};

  const dispatch = createEventDispatcher();
  const { getMap } = getContext(contextKey);
  const map = getMap();

  function layerInfoClick() {
    dispatch("layerInfoClick");
  }

  const optionsWithDefaults = Object.assign(
    {
      eventHandler: layerInfoClick,
      className: "show-info",
      title: "Info",
      iconPath: `M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,6a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,8Zm4,16.125H12v-2.25h2.875v-5.75H13v-2.25h4.125v8H20Z`,
    },
    options
  );

  onMount(() => {
    const layerInfo = new MapboxCustomControl(optionsWithDefaults);
    map.addControl(layerInfo, position);
  });
</script>

<script>
  import { onMount, createEventDispatcher, getContext } from "svelte";
  import MapboxCustomControl from "./../../../helpers/mapbox-gl-custom-control";
  import { contextKey } from "./../../../helpers/mapbox";

  export let position = "top-right";
  export let options = {};

  const dispatch = createEventDispatcher();
  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();

  function layerToggleClick() {
    dispatch("layerToggleClick");
  }

  const optionsWithDefaults = Object.assign(
    {
      eventHandler: layerToggleClick,
    },
    options
  );

  onMount(() => {
    const layerToggle = new MapboxCustomControl(optionsWithDefaults);
    map.addControl(layerToggle, position);
    // Swap position of Layer Toggle control with Navigation Control
    //const container = document.querySelector('.mapboxgl-ctrl-top-right');
    //const childNodes = container.childNodes;
    //if (childNodes.length <= 1) return;
    //childNodes[1].parentNode.insertBefore(childNodes[1], childNodes[0]);
  });
</script>

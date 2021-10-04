<script>
  import { getContext } from "svelte";
  import { contextKey } from "./../../../helpers/mapbox";

  const { getMap } = getContext(contextKey);
  const map = getMap();

  export let boundary;

  let selection = null;

  function removePreviousSelection() {
    if (!selection) {
      return;
    }
    selection.layout.visibility = "none";
    map.removeLayer(selection.id);
    if (map.getSource(selection.id)) {
      map.removeSource(selection.id);
    }
  }

  function addBoundary() {
    removePreviousSelection();
    if (!boundary || boundary.id === "locagrid" || boundary.id === "custom") {
      selection = null;
      return;
    }
    boundary.layout.visibility = "visible";
    map.addLayer(boundary);
    selection = boundary;
  }

  $: boundary, addBoundary();
</script>

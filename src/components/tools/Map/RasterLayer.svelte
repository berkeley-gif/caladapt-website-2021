<script>
  import { getContext, onMount, afterUpdate } from "svelte";
  import { contextKey } from "~/helpers/mapbox";

  export let id = "";
  export let tileURL = "";
  export let paintProps = {};
  export let beforeId = "settlement-subdivision-label";
  export let visibility = "visible";

  const { getMap } = getContext(contextKey);
  const map = getMap();

  const getSourceDef = (url) => ({
    type: "raster",
    tiles: [url],
    tileSize: 256,
  });

  const getLayerDef = (id, source, paint, layout) => ({
    id,
    source,
    type: "raster",
    paint,
    layout,
  });

  const addRasterLayer = () => {
    map.addSource(sourceId, source);
    map.addLayer(layer, beforeId);
  };

  const removeRasterLayer = () => {
    map.removeLayer(id);
    map.removeSource(sourceId);
  };

  const hasSource = () =>
    Boolean(map.getSource(sourceId)) && map.isSourceLoaded(sourceId);

  const hasLayer = () => Boolean(map.getStyle()) && Boolean(map.getLayer(id));

  const isVisible = () =>
    map.getLayoutProperty(id, "visibility") === "visibile";

  let sourceId;
  let source;
  let layer;

  $: {
    console.log("---");
    console.log("sourceId", sourceId);
    console.log("source", source);
    console.log("layer", layer);
    console.log("visibility", visibility);
    console.log("---");
  }

  $: if (tileURL && id) {
    sourceId = `${id}-source`;
    source = getSourceDef(tileURL);
    layer = getLayerDef(id, sourceId, paintProps || {}, {
      visibility: visibility || "visible",
    });
  }

  $: if (hasLayer() && !isVisible() && visibility === "visible") {
    map.setLayoutProperty(id, "visibility", "visible");
    console.log("should now be visible");
  }

  $: if (hasLayer() && isVisible() && visibility === "none") {
    map.setLayoutProperty(id, "visibility", "none");
    console.log("should now NOT be visible");
  }

  onMount(() => {
    if (source && layer) {
      addRasterLayer();
    }

    return () => {
      if (hasLayer()) {
        map.removeLayer(id);
      }

      if (hasSource()) {
        map.removeSource(sourceId);
      }
    };
  });
</script>

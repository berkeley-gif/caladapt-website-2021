<script>
  import { getContext, onDestroy } from "svelte";
  import { contextKey } from "~/helpers/mapbox";

  export let id = "";
  export let tileURL = "";
  export let paintProps = {};
  export let beforeId = "settlement-subdivision-label";
  export let visibility = "visible";

  const VISIBLE = "visible";
  const VISIBILITY = "visibility";
  const NONE = "none";

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

  const hasSource = () => Boolean(getSource()) && map.isSourceLoaded(sourceId);

  const hasLayer = () => Boolean(map.getStyle()) && Boolean(map.getLayer(id));

  const getSource = () => map.getSource(sourceId);

  const getSourceTile = () => {
    const { tiles } = getSource();
    if (Array.isArray(tiles) && tiles.length) {
      return tiles[0];
    }
  };

  const isVisible = () => map.getLayoutProperty(id, VISIBILITY) === VISIBLE;

  const setLocalProps = () => {
    sourceId = `${id}-source`;
    source = getSourceDef(tileURL);
    layer = getLayerDef(id, sourceId, paintProps || {}, {
      visibility: visibility || VISIBLE,
    });
  };

  let sourceId;
  let source;
  let layer;

  $: if (process.env.NODE_ENV !== "production") {
    console.log("---");
    console.log("sourceId", sourceId);
    console.log("source", source);
    console.log("layer", layer);
    console.log("visibility", visibility);
    console.log("beforeId", beforeId);
    hasLayer() && console.log("isVisible", isVisible());
    hasSource() && console.log("getSource: ", getSource());
    console.log("---");
  }

  $: if (!hasLayer() && tileURL && id) {
    console.log("updating source & layer");
    setLocalProps();
    addRasterLayer();
  }

  // update existing sources if tileURL has changed
  $: if (hasSource() && getSourceTile() !== tileURL && tileURL) {
    removeRasterLayer();
    setLocalProps();
    addRasterLayer();
  }

  // TODO: re-render if beforeId has changed
  // $: if (!hasLayer() && beforeId) {
  //   setLocalProps();
  //   map.addLayer(layer, beforeId);
  // }

  $: if (hasLayer() && !isVisible() && visibility === VISIBLE) {
    map.setLayoutProperty(id, VISIBILITY, VISIBLE);
    console.log("should now be visible");
  }

  $: if (hasLayer() && isVisible() && visibility === NONE) {
    map.setLayoutProperty(id, VISIBILITY, NONE);
    console.log("should now NOT be visible");
  }

  onDestroy(() => {
    if (hasLayer()) {
      map.removeLayer(id);
    }
    if (hasSource()) {
      map.removeSource(sourceId);
    }
  });
</script>

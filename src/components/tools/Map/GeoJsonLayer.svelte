<script>
  import { getContext, onDestroy } from "svelte";
  import { contextKey } from "~/helpers/mapbox";

  export let data;
  export let layerName = "geojson-layer";
  export let styleType = "fill";
  export let styleProps = {
    "fill-color": "#333",
    "fill-opacity": 0.8,
    "fill-pattern": "pattern",
  };
  export let layout = {
    visibility: "visible",
  };
  export let beforeId = undefined;
  export let patternFillURL;

  const { getMap } = getContext(contextKey);
  const map = getMap();

  $: sourceName = `${layerName}-source`;

  $: if (patternFillURL) {
    loadMapImage(patternFillURL).catch(console.warn);
  }

  $: if (data && typeof data === "object") {
    map.addSource(sourceName, {
      type: "geojson",
      data,
    });

    map.addLayer(
      {
        id: layerName,
        type: styleType,
        source: sourceName,
        layout,
        paint: styleProps,
      },
      beforeId
    );
  }

  function loadMapImage(url) {
    return new Promise((resolve, reject) => {
      map.loadImage(url, (error, image) => {
        if (error) {
          reject(error);
        } else {
          map.addImage("pattern", image);
          resolve(image);
        }
      });
    });
  }

  onDestroy(() => {
    if (map.getStyle() && map.getLayer(layerName)) {
      map.removeLayer(layerName);
      map.removeSource(sourceName);
    }
  });
</script>

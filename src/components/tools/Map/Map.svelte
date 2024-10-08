<script>
  // Node
  import { onMount, setContext, createEventDispatcher } from "svelte";

  // Helpers
  import { mapboxgl, contextKey } from "./../../../helpers/mapbox";
  import { logException } from "~/helpers/logging";

  setContext(contextKey, {
    getMap: () => map,
    getMapbox: () => mapboxgl,
  });

  export let lng = -119.55;
  export let lat = 37.55;
  export let zoom = 5;
  export let minZoom = 0;
  export let maxZoom = 22;
  export let attributionControl = false;
  export let style = "mapbox://styles/mapbox/light-v10";

  let container;
  let map;
  let dispatch = createEventDispatcher();
  let options = {
    center: [lng, lat],
    zoom,
    minZoom,
    maxZoom,
    attributionControl,
    scrollZoom: false,
  };
  let canvas;

  // Create a popup, but don't add it to the map yet.
  let popup;
  let popupElem;

  export function getContainer() {
    return container;
  }

  export function setCenter(center, zoom) {
    if (map) {
      map.setCenter(center);
      if (zoom && Number.isInteger(zoom)) {
        map.setZoom(zoom);
      }
    }
  }

  export function flyTo(center, zoom, options = {}) {
    map.flyTo({ center, zoom, ...options });
  }

  export function resize() {
    map && map.resize();
  }

  export function addLayer(layer) {
    map.addLayer(layer);
  }

  export function getLayer(layerId) {
    return map.getLayer(layerId);
  }

  export function moveLayer(layerId, beforeId) {
    map.moveLayer(layerId, beforeId);
  }

  export function hideLayer(layer) {
    map.setLayoutProperty(layer, "visibility", "none");
  }

  export function showLayer(layer) {
    map.setLayoutProperty(layer, "visibility", "visible");
  }

  export function removeLayer(layer) {
    map.removeLayer(layer.id);
    if (map.getSource(layer.id)) {
      map.removeSource(layer.id);
    }
  }

  export function setLineOpacity(layerId, opacity = 0.75) {
    map.setPaintProperty(layerId, "line-opacity", opacity);
  }

  export function zoomToExtent(bbox, maxZoom = 9) {
    map.fitBounds(bbox, { maxZoom });
  }

  export function updatePopup(event, description) {
    if (event) {
      canvas.style.cursor = "pointer";
      popup.setLngLat(event.lngLat).setHTML(description);
      popupElem.style.display = "block";
    } else {
      canvas.style.cursor = "";
      popupElem.style.display = "none";
      popupElem.textContent = "";
    }
  }

  onMount(() => {
    if (!mapboxgl.supported() && window.alert) {
      alert(`Your browser does not support our Web Maps. 
        Please try using another browser.`);
    } else {
      const el = new mapboxgl.Map({ ...options, container, style });

      el.on("error", (error) => {
        logException(
          `mapboxgl error: ${error.error.message} sourceId: ${error.sourceId}`
        );
        console.warn("mapboxgl error: ", error);
      });

      el.on("load", () => {
        map = el;
        map.resize();
        popup = new mapboxgl.Popup({
          closeButton: false,
        })
          .setLngLat(options.center)
          .setHTML("")
          .addTo(map);
        popupElem = popup.getElement();
        popupElem.style.display = "none";
        canvas = map.getCanvas();
        dispatch("ready", map);
      });

      // Forward mouse events
      el.on("mousemove", (e) => {
        if (!map) return;
        const features = map.queryRenderedFeatures(e.point);
        dispatch("mousemove", {
          event: e,
          features,
        });
      });

      el.on("mouseleave", (e) => {
        dispatch("mouseleave", {
          event: e,
        });
      });

      // Forward map click event
      el.on("click", (e) => {
        dispatch("click", {
          event: e,
        });
      });

      // Forwarch zoom change event
      el.on("zoomend", () => {
        dispatch("zoom", el.getZoom());
      });

      el.on("moveend", (event) => {
        dispatch("moveend", {
          event,
        });
      });
    }

    return () => {
      map && map.remove();
      dispatch("destroy");
    };
  });
</script>

<style>
  div {
    width: var(--map-width, 100%);
    height: var(--map-height, 100%);
    min-height: var(--map-min-height, 300px);
    border-color: var(--border-color, var(--gray-40));
    border-style: var(--border-style, solid);
    border-width: var(--border-width, 0.0625rem);
  }
</style>

<div bind:this="{container}" on:keydown on:keyup>
  {#if map}
    <slot />
  {/if}
</div>

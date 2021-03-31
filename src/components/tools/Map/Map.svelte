<script>
  // Node
  import { onMount, setContext, createEventDispatcher } from 'svelte';

  // Helpers
  import { mapboxgl, contextKey } from './../../../helpers/mapbox';

  setContext(contextKey, {
    getMap: () => map,
    getMapbox: () => mapboxgl,
  });

  export let lng = -119.55;
  export let lat = 37.55;
  export let zoom = 5;
  export let minZoom = 0;
  export let maxZoom = 22;
  export let flyToOnLoad = true;
  export let attributionControl = false;
  export let style = 'mapbox://styles/mapbox/light-v10';

  let container;
  let map;
  let dispatch = createEventDispatcher();
  let options = {
    center: [lng, lat],
    zoom,
    minZoom,
    maxZoom,
    flyToOnLoad,
    attributionControl,
  };
  let canvas;

  // Create a popup, but don't add it to the map yet.
  let popup;
  let popupElem;

  export function setCenter(center, zoom) {
    if (map) {
      map.setCenter(center)
      if (zoom && Number.isInteger(zoom)) {
        map.setZoom(zoom)
      }
    }
  }

  export function resize() {
    map && map.resize()
  }

  export function addLayer(layer) {
    map.addLayer(layer);
  }

  export function hideLayer(layer) {
    map.setLayoutProperty(layer, 'visibility', 'none');
  }

  export function showLayer(layer) {
    map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  export function setLineOpacity(layerId, opacity=0.75) {
    map.setPaintProperty(layerId, 'line-opacity', opacity);
  }

  export function removeLayer(layer) {
    map.removeLayer(layer.id);
    if (map.getSource(layer.id)) {
      map.removeSource(layer.id);
    }
  }

  export function zoomToExtent(bbox) {
    map.fitBounds(bbox, { maxZoom: 9 });
  }

  export function updatePopup(event, description) {
    if (event) {
      canvas.style.cursor = 'pointer';
      // popupElem.textContent = description;
      // popupElem.style.left = `${event.originalEvent.clientX}px`;
      // popupElem.style.top = `${event.originalEvent.clientY}px`;
      popup.setLngLat(event.lngLat).setHTML(description);
      popupElem.style.display = 'block';
    } else {
      canvas.style.cursor = '';
      popupElem.style.display = 'none';
      popupElem.textContent = '';
    }
  }

  onMount(() => {
    if (!mapboxgl.supported()) {
      throw new Error('Your browser does not support Mapbox GL');
    } else {
      const el = new mapboxgl.Map({...options, container, style});

      el.on('load', () => {
        map = el;
        map.resize();
        popup = new mapboxgl.Popup({
            closeButton: false,
          })
          .setLngLat(options.center)
          .setHTML('')
          .addTo(map);
        popupElem = popup.getElement();
        popupElem.style.display = 'none';
        canvas = map.getCanvas();
        dispatch('ready')
      });

      // Forward mouse events
      el.on('mousemove', e => {
        const features = map.queryRenderedFeatures(e.point);
        dispatch('mousemove', {
          event: e,
          features,
        });
      });

      el.on('mouseleave', e => {
        dispatch('mousemove');
      });

      // Forward map click event
      el.on('click', e => {
        dispatch('click', {
          event: e,
        });
      });

      // Forwarch zoom change event
      el.on('zoomend', e => {
        dispatch('zoom', el.getZoom());
      });
    }

    return () => {
      map.remove();
    };
  });
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    min-height: 300px;
  }
</style>

<div bind:this={container}>
  {#if map}
    <slot></slot>
  {/if}
</div>

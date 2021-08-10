<script>
  import { getContext } from "svelte";
  import { contextKey } from "./../../../helpers/mapbox";

  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapboxgl = getMapbox();

  export let lat;
  export let lon;
  export let label;
  export let options = {
    closeOnMove: true,
  };
  export function remove() {
    if (popup.isOpen()) {
      popup.remove();
      popup = null;
    }
  }

  let popup = new mapboxgl.Popup(options)
    .setLngLat([lon, lat])
    .setHTML(label)
    .addTo(map);
</script>

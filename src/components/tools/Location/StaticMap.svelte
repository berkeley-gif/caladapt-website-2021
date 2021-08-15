<script>
  import simplifyGeom from "@turf/simplify";

  // Helpers
  import { mapboxgl } from "./../../../helpers/mapbox";

  // Props
  export let width = 150;
  export let height = 150;
  export let location = null;
  //export let style = "cal-adapt/cjivy3e8o6d9y2rnnhsqo0sj0";
  export let style = "mapbox/streets-v11";
  export let padding = 50;

  $: geometry = location.geometry;
  $: if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
    geometry = simplifyGeom(geometry, { tolerance: 0.01, mutate: true });
  }
  $: overlay = encodeURIComponent(JSON.stringify({
      type: "Feature",
      properties: {
        "fill-opacity": 0,
      },
      geometry,
    }));
  $: src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/auto/${width}x${height}@2x?padding=${padding}&access_token=${mapboxgl.accessToken}`;

  let container;
</script>

<div class="static-map" bind:this="{container}">
  <img src="{src}" alt="Location map" />
</div>

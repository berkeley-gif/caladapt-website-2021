<script>
  import simplifyGeom from "@turf/simplify";

  // Helpers
  import { mapboxgl } from "./../../../helpers/mapbox";

  // Props
  export let width = 150;
  export let height = 150;
  export let location = null;
  export let style = "mapbox/streets-v11";
  export let padding = 50;
  export let zoom = 8;

  let geometry;
  let bounds;
  let overlay;
  let src;

  $: if (location) {
    geometry = location.geometry;
    if (geometry.type === "Point") {
      // Use zoom for point feature to prevent returned image from
      // being zoomed all the way in
      bounds = `${geometry.coordinates[0]},${geometry.coordinates[1]},${zoom}`;
      overlay = encodeURIComponent(JSON.stringify(geometry));
      src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?&access_token=${mapboxgl.accessToken}`;
    } else {
      // Add style for non point geometry
      geometry = simplifyGeom(geometry, { tolerance: 0.1, mutate: true });
      bounds = "auto";
      overlay = encodeURIComponent(
        JSON.stringify({
          type: "Feature",
          properties: {
            "fill-opacity": 0,
            "stroke-width": 2,
          },
          geometry,
        })
      );
      src = `https://api.mapbox.com/styles/v1/${style}/static/geojson(${overlay})/${bounds}/${width}x${height}?padding=${padding}&access_token=${mapboxgl.accessToken}`;
    }
  }

  let container;
</script>

<div class="static-map" bind:this="{container}">
  <img src="{src}" alt="Location map" />
</div>

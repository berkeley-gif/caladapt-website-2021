<script>
  import { getContext, onDestroy, createEventDispatcher } from "svelte";
  import { contextKey, mapboxgl } from "./../../../helpers/mapbox";

  export let layer;
  export let enableClick = false;

  const { getMap } = getContext(contextKey);
  const map = getMap();
  const dispatch = createEventDispatcher();

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  function getLabel(feature) {
    switch (feature.layer.id) {
      case "substations":
        return `<strong>Substation:</strong> ${feature.properties.Name}`;
      case "translines":
        return `<strong>Transmission Line:</strong> ${feature.properties.Name}`;
      case "powerplants":
        return `<strong>Powerplant:</strong> ${feature.properties.PlantName}`;
      case "hadisd":
        return `<strong>${feature.properties.name}</strong><br/>Elev: ${feature.properties.elevation_m} m`;
      case "calenviroscreen":
        return `<strong>CalEnviroScreen 3.0 Percentile:</strong> ${feature.properties.ces_3_0_percentile_range}`;
      default:
        // eslint-disable-next-line no-case-declarations
        const prop = feature.layer.metadata.nameField || "name";
        return feature.properties[prop];
    }
  }

  map.on("mouseenter", layer.id, function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";

    const coordinates = e.lngLat;
    const description = getLabel(e.features[0]);

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on("mouseleave", layer.id, function () {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  if (enableClick) {
    map.on("click", layer.id, function (e) {
      dispatch("overlayclick", e.features[0].id);
      map.flyTo({
        center: e.features[0].geometry.coordinates,
      });
    });
  }

  map.addLayer(layer);

  onDestroy(() => {
    map.off("mouseenter", layer.id);
    map.off("mouseleave", layer.id);
    if (enableClick) {
      map.off("click", layer.id);
    }
  });
</script>

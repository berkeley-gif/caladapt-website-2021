<script>
  import { getContext, onDestroy, createEventDispatcher } from "svelte";
  import getCenter from "@turf/center";
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

  function getFeatureCenter(feature) {
    try {
      if (feature.geometry.type === "Point") {
        return feature.geometry.coordinates;
      } else {
        const center = getCenter(feature.geometry);
        return center.geometry.coordinates;
      }
    } catch (error) {
      console.warn(error);
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
      const feature = e.features && e.features.length ? e.features[0] : null;
      console.log("feature", feature);
      if (feature && feature.id) {
        dispatch("overlayclick", feature.id);
        const center = getFeatureCenter(feature);
        if (center) {
          map.flyTo({ center });
        }
      }
    });
  }

  map.addLayer(layer);

  onDestroy(() => {
    map.off("mouseenter", layer.id);
    map.off("mouseleave", layer.id);
    if (enableClick) {
      map.off("click", layer.id);
    }
    if (map.getStyle() && map.getLayer(layer.id)) {
      map.removeLayer(layer.id);
      map.removeSource(layer.id);
    }
  });
</script>

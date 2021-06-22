<script>
  import { getContext, onDestroy, createEventDispatcher } from 'svelte';
  import { contextKey, mapboxgl } from './../../../helpers/mapbox';

  export let layer;
  export let enableClick = false;

  const { getMap } = getContext(contextKey);
  const map = getMap();
  const dispatch = createEventDispatcher();

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });



  function getLabel(feature) {
    let label;
    switch (feature.layer.id) {
      case 'substations':
        label = `<strong>Substation:</strong> ${feature.properties.Name}`;
        break;
      case 'translines':
        label = `<strong>Transmission Line:</strong> ${feature.properties.Name}`;
        break;
      case 'powerplants':
        label = `<strong>Powerplant:</strong> ${feature.properties.Plant_Label}`;
        break;
      case 'hadisd':
        label = `<strong>${feature.properties.name}</strong><br/>Elev: ${feature.properties.elevation_m} m`;
        break;
      case 'calenviroscreen':
        label = `<strong>CalEnviroScreen 3.0 Percentile:</strong> ${feature.properties.ces_3_0_percentile_range}`;
        break;
      default:
        // eslint-disable-next-line no-case-declarations
        const prop = feature.layer.metadata.nameField || 'name';
        label = feature.properties[prop];
    }
    return label;
  }

  map.on('mouseenter', layer.id, function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
   
    const coordinates = e.lngLat;
    const description = getLabel(e.features[0]);

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on('mouseleave', layer.id, function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });

  if (enableClick) {
    map.on('click', layer.id, function(e) {
      dispatch('overlayclick', e.features[0].id);
      map.flyTo({
        center: e.features[0].geometry.coordinates,
      });
    });    
  }

  map.addLayer(layer);

  onDestroy(() => {
    map.off('mouseenter', layer.id);
    map.off('mouseleave', layer.id);
    if (enableClick) {
      map.off('click', layer.id);
    }
    map.removeLayer(layer.id);
    if (map.getSource(layer.id)) {
      map.removeSource(layer.id);
    }
  });
</script>

<script>
import { getContext, onMount } from 'svelte';
import { contextKey } from './../../../helpers/mapbox';

export let id = 'polygonOverlay';
export let data = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinate: [
      [
        [-125, 31],
        [-113, 31],
        [-113, 44],
        [-125, 44],
        [-125, 31],
      ]
    ]
  }
};
export let paint;
export let type;

const { getMap } = getContext(contextKey);
const map = getMap();

let source;

const layer = {
  id,
  type: 'line',
  source: {
    type: 'geojson',
    data,
  },
  paint: {
    'line-width': 3,
  },
};

if (type) {
  layer.type = type;
}

if (paint) {
  layer.paint = paint;
}

$: if (data && source) {
  source.setData(data);
}

map.on('load', () => {
  map.addLayer(layer);
  source = map.getSource(id);
});
</script>


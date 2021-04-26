<script>
  import { getContext, onMount, onDestroy } from 'svelte';
  import { contextKey } from './../../../helpers/mapbox';

  const { getMap } = getContext(contextKey);
  const map = getMap();

  export let play = false;
  export let pause = true;
  export let reset = false;
  export let coordinates = [
    [-124.60693359374999, 43.723474896114794],
    [-113.291015625, 43.723474896114794],
    [-113.291015625, 31.034108344903512],
    [-124.60693359374999, 31.034108344903512]
  ];
  export let urls = [
    `https://api.cal-adapt.org/api/series/swe_month_livneh/1960-1969/
    4.png?style=swe&scale=10`,
    `https://api.cal-adapt.org/api/series/swe_month_livneh/1970-1979/
    4.png?style=swe&scale=10`,
        `https://api.cal-adapt.org/api/series/swe_month_livneh/1980-1989/
    4.png?style=swe&scale=10`,
  ];

  let currentFrame = 0;
  let frameCount = urls.length;
  let timer;

  function getPath() {
    return urls[currentFrame];
  }

  function nextFrame() {
    if (currentFrame === frameCount) {
      currentFrame = 0;
    } else {
      currentFrame += 1;
    }
    map.getSource('animation-layer').updateImage({ url: getPath() });
  }

  $: if (play) {
    timer = setInterval(nextFrame, 1000);
  }

  $: if (pause) {
    clearInterval(timer);
  }

  $: if (reset) {
    currentFrame = 0;
    map.getSource('animation-layer').updateImage({ url: getPath() });
  }

  let layer =  {
    id: 'animation-layer',
    type: 'raster',
    source: {
      type: 'image',
      url: getPath(),
      coordinates,
    },
    paint: {
      'raster-fade-duration': 0
    },
  };

  onMount(() => {
    map.addLayer(layer);
  });

  onDestroy(() => {
    map.removeLayer(layer);
  })
</script>

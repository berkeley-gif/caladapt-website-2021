<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { debounce } from "~/helpers/utilities";
  import { getGeoJson } from "../_data";
  import {
    Map as SlippyMap,
    NavigationControl,
    Search,
  } from "~/components/tools/Map";
  import RasterLayers from "./Rasters.svelte";
  import TileIndexes from "./TileIndexes.svelte";
  import TileCentroids from "./TileCentroids.svelte";

  export let dataLayersAugmented;
  export let mapStyle;

  // initial map view
  const lng = -122.24;
  const lat = 37.8279;
  let zoom = 9;

  const dispatch = createEventDispatcher();

  const moveendDelayMS = 1500;

  let mapInstance;
  let mbGlMap;
  let curStyleUrl;
  let geojsons = new Map();
  let centroids;

  $: styleUrl = `mapbox://styles/mapbox/${mapStyle}`;
  $: mapReady = Boolean(mapInstance) && Boolean(mbGlMap);
  $: beforeId =
    mapStyle && mapStyle.includes("satellite")
      ? undefined
      : "settlement-subdivision-label";

  $: beforeIdCentroids =
    mapStyle && mapStyle.includes("satellite") ? undefined : "state-label";

  // TODO: remove before deploying to prod
  $: if (mapReady && typeof window !== undefined) {
    window.map = mbGlMap;
  }

  $: if (mapReady && styleUrl && styleUrl !== curStyleUrl) {
    curStyleUrl = styleUrl;
    mbGlMap.setStyle(curStyleUrl);
  }

  $: if (mapReady) {
    mbGlMap.on("zoomend", handleZoomend);
  }

  function handleSearchChange({ detail }) {
    if (!mapReady) return;
    if (Array.isArray(detail.bbox) && detail.bbox.length) {
      mapInstance.zoomToExtent(detail.bbox, 12);
    } else if (detail.center && detail.center.length) {
      mapInstance.flyTo(detail.center, 15);
    } else {
      console.warn("no center or bbox from geocode result");
    }
  }

  function handleMoveend() {
    if (mapReady) {
      const {
        _sw: { lng: xMax, lat: yMax },
        _ne: { lng: xMin, lat: yMin },
      } = mbGlMap.getBounds();
      dispatch("moveend", [xMin, yMin, xMax, yMax]);
    }
  }

  function handleZoomend() {
    zoom = mbGlMap.getZoom();
  }

  function handleMapReady({ detail }) {
    mbGlMap = detail;
  }

  function handleMapDestroy() {
    mbGlMap = null;
  }

  onMount(async () => {
    try {
      const layerIds = dataLayersAugmented.map((d) => d.id);
      const data = await getGeoJson(layerIds);
      geojsons = new Map(data.map((d) => [d.id, d]));
      centroids = await getGeoJson(layerIds.find((id) => id.includes("5m")));
    } catch (error) {
      console.log(error);
    }
  });
</script>

{#if mapStyle}
  <SlippyMap
    bind:this="{mapInstance}"
    lng="{lng}"
    lat="{lat}"
    zoom="{zoom}"
    style="{styleUrl}"
    on:ready="{handleMapReady}"
    on:destroy="{handleMapDestroy}"
    on:moveend="{debounce(handleMoveend, moveendDelayMS)}"
  >
    <NavigationControl />
    <Search on:change="{handleSearchChange}" />

    {#if zoom >= 8}
      <RasterLayers
        mapStyle="{mapStyle}"
        beforeId="{beforeId}"
        dataLayers="{dataLayersAugmented}"
      />
    {/if}

    {#if zoom < 8}
      <TileIndexes
        mapStyle="{mapStyle}"
        beforeId="{beforeId}"
        dataLayers="{dataLayersAugmented}"
        geojsons="{geojsons}"
      />
    {/if}

    {#if zoom <= 6}
      <TileCentroids
        mapStyle="{mapStyle}"
        beforeId="{beforeIdCentroids}"
        dataLayers="{dataLayersAugmented}"
        centroids="{centroids}"
      />
    {/if}
  </SlippyMap>
{/if}

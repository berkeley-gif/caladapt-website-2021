<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    Search,
    SkeletonText,
    Button,
    Select,
    SelectItem,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
  } from 'carbon-components-svelte';
  import PlayFilledAlt16 from 'carbon-icons-svelte/lib/PlayFilledAlt16';
  import PauseFilled16 from 'carbon-icons-svelte/lib/PauseFilled16';
  import Location32 from 'carbon-icons-svelte/lib/Location32';

  // Helpers
  import { getLocation, searchLocation } from '../../../helpers/geocode';
  import { getMapImages } from './_helpers';

  // Components
  import { TimeSlider } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import { notifier } from '../../../components/notifications';

  // Store
  import { 
    climvarStore,
    scenarioStore,
    locationStore, 
    monthStore,
    timeTicksStore,
    modelsStore,
    viewStore,
  } from './_store';

  export let sidebarCollapsed;
  export let appStatus;

  const dispatch = createEventDispatcher();
  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { month } = monthStore;
  const { models } = modelsStore;

  let width = 500;
  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;

  let isLoading = true;
  let selectedModel = $models[0];
  let isPlaying = false;
  let timer;
  let overlay;
  const overlayCoordinates = [
    [-124.60693359374999, 43.723474896114794],
    [-113.291015625, 43.723474896114794],
    [-113.291015625, 31.034108344903512],
    [-124.60693359374999, 31.034108344903512]
  ];
  let sliderComponent;
  let multiLineLabel = (sel, d) => {
    sel
      .append('tspan')
        .text(d)
      .append('tspan')
        .attr('dy', 12)
        .attr('x', 0)
        .text(`-${d + 9}`);
  }
  $: sliderProps = {
    start: 1950,
    end: 2100,
    step: 10,
  }
  $: sliderValue = $timeTicksStore[0];
  $: urls = getMapImages({
    model: selectedModel,
    scenario: $scenario.id,
    month: $month.id + 1,
    ticks: $timeTicksStore,
  });
  $: overlay = urls.find(d => d.id === sliderValue);


  function preloadImage(src) {
    return new Promise(r => {
      const image = new Image()
      image.onload = r
      image.onerror = r
      image.src = src
    });
  }

  function updateSlider(e) {
    sliderValue = e.detail;
  }
  
  function playSlider() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      timer = setInterval(sliderComponent.next, 1000)
    } else {
      clearInterval(timer);
    }
  }

  async function mapClick(e) {
    const loc = await getLocation(e.detail[0], e.detail[1], $boundary.id);
    locationStore.updateLocation(loc);
  }

  function clearSearch() {
    searchOptions.length = 0;
    searchValue = '';
  }

  async function search(e) {
    searchOptions = await searchLocation(e.target.value, $boundary.id);
    showSuggestions = true;
  }

  function selectSuggestion(opt) {
    showSuggestions = false;
    if (opt) {
      locationStore.updateLocation(opt);
    }
    clearSearch();
  }

  function changeViz(e) {
    dispatch('changeViz', e.detail);
    viewStore.set(e.detail);
  }

  async function changeModel(e) {
    selectedModel = e.detail;
    await update();
  }
  
  async function update() {
    isLoading = true;
    appStatus === 'working'
    // Preload map images in parallel 
    await Promise.all(urls.map(x => preloadImage(x.src)))
    isLoading = false;
    appStatus === 'idle'
    console.log('load all images');
  }

  onMount(async() => {
    console.log('mount component');
    await update();
  })
</script>

<style lang="scss">
  .flex-header {
    display: flex;
    align-items: center;
  }

  .map-overlay {
    position: absolute;
    width: 35%;
    top: 0;
    left: 0;
    padding: 10px;
    z-index: 2;
  }

  .map-overlay .map-overlay-inner {
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .map-overlay-legend {
    position: absolute;
    width: 10%;
    bottom: 35px;
    left: 10px;
    padding: 10px;
    z-index: 2;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
 
  .location-search {
    top: 10px;
    left: calc(100% - 275px);
  }
</style>

<div class="content-grid content-grid-animation">
  <!-- Climvar Header -->
  <div class="content-header block">
    <FormGroup legendText="SELECT VISUALIZATION" style="margin-bottom:1rem;">
      <RadioButtonGroup selected="animation" on:change={changeViz}>
        <RadioButton labelText="Monthly Timeseries" value="timeseries" />
        <RadioButton labelText="Map Animation" value="animation" />
      </RadioButtonGroup>
    </FormGroup>
    {#if $climvar}
    <div class="flex-header">
      <span class="icon">
        <svelte:component this={$climvar.icon} />
      </span>
      <div>
        <h4 class="title">{$month.label} {$climvar.title}</h4>
      </div>
    </div>
    {:else}
      <SkeletonText heading />
      <SkeletonText />
    {/if}         
  </div> <!-- end content-header -->


  <div class="content-select block">
    <Select labelText="SELECT MODEL" selected={$models[0]} on:change={changeModel}>
      {#each $models as opt}
        <SelectItem value={opt} text={opt} />
      {/each}
    </Select>
  </div>

  <div class="content-controls block">
    <Button
      disabled={isLoading}
      style="width:7rem;margin-right:10px;"
      icon={ isPlaying ? PauseFilled16 : PlayFilledAlt16 }
      on:click={playSlider}>
      {isPlaying ? "Pause" : "Play"}
    </Button>     
    <TimeSlider
      {width}
      labelFn={multiLineLabel}
      bind:this={sliderComponent}
      on:change={updateSlider}
      {...sliderProps}>
    </TimeSlider>
  </div>

  <!-- Map-->
  <div class="content-animation">
    <div class="map-overlay top">
      <div class="map-overlay-inner">
        <span class="animation-title">
          Decadal {$month.label} {$climvar.title} {overlay.text}
        </span>
        <span class="animation-subtitle">
          {$scenario.labelLong}
        </span>
        <span class="animation-subtitle">
          {selectedModel}
        </span>
      </div>
      <div class="map-overlay-inner" style="display:flex;align-items:center;">
        <Location32 />
        <span class="animation-subtitle" style="margin-left:5px;">
          {$location.title}, {$location.address}
        </span>
      </div>
    </div>
    <div class="map-overlay-legend">
      <svg viewBox="0 0 100 360">
        <g transform="translate(0,20)">
          <text y="0" x="0">SWE (inches)</text>
        </g>
        <g transform="translate(0,30)">
          <rect fill="#ffffcc" width="30" height="30" x="0"></rect>
          <rect fill="#d9f0ca" width="30" height="30" y="30"></rect>
          <rect fill="#b3e1c8" width="30" height="30" y="60"></rect>
          <rect fill="#8dd3c7" width="30" height="30" y="90"></rect>
          <rect fill="#67c4c5" width="30" height="30" y="120"></rect>
          <rect fill="#41b6c4" width="30" height="30" y="150"></rect>
          <rect fill="#3a95b8" width="30" height="30" y="180"></rect>
          <rect fill="#3375ac" width="30" height="30" y="210"></rect>
          <rect fill="#2c54a0" width="30" height="30" y="240"></rect>
          <rect fill="#253494" width="30" height="30" y="270"></rect>
          <rect fill="#00001d" width="30" height="30" y="300"></rect>
        </g>
        <g transform="translate(0,30)">
          <text x="35" y="20">1–4</text>
          <text x="35" y="50">4–8</text>
          <text x="35" y="80">8–12</text>
          <text x="35" y="110">12–16</text>
          <text x="35" y="140">16–20</text>
          <text x="35" y="170">20–24</text>
          <text x="35" y="200">24–28</text>
          <text x="35" y="230">28–32</text>
          <text x="35" y="260">32–36</text>
          <text x="35" y="290">36–40</text>
          <text x="35" y="320">>40</text>
        </g>
      </svg>
    </div>
    <div class="location-search">
      <Search
        size="sm"
        placeholder={searchPlaceholder} 
        on:change={search}
        bind:value={searchValue}
      />
      {#if showSuggestions }
        <div class="suggestions-wrapper">
          <ul class="suggestions">
            {#if searchOptions && searchOptions.length > 0}
              {#each searchOptions as opt}
                <li>
                  <div class="suggestion" on:click={() => selectSuggestion(opt)}>
                    <div class="suggestion-title">{opt.title}</div>
                    <div class="suggestion-address">{opt.address}</div>
                  </div>
                </li>
              {/each}
            {:else}
              <li>
                <div class="suggestion" on:click={() => selectSuggestion()}>
                  <div class="suggestion-nodata">No Results Found</div>
                </div>
              </li>
            {/if}
          </ul>
        </div>
      {/if}
    </div>
    <Location
      imageOverlayUrl={overlay.src}
      imageOverlayShow={true}
      imageOverlayCoords={overlayCoordinates}
      lng={$locationStore.lng}
      lat={$locationStore.lat}
      boundary={$boundary}
      location={$location}
      resize={sidebarCollapsed}
      zoomToLocationOnLoad={false}
      on:mapclick={mapClick}/>    
  </div> <!-- end content-map -->


</div>
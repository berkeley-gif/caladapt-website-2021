<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Search,
    Tag,
  } from 'carbon-components-svelte';

  // Helpers
  import { searchLocation, getFeatureById, getNearestStation } from '../../../helpers/geocode';
  import { stationsLayer } from './_helpers';

  // Components
  import {
    SelectStation,
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import { notifier } from '../../../components/notifications';

  // Store
  import {
    stationStore,
  } from './_store';

  export let stationsList;

  const dispatch = createEventDispatcher();
  const { station } = stationStore;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address/zipcode/city';
  let showSuggestions = false;

  async function stationClick(e) {
    const station = await getFeatureById(e.detail, stationsLayer.id);
    stationStore.updateStation(station);
  }

  function clearSearch() {
    searchOptions.length = 0;
    searchValue = '';
  }

  async function search(e) {
    searchOptions = await searchLocation(e.target.value);
    showSuggestions = true;
  }

  async function changeStation(e) {
    stationStore.updateStation(e.detail);
  }

  async function selectSuggestion(opt) {
    showSuggestions = false;
    if (opt) {
      console.log('opt', opt);
      // Get nearest station
      const nearest = await getNearestStation(opt.center[0], opt.center[1], stationsLayer.id)
      console.log('nearest', nearest);
      stationStore.updateStation(nearest);
    }
    clearSearch();
  }
</script>

<div class="select-location">
   <!-- Header -->
  <div class="select-location-header">
    <h2>Select Station</h2>
    <p>Select a station from the dropdown list or click on a station location on the map. You can also enter an address/zipcode/city in the search box to find the nearest station.</p>
  </div>

  <div class="select-location-blank">
  </div>

  <!-- Current Selection -->
  <div class="select-location-current block">
    <h3>Selected Station</h3>
    {#if $station}
      <p>{$station.properties.name}</p>
      <p class="small">Elevation: {$station.properties.elevation_m} m</p>
    {/if}
  </div>

  <!-- Location Search -->
  <div class="select-location-search block block-settings">
    <label for="search" class="bx--label">Find Nearest Station</label>
    <Search
      id="search"
      size="lg"
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
  </div> <!-- end search-location -->

  <!-- Location Search -->
  <div class="select-location-select block block-settings">
    <SelectStation 
      items={stationsList}
      selectedId={$stationStore.id}
      on:change={changeStation}
    />
  </div> <!-- end search-location -->

  <!-- Map-->
  <div class="select-location-map">
    <Location
      stations={stationsLayer}
      lng={-122.5}
      lat={36.5}
      zoom={4}
      boundary={null}
      location={$station}
      zoomToLocationOnLoad={true}
      imageOverlayShow={false}
      on:overlayclick={stationClick}
      on:ready={() => dispatch('ready')} />
  </div> <!-- end explore-map -->
</div>



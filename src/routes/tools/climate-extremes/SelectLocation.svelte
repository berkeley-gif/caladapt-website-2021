<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Search,
    Tag,
  } from 'carbon-components-svelte';

  // Helpers
  import { getStation, searchStation } from '../../../helpers/geocode';
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
    locationStore,
    stationStore,
  } from './_store';

  export let stationsList;

  const dispatch = createEventDispatcher();
  const { location } = locationStore;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;

  async function stationClick(e) {
    const station = await getStation(e.detail, stationsLayer.id);
    locationStore.updateLocation(station);
    stationStore.set(station);
  }

  function clearSearch() {
    searchOptions.length = 0;
    searchValue = '';
  }

  async function search(e) {
    searchOptions = await searchStation(e.target.value, stationsLayer.id);
    showSuggestions = true;
  }

  async function changeStation(e) {
    stationStore.set(e.detail);
    //locationStore.set(e.detail);
  }

  function selectSuggestion(opt) {
    showSuggestions = false;
    if (opt) {
      locationStore.updateLocation(opt);
      if (opt.title.includes('Weather Station')) {
        stationStore.set(opt);
      }
    }
    clearSearch();
  }
</script>

<div class="select-location">
   <!-- Header -->
  <div class="select-location-header">
    <h2>Select Station</h2>
    <p>Select a station from the dropdown list or click on a station location on the map. You can also enter an address in the search box to find the nearest station.</p>
  </div>

  <div class="select-location-blank">
  </div>

  <!-- Current Selection -->
  <div class="select-location-current block">
    <h3>Selected Station</h3>
    {#if $stationStore}
      <p>{$stationStore.properties.name}</p>
      <p class="small">Elevation: {$stationStore.properties.elevation_m} m</p>
    {/if}
  </div>

  <!-- Location Search -->
  <div class="select-location-search block block-settings">
    <label for="search" class="bx--label">Search</label>
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
      location={$location}
      zoomToLocationOnLoad={false}
      imageOverlayShow={false}
      on:overlayclick={stationClick}
      on:ready={() => dispatch('ready')} />
  </div> <!-- end explore-map -->
</div>



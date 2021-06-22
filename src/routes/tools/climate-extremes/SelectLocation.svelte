<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Search,
    Button,
    Modal,
    Tag,
  } from 'carbon-components-svelte';

  // Helpers
  import { getStation, searchStation } from '../../../helpers/geocode';
  import { stations } from './_helpers';

  // Components
  import {
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import { notifier } from '../../../components/notifications';

  // Store
  import {
    locationStore,
    stationStore,
  } from './_store';

  const dispatch = createEventDispatcher();
  const { location, boundary } = locationStore;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;

  async function stationClick(e) {
    const station = await getStation(e.detail, stations.id);
    locationStore.updateLocation(station);
    stationStore.set(station);
  }

  function clearSearch() {
    searchOptions.length = 0;
    searchValue = '';
  }

  async function search(e) {
    searchOptions = await searchStation(e.target.value, stations.id);
    showSuggestions = true;
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
    <p>Click on the map or enter an address in the search box. To explore data for a larger extent (e.g. county), select a boundary first. Scroll down to explore data for selected location.</p>
  </div>
  <!-- Help -->
  <div class="select-location-help">
    <Tag interactive>Take a Tour</Tag>
    <Tag interactive>Video Tutorial</Tag>
  </div>

  <!-- Current Selection -->
  <div class="select-location-current block">
    {#if $stationStore}
      <p>{$stationStore.title}</p>
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

  <!-- Map-->
  <div class="select-location-map">
    <Location
      {stations}
      lng={-122.5}
      lat={36.5}
      zoom={4}
      boundary={$boundary}
      location={$location}
      zoomToLocationOnLoad={false}
      imageOverlayShow={false}
      on:overlayclick={stationClick}
      on:ready={() => dispatch('ready')} />
  </div> <!-- end explore-map -->
</div>



<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Search,
    Button,
    Modal,
    Tag,
  } from 'carbon-components-svelte';
  import Upload16 from 'carbon-icons-svelte/lib/Upload16';

  // Helpers
  import { getLocation, searchLocation } from '../../../helpers/geocode';
  import { boundaryList } from './_helpers';

  // Components
  import {
    SelectBoundary,
    UploadBoundary,
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import { notifier } from '../../../components/notifications';

  // Store
  import {
    locationStore,
  } from './_store';

  const dispatch = createEventDispatcher();
  const { location, boundary, lngLat } = locationStore;

  let showUpload = false;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;

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

  async function changeBoundary(e) {
    locationStore.updateBoundary(e.detail.id);
    searchPlaceholder = `Enter ${$boundary.metadata.placeholder}`;
    const loc = await getLocation($lngLat[0], $lngLat[1], e.detail.id);
    locationStore.updateLocation(loc);
  }

  function selectSuggestion(opt) {
    showSuggestions = false;
    console.log('selectSuggestion', opt);
    if (opt) {
      locationStore.updateLocation(opt);
    }
    clearSearch();
  }

  function uploadBoundary(e) {
    console.log('uploadBoundary', e.detail);
    locationStore.updateBoundary('locagrid');
    locationStore.updateLocation(e.detail.location, true);
    showUpload = false;
  }
</script>

<div class="select-location">
   <!-- Header -->
  <div class="select-location-header">
    <h2>Select Location</h2>
    <p>Click on the map or enter an address in the search box. To explore data for a larger extent (e.g. county), select a boundary first. Scroll down to explore data for selected location.</p>
  </div>
  <!-- Help -->
  <div class="select-location-help">
    <Tag interactive>Take a Tour</Tag>
    <Tag interactive>Video Tutorial</Tag>
  </div>

  <!-- Current Selection -->
  <div class="select-location-current block">
    <h3>Selected Location</h3>
    {#if location}
      <p>{$location.title}, {$location.address}</p>
    {/if}
  </div>

  <!-- Boundary Selection -->
  <div class="select-location-boundary block block-settings">
    <SelectBoundary 
      selectedId={$boundary.id}
      items={boundaryList}
      addStateBoundary={true}
      on:change={changeBoundary}
    />
    <div class="boundary-upload">
      <ShowDefinition
       topics={["aggregation-boundary"]}
       title="Aggregating Data by Boundary"
       on:define />
      <Button
        icon={Upload16}
        size="small"
        on:click={() => showUpload = true}>
        Upload
      </Button>      
    </div>
  </div> <!-- end explore-boundary -->

  <!-- Location Search -->
  <div class="select-location-search block block-settings">
    <label for="search" class="bx--label">Search Location</label>
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
        lng={$locationStore.lng}
        lat={$locationStore.lat}
        boundary={$boundary}
        location={$location}
        imageOverlayShow={false}
        on:mapclick={mapClick}
        on:ready={() => dispatch('ready')} />
  </div> <!-- end explore-map -->
</div>

<Modal id="upload"
  bind:open={showUpload}
  modalHeading=""
  passiveModal 
  on:open
  on:close
>
  <UploadBoundary bind:open={showUpload} on:upload={uploadBoundary} />
</Modal>



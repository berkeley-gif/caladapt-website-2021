<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    Search,
    SkeletonText,
    Button,
    Modal,
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
  let showShare = false;

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

  onMount(() => {
    console.log('mounted select')
  })
</script>

<style lang="scss">
  .block {
    background-color: #FFFFFF;
    box-shadow: 0 2px 3px rgba(22, 28, 45, 0.1);
    padding: 1rem;
  }

  .block-settings {
    background-color: #eaecee;
  }

  .block-title {
    font-weight: 600;
    margin: 0;
  }

  .select-location {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
    "tool-header tool-help"
    "tool-map tool-current"
    "tool-map tool-search"
    "tool-map tool-boundary";

    grid-gap: 1rem;
    max-width: 1400px;
    min-height: 200px;

  }

  .select-location-header {
    grid-area: tool-header;

    h2 {
      margin-top: 0;
    }
  }

  .select-location-current {
    grid-area: tool-current;

    p {
      margin: 0;
    }
  }

  .select-location-help {
    grid-area: tool-help;
    ul {
      padding-left: 1rem;
    }
  }

  .select-location-boundary {
    grid-area: tool-boundary;

    .boundary-upload {
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-top: 1rem;
    }
  }

  .select-location-search {
    grid-area: tool-search;
  }

  .select-location-map {
    grid-area: tool-map;
  }

  .suggestions {
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    width: 100%;
    left: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    z-index: 1000;
    overflow: hidden;
    font-size: 15px;
    box-shadow: 0 0 10px 2px rgba(0,0,0,0.1);

    .suggestion {
      cursor: default;
      display: block;
      padding: 6px 12px;
      color: #404040;
    }

    .suggestion:hover {
      color: #404040;
      background-color: #f3f3f3;
      text-decoration: none;
      cursor: pointer;
    }

    .suggestion-title, .suggestion-address {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .suggestion-title {
      font-weight: bold;
    }
  }

  :global(.bx--label::before),
  :global(.bx--accordion__title::before) {
    content: '';
    background: url(img/icons/gear.svg);
    display: inline-block;
    height: 1rem;
    width: 1rem;
    margin-right: 3px;
    vertical-align: -25%;
  }

  :global(.bx--label),
  :global(.bx--accordion__title) {
    color: #04797c;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  :global(.bx--accordion__content) {
    padding-right: 1rem;
  }
</style>

<div class="select-location">
   <!-- Header -->
  <div class="select-location-header">
    <h2>Select Location</h2>
    <p>Click on the map or enter an address in the search box. To explore data for a larger extent (e.g. county), select a boundary first. Scroll down to explore data for selected location.</p>
  </div>
  <!-- Help -->
  <div class="select-location-help">
    <h5 class="block-title">Help</h5>
    <ul style="padding: 0.5rem 1rem 0;">
      <li>
        <a href="#!">Take a Tour</a>
      </li>
      <li>
        <a href="/help/faqs">FAQs</a>
      </li>
    </ul>
  </div>

  <!-- Current Selection -->
  <div class="select-location-current block">
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
    <label class="bx--label">SEARCH LOCATION</label>
    <Search
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



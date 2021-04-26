<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Search,
    SkeletonText,
    Button,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
  } from 'carbon-components-svelte';

  // Helpers
  import { getLocation, searchLocation } from '../../../helpers/geocode';

  // Components
  import { Location } from '../../../components/tools/Location';
  import { notifier } from '../../../components/notifications';

  // Store
  import { 
    climvarStore,
    scenarioStore,
    locationStore, 
    monthStore,
    animationStore,
  } from './_store';

  export let sidebarCollapsed;
  export let appStatus;

  let animationReady = false;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;
  let viz = 'timeseries';

  const dispatch = createEventDispatcher();
  const { location, boundary, lngLat } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { month } = monthStore;

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
    viz = e.detail;
    dispatch('changeViz', e.detail);
  }

  $: if (animationReady) {
    dispatch('ready');
  }
</script>

<style lang="scss">
  .flex-header {
    display: flex;
    align-items: center;
  }
</style>

<div class="content-grid content-grid-animation">
  <!-- Climvar Header -->
  <div class="content-header block">
    <FormGroup legendText="SELECT VISUALIZATION" style="margin-bottom:1rem;">
      <RadioButtonGroup selected="vis" on:change={changeViz}>
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



  <!-- Map-->
  <div class="content-animation">
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
      animation={$animationStore}
      animationShow={true}
      lng={$locationStore.lng}
      lat={$locationStore.lat}
      boundary={$boundary}
      location={$location}
      resize={sidebarCollapsed}
      on:mapclick={mapClick}
      on:ready={() => animationReady = true} />    
  </div> <!-- end content-map -->


</div>
<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Button,
    Modal,
    Search,
    SkeletonText,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    TooltipDefinition,
  } from 'carbon-components-svelte';
  import { format } from 'd3-format';
  import Download16 from 'carbon-icons-svelte/lib/Download16';

  // Helpers
  import { getLocation, searchLocation } from '../../../helpers/geocode';
  import { indicatorList, boundaryList } from './_helpers';

  // Components
  import {
    SelectBoundary,
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import { MinMaxAvg } from '../../../components/tools/Stats';

  // Store
  import { climvarStore, scenarioStore, locationStore, dataStore, thresholdStore, indicatorStore, periodStore } from './_store';

  const dispatch = createEventDispatcher();
  const { location, boundary, lngLat } = locationStore;
  const { data } = dataStore;
  const { threshold } = thresholdStore;
  const { indicator } = indicatorStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  let observedSeries;
  let modelSeries;
  let mapReady = false;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;
  let showDownload = false;

  $: if (mapReady) {
    dispatch('ready');
  }

  $: formatFn = format(`.${$indicator.decimals}f`);
  $: if ($data) {
    observedSeries = $data.filter(d => d.key === 'observed');
    modelSeries = $data.filter(d => d.key !== 'observed');
  } else {
    observedSeries = null;
    modelSeries = null;
  }

  function changeIndicator(e) {
    indicatorStore.updateIndicator(e.detail);
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

  async function changeBoundary(e) {
    locationStore.updateBoundary(e.detail.id);
    searchPlaceholder = `Enter ${$boundary.metadata.placeholder}`;
    const loc = await getLocation($lngLat[0], $lngLat[1], e.detail.id);
    locationStore.updateLocation(loc);
  }

  function selectSuggestion(opt) {
    showSuggestions = false;
    if (opt) {
      locationStore.updateLocation(opt);
    }
    clearSearch();
  }
</script>

<style>
  .flex-header {
    display: flex;
    align-items: center;
  }

  :global(.bx--fieldset) {
    margin-bottom: 1rem;
  }
</style>

<div class="content-grid">
  <!-- Climvar Header -->
  <div class="content-header block">
    <FormGroup legendText="SELECT CHART">
      <RadioButtonGroup selected="frequency" on:change={changeIndicator}>
        {#each indicatorList as opt}
          <RadioButton labelText={opt.name} value={opt.id} />
        {/each}
      </RadioButtonGroup>
    </FormGroup>
    {#if $climvar && $threshold}
      <div class="flex-header">
        <span class="icon">{ @html $climvar.icon }</span>
        <div>
          <h4 class="title">{$indicator.title}</h4>
          {#if ($indicator.id === 'waves')}
            <p>{$indicator.helperText} of
              <TooltipDefinition
                tooltipText="The default threshold temperature for this location is {$threshold} °F. It is defined as the 98th percentile value of historical daily maximum/minimum temperatures (from 1961–1990, between April and October)."
              >
                {$threshold} °F 
              </TooltipDefinition>
              for a period of {$periodStore} days.
             </p>
          {:else}
            <p>{$indicator.helperText} of
              <TooltipDefinition
                tooltipText="The default threshold temperature for this location is {$threshold} °F. It is defined as the 98th percentile value of historical daily maximum/minimum temperatures (from 1961–1990, between April and October)."
              >
                {$threshold} °F
              </TooltipDefinition>
             </p>
          {/if}
        </div>
      </div>
    {:else}
      <SkeletonText heading />
      <SkeletonText />
    {/if}         
  </div> <!-- end content-header -->

  <!-- Stats -->
  <div class="content-stats block">
    <MinMaxAvg
      title={'Observed Data'}
      subtitle={'Baseline (1961-1990)'}
      note={`Values in ${$indicator.units}`}
      data={observedSeries}
      historicalOnly={true}
      start={1961}
      end={1990}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <div class="content-stats block">    
    <MinMaxAvg
      title={'Model Projections'}
      subtitle={'Mid-Century (2035-2064)'}
      note={`Values in ${$indicator.units}`}
      data={modelSeries}
      start={2035}
      end={2064}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <div class="content-stats block">     
    <MinMaxAvg
      title={'Model Projections'}
      subtitle={'End-Century (2070-2099)'}
      note={`Values in ${$indicator.units}`}
      data={modelSeries}
      start={2070}
      end={2099}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <!-- Boundary Selection -->
  <div class="content-boundary block">
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
    </div>
  </div> <!-- end content-boundary -->

  <!-- Map-->
  <div class="content-map">
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
      lng={$locationStore.lng}
      lat={$locationStore.lat}
      boundary={$boundary}
      location={$location}
      on:mapclick={mapClick}
      on:ready={() => mapReady = true} />    
  </div> <!-- end content-map -->

  <!-- Chart-->
  <div class="content-chart block">
    <div>
      {#if $location}
        <span class="chart-title">
          {$location.title}, {$location.address}
        </span>
        <span class="chart-subtitle">{$scenario.labelLong}</span>
      {:else}
        <SkeletonText heading />
        <SkeletonText />
      {/if}
    </div>
    <div style="height:450px;">
      <svelte:component
        this={$indicator.component}
        data={$data}
        yAxis = {{
          key: 'value',
          label: `${$indicator.title} above ${$threshold} °F`,
          baseValue: 0,
          tickFormat: formatFn,
          units: `${$indicator.units}`,
        }}
      /> 
    </div>

    <div class="chart-download">
      <ShowDefinition
       topics={["chart"]}
       title="Chart"
       on:define />
      <Button
        icon={Download16}
        size="small"
        on:click={() => showDownload = true}>
        Download
      </Button> 
    </div>       
  </div> <!-- end content-chart -->


</div>

<Modal id="download"
  bind:open={showDownload}
  modalHeading=""
  passiveModal 
  on:open
  on:close
>
  Show download options
</Modal>

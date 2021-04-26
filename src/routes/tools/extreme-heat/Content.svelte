<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Button,
    Search,
    SkeletonText,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    TooltipDefinition,
  } from 'carbon-components-svelte';
  import { format } from 'd3-format';
  import { csvFormat, csvFormatRows } from 'd3-dsv';
  import Download16 from 'carbon-icons-svelte/lib/Download16';

  // Helpers
  import { getLocation, searchLocation } from '../../../helpers/geocode';
  import { indicatorList, boundaryList } from './_helpers';
  import { flattenData, getDataByDate, formatDataForExport } from './_data';
  import { exportSVG, exportPNG, exportCSV, exportPDF } from  '../../../helpers/export';

  // Components
  import {
    SelectBoundary,
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import DownloadChart from '../../../components/tools/DownloadChart.svelte';
  import { notifier } from '../../../components/notifications';

  // Store
  import { climvarStore, scenarioStore, locationStore, dataStore, thresholdStore, indicatorStore, periodStore } from './_store';

  export let sidebarCollapsed;
  export let appStatus;

  const dispatch = createEventDispatcher();
  const { location, boundary, lngLat } = locationStore;
  const { data } = dataStore;
  const { indicator } = indicatorStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  $: console.log('indicator', $indicator);

  let dataByDate;
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

  $: metadata = [
    ['boundary', $boundary.id],
    ['feature', `${$location.title}, ${$location.address}`],
    ['center', `${$location.center[0]}, ${$location.center[1]}`],
    ['scenario', $scenario.label],
    ['units', $indicator.units],
  ];

  $: formatFn = format(`.${$indicator.decimals}f`);
  $: if ($data) {
    observedSeries = $data.filter(d => d.key === 'observed');
    modelSeries = $data.filter(d => d.key !== 'observed');
    console.log('data', $data);
    dataByDate = getDataByDate(flattenData($data));
    console.log('databydate', dataByDate);
  } else {
    observedSeries = null;
    modelSeries = null;
    dataByDate = null;
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

  async function downloadViz(e) {
    appStatus = 'working';
    const format = e.detail;
    showDownload = false;
    try {
      const container = document.querySelector('.content-chart');
      switch (format) {
        case 'png':
          await exportPNG(container);
          break;
        case 'svg':
          await exportSVG(container);
          break;
        case 'csv':
          var csvData = formatDataForExport(dataByDate);
          var csvWithMetadata = `${csvFormatRows(metadata)} \n \n ${csvFormat(csvData)}`;
          await exportCSV(csvWithMetadata);
          break;
        case 'pdf':
          var gridContainer = document.querySelector('.content-grid');
          await exportPDF(gridContainer, $location);
          break;
        default:
          // Do nothing
      }
      notifier.success('Download', `Successfully created ${format} file`, '', 2000);      
    } catch (error) {
      console.log('download', error);
      notifier.error('Download', `Error creating ${format} file`, error.message, 2000);
    }
    appStatus = 'idle';
  }
</script>

<style>
  .flex-header {
    display: flex;
    align-items: center;
  }
</style>

<div class="content-grid">
  <!-- Climvar Header -->
  <div class="content-header block">
    <FormGroup legendText="SELECT CHART" style="margin-bottom:1rem;">
      <RadioButtonGroup selected="frequency" on:change={changeIndicator}>
        {#each indicatorList as opt}
          <RadioButton labelText={opt.label} value={opt.id} />
        {/each}
      </RadioButtonGroup>
    </FormGroup>
    {#if $climvar && $thresholdStore}
      <div class="flex-header">
        <span class="icon">
          <svelte:component this={$climvar.icon} />
        </span>
        <div>
          <h4 class="title">{$indicator.title}</h4>
          <p>
            {$indicator.helperText} of
            <TooltipDefinition>
              <div slot="tooltip">
                <p style="font-size:0.875rem;">The default threshold temperature for this location is {$thresholdStore} °F. It is defined as the 98th percentile value of historical daily maximum/minimum temperatures (from 1961–1990, between April and October).</p>
                <p style="font-size:0.875rem;">Change this value in the Settings Panel under Threshold Temperature.</p>
              </div>
              {$thresholdStore} °F
            </TooltipDefinition>
            {#if ($indicator.id === 'waves')}
              for a length of
              <TooltipDefinition>
                <div slot="tooltip">
                  <p style="font-size:0.875rem;">By default, a heat wave is defined based on a period of 4 consecutive extreme heat days/warm nights when the daily max/min temperature is above the extreme heat threshold. Each 4 day/night period is counted, so that if extreme temperatures persist for 10 consecutive days/nights, it counts as 2 Heat Waves.</p>
                  <p style="font-size:0.875rem;">Change this length in the Settings Panel under Heat Wave Length.</p>
                </div>
              { $periodStore} days.
              </TooltipDefinition>
            {/if}
           </p>
        </div>
      </div>
    {:else}
      <SkeletonText heading />
      <SkeletonText />
    {/if}         
  </div> <!-- end content-header -->

  <!-- Stats -->
  <div class="content-stats block">
    <svelte:component
      this={$indicator.statsComponent}
      title={'Observed Data'}
      subtitle={'Baseline (1961-1990)'}
      units={$indicator.units}
      note=''
      data={observedSeries}
      historicalOnly={true}
      start={1961}
      end={1990}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <div class="content-stats block">
    <svelte:component
      this={$indicator.statsComponent}
      title={'Model Projections'}
      subtitle={'Mid-Century (2035-2064)'}
      units={$indicator.units}
      note={`Average of ${modelSeries ? modelSeries.length: ''} models`}
      data={modelSeries}
      start={2035}
      end={2064}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <div class="content-stats block">
    <svelte:component
      this={$indicator.statsComponent}
      title={'Model Projections'}
      subtitle={'End-Century (2070-2099)'}
      units={$indicator.units}
      note={`Average of ${modelSeries ? modelSeries.length: ''} models`}
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
      resize={sidebarCollapsed}
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
    <svelte:component
      this={$indicator.chartComponent}
      data={$data}
      dataByDate={dataByDate}
      yAxis = {{
        key: 'value',
        label: `${$indicator.title} above ${$thresholdStore} °F`,
        baseValue: 0,
        tickFormat: formatFn,
        units: `${$indicator.units}`,
      }}
    />
    <div class="chart-notes">
      <span>Source: Cal-Adapt.</span>
      <span>Data: LOCA Downscaled Climate Projections (Scripps Institution Of Oceanography - University of California, San Diego), Gridded Observed Meteorological Data (University of Colorado, Boulder).</span>
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

<DownloadChart bind:open={showDownload} on:download={downloadViz} />

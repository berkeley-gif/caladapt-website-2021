<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Search,
    SkeletonText,
    Button,
    Modal,
  } from 'carbon-components-svelte';
  import { format } from 'd3-format';
  import { csvFormat, csvFormatRows } from 'd3-dsv';
  import Upload16 from 'carbon-icons-svelte/lib/Upload16';
  import Download16 from 'carbon-icons-svelte/lib/Download16';

  // Helpers
  import { getLocation, searchLocation } from '../../../helpers/geocode';
  import { boundaryList } from './_helpers';
  import { flattenData, getDataByDate, formatDataForExport } from './_data';
  import { exportSVG, exportPNG, exportCSV, exportPDF } from  '../../../helpers/export';

  // Components
  import {
    SelectBoundary,
    UploadBoundary,
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import { LineAreaChart } from '../../../components/tools/Charts';
  import { MinMaxAvg } from '../../../components/tools/Stats';
  import DownloadChart from '../../../components/tools/DownloadChart.svelte';
  import { notifier } from '../../../components/notifications';

  // Store
  import { climvarStore, scenarioStore, locationStore, dataStore } from './_store';

  export let sidebarCollapsed;
  export let appStatus;

  const dispatch = createEventDispatcher();
  const { location, boundary, lngLat } = locationStore;
  const { data } = dataStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  let dataByDate;
  let observedSeries;
  let modelSeries;
  let mapReady = false;
  let showUpload = false;
  let showDownload = false;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;

  $: if (mapReady) {
    dispatch('ready');
  }

  $: metadata = [
    ['boundary', $boundary.id],
    ['feature', `${$location.title}, ${$location.address}`],
    ['center', `${$location.center[0]}, ${$location.center[1]}`],
    ['scenario', $scenario.label],
    ['units', $climvar.units.imperial],
  ];

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if ($data) {
    observedSeries = $data.filter(d => d.key === 'observed');
    modelSeries = $data.filter(d => d.key !== 'observed' && d.type !== 'area');
    dataByDate = getDataByDate(flattenData($data));
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
      notifier.error('Download', `Error creating ${format} file`, error, 2000);
    }
    appStatus = 'idle';
  }
</script>

<style lang="scss">
</style>

<div class="content-grid">
  <!-- Stats -->
  <div class="content-stats block">
    <MinMaxAvg
      title={`Observed Historical ${$climvar.title}`}
      subtitle={'Baseline (1961-1990)'}
      units={$climvar.units.imperial}
      note={''}
      data={observedSeries}
      historicalOnly={true}
      start={1961}
      end={1990}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <div class="content-stats block">    
    <MinMaxAvg
      title={`Future Projections of ${$climvar.title}`}
      subtitle={'Mid-Century (2035-2064)'}
      units={$climvar.units.imperial}
      note={`Average of ${modelSeries ? modelSeries.length: ''} models`}
      data={modelSeries}
      start={2035}
      end={2064}
      format={formatFn}
    />
  </div> <!-- end content-stats -->

  <div class="content-stats block">     
    <MinMaxAvg
      title={`Future Projections of ${$climvar.title}`}
      subtitle={'End-Century (2070-2099)'}
      units={$climvar.units.imperial}
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
      <Button
        icon={Upload16}
        size="small"
        on:click={() => showUpload = true}>
        Upload
      </Button>      
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
      {#if $climvar}
        <div class="center-row">
          <span class="icon">
            <svelte:component dimension="50" this={$climvar.icon} />
          </span>
          <span class="chart-title">{$climvar.title}</span>          
        </div>
      {/if}
      {#if $location}
        <span class="chart-subtitle" style="margin-top:0.5rem;">
          {$location.title}, {$location.address}
        </span>
        <span class="chart-subtitle">{$scenario.labelLong}</span>
      {:else}
        <SkeletonText heading />
        <SkeletonText />
      {/if}
    </div>
    <LineAreaChart
      data={$data}
      dataByDate={dataByDate}
      yAxis = {{
        key: 'value',
        label: `${$climvar.title} (${$climvar.units.imperial})`,
        tickFormat: formatFn,
        units: `${$climvar.units.imperial}`,
      }}
    /> 
    <div class="chart-notes">
      <span>Source: Cal-Adapt. </span>
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

<Modal id="upload"
  bind:open={showUpload}
  modalHeading=""
  passiveModal 
  on:open
  on:close
>
  <UploadBoundary bind:open={showUpload} on:upload={uploadBoundary} />
</Modal>

<DownloadChart bind:open={showDownload} on:download={downloadViz} />



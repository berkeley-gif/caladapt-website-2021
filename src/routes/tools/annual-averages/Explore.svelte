<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    Search,
    SkeletonText,
    Button,
    Modal,
    Accordion,
    AccordionItem,
    CodeSnippet,
  } from 'carbon-components-svelte';
  import { format } from 'd3-format';
  import { csvFormat, csvFormatRows } from 'd3-dsv';
  import Upload16 from 'carbon-icons-svelte/lib/Upload16';
  import Download16 from 'carbon-icons-svelte/lib/Download16';
  import Share16 from "carbon-icons-svelte/lib/Share16";
  import copy from 'clipboard-copy';

  // Helpers
  import { getLocation, searchLocation } from '../../../helpers/geocode';
  import { boundaryList, climvarList, modelList, scenarioList } from './_helpers';
  import { flattenData, getDataByDate, formatDataForExport } from './_data';
  import { exportSVG, exportPNG, exportCSV, exportPDF } from  '../../../helpers/export';

  // Components
  import {
    SelectBoundary,
    UploadBoundary,
    SelectScenario,
    SelectModels,
    SelectClimvar,
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import { Location } from '../../../components/tools/Location';
  import { LineAreaChart } from '../../../components/tools/Charts';
  import { RangeAvg } from '../../../components/tools/Stats';
  import DownloadChart from '../../../components/tools/DownloadChart.svelte';
  import { notifier } from '../../../components/notifications';

  // Store
  import {
    climvarStore,
    scenarioStore,
    locationStore,
    dataStore,
    modelsStore,
    bookmark,
  } from './_store';

  export let appStatus;

  const dispatch = createEventDispatcher();
  const { location, boundary, lngLat } = locationStore;
  const { data } = dataStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  let dataByDate;
  let statsData;
  let mapReady = false;
  let showUpload = false;
  let showDownload = false;

  let searchOptions = [];
  let searchValue = '';
  let searchPlaceholder = 'Enter address or zipcode';
  let showSuggestions = false;
  let showShare = false;

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
    statsData = $data.filter(d => d.type !== 'area');
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
      const container = document.querySelector('.explore-chart');
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
          var gridContainer = document.querySelector('.explore-grid');
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

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
    console.log('scenario change');
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds.join(','));
    console.log('models change');
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
    console.log('climvar change');
  }

  onMount(() => {
    console.log('mounted explore')
  })
</script>

<style lang="scss">
  .block {
    background-color: #FFFFFF;
    box-shadow: 0 2px 3px rgba(22, 28, 45, 0.1);
    padding: 1rem;
  }

  .block-title {
    font-weight: 600;
    margin: 0;
  }

  .explore {
    display: grid;
    grid-template-columns: repeat(15, [col] 1fr );
    grid-template-rows: min-content min-content 150px auto;
    grid-gap: 1rem;
    max-width: 1400px;
    min-height: 400px;
  }

  .explore-header {
    grid-column: 1 / span 12;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .explore-help {
    grid-column: 13 / span 3;
    grid-row: 1;

    ul {
      padding: 0 1rem;
    }
  }

  .explore-stats {
    grid-column: 1 / span 12;
    grid-row: 2;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    div.block {
      height: 100%;
      flex: 2 0 auto;
      margin: 0 0.5rem;
    }

    div.block.small {
      flex: 1 0 auto;
    }

    div.block:first-child {
      margin-left: 0;
    }

    div.block:last-child {
      margin-right: 0;
    }
  }

  .explore-boundary {
    grid-column: 1 / span 4;
    grid-row: 3;

    .boundary-upload {
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-top: 1rem;
    }
  }

  .explore-chart {
    grid-column: 5 / span 8;
    grid-row: 3 / span 2;

    .chart-title {
      font-weight: 600;
      font-size: 1.25rem;
      display: block;
      line-height: 1.5;
    }

    .chart-subtitle {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      display: block;
    }

    .chart-notes {
      padding: 1rem 0;
      font-size: 0.75rem;
    }

    .chart-download {
      display:flex;
      justify-content:space-between;
      align-items:center;
    }
  }

  .explore-map {
    grid-column: 1 / span 4;
    grid-row: 4;
    min-height: 400px;
    height: 100%;
    position: relative;
    box-shadow: 0 2px 3px rgba(22, 28, 45, 0.1);
  }

  .explore-settings {
    grid-column: 13 / span 3;
    grid-row: 2 / -1;
    padding: 0;

    .settings-header {
      padding: 0 1rem;
    }
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

  .location-search {
    position: absolute;
    left: 5px;
    top: 5px;
    z-index: 2;
    box-shadow: 0 1.5rem 4rem rgba(22, 28, 45, 0.05);
    width: 14rem;
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

<div class="explore">

  <!-- Header -->
  <div class="explore-header block">
    {#if $climvar}
    <div class="center-row">
      <span class="icon">
        <svelte:component dimension="50" this={$climvar.icon} />
      </span>
      <h3 class="block-title">{$climvar.title}</h3>   
    </div>       
    {/if}
    <Button  size="small" icon={Share16} kind="ghost" on:click={() => showShare = true}>
      SHARE
    </Button>
  </div>

  <!-- Help -->
  <div class="explore-help block">
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

  <!-- Stats -->
  <div class="explore-stats">
    <div class="block small">
      <RangeAvg
        units={$climvar.units.imperial}
        data={statsData}
        isHistorical={true}
        series={'historical'}
        period={'baseline'}
        format={formatFn}
      />      
    </div>
    <div class="block">
      <RangeAvg
        units={$climvar.units.imperial}
        data={statsData}
        isHistorical={false}
        series={'future'}
        period={'mid-century'}
        format={formatFn}
      />    
    </div>
    <div class="block">
      <RangeAvg
        units={$climvar.units.imperial}
        data={statsData}
        isHistorical={false}
        series={'future'}
        period={'end-century'}
        format={formatFn}
      />      
    </div>
  </div> <!-- end explore-stats -->

  <!-- Boundary Selection -->
  <div class="explore-boundary block">
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

  <!-- Chart-->
  <div class="explore-chart block">
    <div>
      {#if $location}
        <h4 class="block-title">{$location.title}, {$location.address}</h4>
        <h5 class="block-title">{$scenario.labelLong}</h5>
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
        Download Chart
      </Button> 
    </div>       
  </div> <!-- end explore-chart -->

  <!-- Map-->
  <div class="explore-map">
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
      imageOverlayShow={false}
      on:mapclick={mapClick}
      on:ready={() => mapReady = true} />    
  </div> <!-- end explore-map -->

  <div class="explore-settings block"> 
    <h5 class="block-title" style="padding:1rem;">Change Settings</h5>
    <Accordion class="settings-list">
      <AccordionItem open title="Climate Variable">
        <SelectClimvar
          selectedId={$climvarStore}
          items={climvarList}
          on:change={changeClimvar}
        />
        <ShowDefinition
          on:define
          topics={["annual-average-tasmax", "annual-average-tasmin", "annual-average-pr"]}
          title="Climate Variables" />
      </AccordionItem>
      <AccordionItem open title="Scenario">
        <SelectScenario
          selectedId={$scenarioStore}
          items={scenarioList}
          on:change={changeScenario}
        />
        <ShowDefinition
          on:define
          topics={["climate-scenarios"]}
          title="RCP Scenarios" />
      </AccordionItem>
      <AccordionItem title="Models">
        <SelectModels 
          selectedIds={$modelsStore}
          items={modelList}
          on:change={changeModels}
        />
        <ShowDefinition
          on:define
          topics={["gcms"]}
          title="Global Climate Models (GCMs)" />
      </AccordionItem>
    </Accordion>
  </div>
</div>

<Modal id="share" passiveModal bind:open={showShare} modalHeading="Share Link" on:open on:close>
  <CodeSnippet
   type="multi"
   wrapText
   code={$bookmark}
   on:click={() => copy($bookmark)} />
</Modal>

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



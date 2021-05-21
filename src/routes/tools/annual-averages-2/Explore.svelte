<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    SkeletonText,
    Button,
    Modal,
    Accordion,
    AccordionItem,
    CodeSnippet,
  } from 'carbon-components-svelte';
  import { format } from 'd3-format';
  import { csvFormat, csvFormatRows } from 'd3-dsv';
  import Download16 from 'carbon-icons-svelte/lib/Download16';
  import Share16 from "carbon-icons-svelte/lib/Share16";
  import copy from 'clipboard-copy';

  // Helpers
  import { climvarList, modelList, scenarioList } from './_helpers';
  import { flattenData, getDataByDate, formatDataForExport } from './_data';
  import { exportSVG, exportPNG, exportCSV, exportPDF } from  '../../../helpers/export';

  // Components
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    ShowDefinition,
  } from '../../../components/tools/Settings';
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
  const { models } = modelsStore;

  let dataByDate;
  let observedData;
  let modeledData;
  let statsData;
  let modelCount = 0;
  let showDownload = false;
  let showShare = false;

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

  .block-settings {
    background-color: #dadee1;
  }

  .block-title {
    font-weight: 600;
    margin: 0;
  }

  .explore {
    display: grid;
    grid-template-columns: 3fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
    "tool-header tool-settings"
    "tool-stats tool-settings"
    "tool-chart tool-settings";

    grid-gap: 1rem;
    max-width: 1400px;
    min-height: 400px;

  }

  .explore-header {
    grid-area: tool-header;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .explore-stats {
    grid-area: tool-stats;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    div.block {
      height: 100%;
      flex: 1 0 auto;
      margin: 0 0.5rem;
    }

    div.block:first-child {
      margin-left: 0;
    }

    div.block:last-child {
      margin-right: 0;
    }
  }

  .explore-chart {
    grid-area: tool-chart;

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

  .explore-settings {
    grid-area: tool-settings;

    padding: 0;
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
    font-size: 0.8rem;
  }

  .explore-settings :global(.bx--accordion__item) {
    background-color: #eaecee;
    margin: 0.5rem 0;
  }

  .explore-settings :global(.bx--accordion__heading:hover::before) {
    background-color: #eaecee;
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
        <div>
          <h3 class="block-title">{$climvar.title}</h3>
          {#if $location}
            <h4 class="block-title">{$location.title}, {$location.address}</h4>
            <h4 class="block-title">{$scenario.labelLong}</h4>
          {:else}
            <SkeletonText heading />
            <SkeletonText />
          {/if}
        </div>
      </div>
    {/if}
    <div>
      <Button  size="small" icon={Share16} kind="ghost" on:click={() => showShare = true}>
        SHARE
      </Button>      
    </div> 
  </div>

  <!-- Stats -->
  <div class="explore-stats">
    <div class="block">
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
  </div> <!-- end explore-stats -->

  <!-- Chart-->
  <div class="explore-chart block">
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
  </div> <!-- end explore-chart -->

  <div class="explore-settings"> 
    <h5 class="block-title">Change Settings:</h5>
    <Accordion class="settings-list">
      <AccordionItem open title="Select Climate Variable">
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
      <AccordionItem open title="Choose Scenario">
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
      <AccordionItem title="Select Models">
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

<DownloadChart bind:open={showDownload} on:download={downloadViz} />



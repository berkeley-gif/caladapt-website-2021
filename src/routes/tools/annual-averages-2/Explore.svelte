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
  const { location, boundary } = locationStore;
  const { data } = dataStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  let dataByDate;
  let statsData;
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
    <h4 class="block-title">Change Settings:</h4>
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



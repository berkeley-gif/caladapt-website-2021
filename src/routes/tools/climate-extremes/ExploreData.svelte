<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Button,
    Modal,
    Accordion,
    AccordionItem,
    CodeSnippet,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    NumberInput,
    SkeletonText,
    Slider,
  } from 'carbon-components-svelte';
  import { format } from 'd3-format';
  import { timeFormat, timeParse } from 'd3-time-format';
  import { csvFormat, csvFormatRows } from 'd3-dsv';
  import { Download16, Share16 } from 'carbon-icons-svelte';
  import ChartLineData32 from 'carbon-icons-svelte/lib/ChartLineData32';
  import { ReturnLevelCurveChart, Histogram } from '../../../components/tools/Charts';
  import copy from 'clipboard-copy';

  // Helpers
  import { climvarList, modelList, scenarioList, indicatorList } from './_helpers';
  import {
    getReturnLevels,
    getProbabilities,
    formatDataForExport,
  } from './_data';
  import {
    exportSVG,
    exportPNG,
    exportCSV,
    exportPDF,
  } from  '../../../helpers/export';
  import { debounce } from '../../../helpers/utilities';

  // Components
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    SelectDayOfYear,
    ShowDefinition,
  } from '../../../components/tools/Settings';
  import DownloadChart from '../../../components/tools/DownloadChart.svelte';
  import { notifier } from '../../../components/notifications';

  // Store
  import {
    climvarStore,
    scenarioStore,
/*    locationStore,*/
    dataStore,
    modelsStore,
    stationStore,
    bookmark,
    doyStore,
    temperatureStore,
    indicatorStore,
    observedStore,
  } from './_store';

  const dispatch = createEventDispatcher();

/*  const { location } = locationStore;*/
  const { data } = dataStore;
  const { observed } = observedStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { indicator } = indicatorStore;
  const { doyText } = doyStore;

  export let runUpdate = false;

  let isLoading = true;
  let statsData;
  let returnLevels;
  let timeseries;
  let series;
  let showDownload = false;
  let showShare = false;

  $: metadata = [
    ['station', $stationStore.title],
    ['center', `${$stationStore.geometry.coordinates[0]}, ${$stationStore.geometry.coordinates[1]}`],
    ['scenario', $scenario.label],
    ['units', $climvar.units.imperial],
  ];

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if ($data) {
    returnLevels = getReturnLevels($data);
    console.log('returnlevels', returnLevels);
    series = $data.map(d => ({ key: d.key, label: d.label, color: d.color }));
    console.log('series', series);
    isLoading = false;
  } else {
    isLoading = true;
    returnLevels = null;
    statsData = null;
  }

  $: if ($observed) {
    timeseries = $observed.map(d => d.value);
    console.log('timeseries', timeseries);
  } else {
    timeseries = null;
  }

  async function downloadViz(e) {
    isLoading = true;
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
          var csvData = formatDataForExport(data);
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
    isLoading = false;
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

  function changeDayOfYear(e) {
    doyStore.set(e.detail);
    console.log('doy change', e.detail);
  }

  function changeIndicator(e) {
    indicatorStore.updateIndicator(e.detail);
  }

  const changeTemperature = debounce((e) => {
    console.log('temperature change');
    temperatureStore.set(e.detail)
  }, 1000);
</script>

<div class="explore">
  {#if isLoading}
    <div class="explore-loading-overlay">
      {#if !runUpdate}
        <Button
          icon={ChartLineData32}
          class="load"
          on:click={() => dispatch('update')}>
          Fetch Data
        </Button>
      {/if}
    </div>
  {/if}

  <!-- Header -->
  <div class="explore-header">
    <h2>Explore Data</h2>
    {#if isLoading}
      <p>Click on the Fetch Data button to download data for selected station.</p>
    {/if}
  </div>

  <!-- Controls -->
  <div class="explore-controls">
    <Button
      icon={Download16}
      size="small"
      on:click={() => showDownload = true}>
      DOWNLOAD
    </Button> 
    <Button
      size="small"
      icon={Share16}
      on:click={() => showShare = true}>
      SHARE
    </Button> 
  </div>

  <!-- Title -->
  <div class="explore-title block">
    <div>
      <FormGroup legendText="SELECT VIEW" style="margin-bottom:1rem;">
        <RadioButtonGroup selected="observations" on:change={changeIndicator}>
          {#each indicatorList as opt}
            <RadioButton labelText={opt.label} value={opt.id} />
          {/each}
        </RadioButtonGroup>
      </FormGroup>
      <div class="center-row">
        <span class="icon">
          <svelte:component dimension="50" this={$climvar.icon} />
        </span>
        <div>
          <h3 class="block-title">{$indicator.title} of {$climvar.title} around {$doyText} (± 15 days) </h3>
          <h4 class="block-title">{$stationStore.properties.name}</h4>
          <h4 class="block-title">{$scenario.labelLong}</h4>
          <p></p>
        </div>
      </div>
    </div> 
  </div>
  <!-- Stats -->
  <div class="explore-stats">
    <div class="block temperature">

        <NumberInput
          label="Select Temperature"
          value={$temperatureStore}
          on:change={changeTemperature}
        />
        <ShowDefinition
          on:define
          topics={["extreme-heat-threshold"]} />
    </div>
    <div class="block">
<!--       <RangeAvg
        units={$climvar.units.imperial}
        data={statsData}
        isHistorical={false}
        series={'future'}
        period={'mid-century'}
        format={formatFn}
      /> -->      
    </div>
  </div> <!-- end explore-stats -->
  <!-- Chart-->
  <div class="explore-chart block">
    {#if $indicator.id === 'observations'}
      <Histogram
        data={timeseries}
        yAxis = {{
          label: `Count of Days`,
          tickFormat: d => d,
        }}
        xAxis = {{
          label: `${$climvar.title} (${$climvar.units.imperial})`,
          tickFormat: d => d,
        }}
      />
    {:else if $indicator.id === 'projections'}
      <ReturnLevelCurveChart
        data={returnLevels}
        legend={series}
        yAxis = {{
          key: 'value',
          label: `Return Level (${$climvar.units.imperial})`,
          tickFormat: formatFn,
          units: `${$indicator.units}`,
        }}
        xAxis = {{
          key: 'period',
          label: `Return Period (years)`,
          tickFormat: d => d,
          units: 'year',
        }}
      />
    {/if}
    <div class="chart-notes">
      <span>Source: Cal-Adapt. </span>
      <span>Data: HadISD, LOCA Downscaled Climate Projections (Scripps Institution Of Oceanography - University of California, San Diego).</span>
    </div>
    <div class="chart-download">
      <ShowDefinition
       topics={["chart"]}
       title="Chart"
       on:define />
    </div>       
  </div> <!-- end explore-chart -->
  
  <!-- Settings-->
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
      <AccordionItem open title="Choose Day of Year">
        <SelectDayOfYear
          value={$doyStore}
          on:change={changeDayOfYear}
        />
        <ShowDefinition
          on:define
          topics={["climate-scenarios"]}
          title="Day of Year" />
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
  </div> <!-- end explore-settings -->
</div>

<Modal id="share" passiveModal bind:open={showShare} modalHeading="Share Link" on:open on:close>
  <CodeSnippet
   type="multi"
   wrapText
   code={$bookmark}
   on:click={() => copy($bookmark)} />
</Modal>

<DownloadChart bind:open={showDownload} on:download={downloadViz} />



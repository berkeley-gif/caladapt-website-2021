<script>
  import { createEventDispatcher } from "svelte";
  import {
    Button,
    Modal,
    Accordion,
    AccordionItem,
    CodeSnippet,
    SkeletonText,
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { csvFormat, csvFormatRows } from "d3-dsv";
  import { Download16, Share16, ChartLineData32 } from "carbon-icons-svelte";
  import copy from "clipboard-copy";

  // Helpers
  import { climvarList, modelList, scenarioList } from "./_helpers";
  import { flattenData, getDataByDate, formatDataForExport } from "./_data";
  import {
    exportSVG,
    exportPNG,
    exportCSV,
    exportPDF,
  } from "../../../helpers/export";

  // Components
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    ShowDefinition,
  } from "../../../components/tools/Settings";
  import { LineAreaChart } from "../../../components/tools/Charts";
  import { RangeAvg } from "../../../components/tools/Stats";
  import DownloadChart from "../../../components/tools/DownloadChart.svelte";
  import { notifier } from "../../../components/notifications";

  // Store
  import {
    climvarStore,
    scenarioStore,
    locationStore,
    dataStore,
    modelsStore,
    bookmark,
  } from "./_store";

  export let runUpdate = false;

  const dispatch = createEventDispatcher();

  const { location, boundary } = locationStore;
  const { data } = dataStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  let isLoading = true;
  let dataByDate;
  let statsData;
  let showDownload = false;
  let showShare = false;

  $: metadata = [
    ["boundary", $boundary.id],
    ["feature", `${$location.title}, ${$location.address}`],
    ["center", `${$location.center[0]}, ${$location.center[1]}`],
    ["scenario", $scenario.label],
    ["units", $climvar.units.imperial],
  ];

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if ($data) {
    statsData = $data.filter((d) => d.type !== "area");
    dataByDate = getDataByDate(flattenData($data));
    isLoading = false;
  } else {
    statsData = null;
    dataByDate = null;
    isLoading = true;
  }

  async function downloadViz(e) {
    isLoading = true;
    const format = e.detail;
    showDownload = false;
    try {
      const container = document.querySelector(".explore-chart");
      switch (format) {
        case "png":
          await exportPNG(container);
          break;
        case "svg":
          await exportSVG(container);
          break;
        case "csv":
          var csvData = formatDataForExport(dataByDate);
          var csvWithMetadata = `${csvFormatRows(metadata)} \n \n ${csvFormat(
            csvData
          )}`;
          await exportCSV(csvWithMetadata);
          break;
        case "pdf":
          var gridContainer = document.querySelector(".explore-grid");
          await exportPDF(gridContainer, $location);
          break;
        default:
        // Do nothing
      }
      notifier.success(
        "Download",
        `Successfully created ${format} file`,
        "",
        2000
      );
    } catch (error) {
      notifier.error("Download", `Error creating ${format} file`, error, 2000);
    }
    isLoading = false;
  }

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
    console.log("scenario change");
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds.join(","));
    console.log("models change");
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
    console.log("climvar change");
  }
</script>

<div class="explore">
  {#if isLoading}
    <div class="explore-loading-overlay"></div>
  {/if}

  <!-- Header -->
  <div class="explore-controls">
    <Button
      icon="{ChartLineData32}"
      disabled="{runUpdate}"
      on:click="{() => dispatch('update')}"
    >
      FETCH DATA FOR LOCATION
    </Button>
  </div>

  <!-- Title -->
  <div class="explore-title block">
    <div class="center-row">
      <span class="icon">
        <svelte:component this="{$climvar.icon}" dimension="50" />
      </span>
      <div>
        <h3 class="block-title">{$climvar.title}</h3>
        {#if $location}
          <h4 class="block-title">
            {$location.title}, {$location.address}
          </h4>
        {:else}
          <SkeletonText heading />
        {/if}
        <h4 class="block-title">{$scenario.labelLong}</h4>
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="explore-stats">
    <div class="block">
      <RangeAvg
        units="{$climvar.units.imperial}"
        data="{statsData}"
        isHistorical="{true}"
        series="{'historical'}"
        period="{'baseline'}"
        format="{formatFn}"
      />
    </div>
    <div class="block">
      <RangeAvg
        units="{$climvar.units.imperial}"
        data="{statsData}"
        isHistorical="{false}"
        series="{'future'}"
        period="{'mid-century'}"
        format="{formatFn}"
      />
    </div>
    <div class="block">
      <RangeAvg
        units="{$climvar.units.imperial}"
        data="{statsData}"
        isHistorical="{false}"
        series="{'future'}"
        period="{'end-century'}"
        format="{formatFn}"
      />
    </div>
  </div>

  <!-- Chart-->
  <div class="explore-chart block">
    <LineAreaChart
      data="{$data}"
      dataByDate="{dataByDate}"
      yAxis="{{
        key: 'value',
        label: `${$climvar.title} (${$climvar.units.imperial})`,
        tickFormat: formatFn,
        units: `${$climvar.units.imperial}`,
      }}"
    />
    <div class="chart-notes">
      <p>
        Source: Cal-Adapt. Data: LOCA Downscaled Climate Projections (Scripps
        Institution Of Oceanography - University of California, San Diego),
        Gridded Observed Meteorological Data (University of Colorado, Boulder).
      </p>
    </div>
    <div class="chart-download">
      <ShowDefinition
        topics="{['annual-averages-chart']}"
        title="Chart"
        on:define
      />
      <div>
        <Button icon="{Download16}" on:click="{() => (showDownload = true)}">
          DOWNLOAD
        </Button>
        <Button icon="{Share16}" on:click="{() => (showShare = true)}">
          SHARE
        </Button>
      </div>
    </div>
  </div>

  <!-- Settings-->
  <div class="explore-settings">
    <h4 class="block-title">Change Settings:</h4>
    <Accordion class="settings-list">
      <AccordionItem open title="Select Climate Variable">
        <SelectClimvar
          selectedId="{$climvarStore}"
          items="{climvarList}"
          on:change="{changeClimvar}"
        />
        <ShowDefinition
          on:define
          topics="{[
            'annual-average-tasmax',
            'annual-average-tasmin',
            'annual-average-pr',
          ]}"
          title="Climate Variables"
        />
      </AccordionItem>
      <AccordionItem open title="Choose Scenario">
        <SelectScenario
          selectedId="{$scenarioStore}"
          items="{scenarioList}"
          on:change="{changeScenario}"
        />
        <ShowDefinition
          on:define
          topics="{['climate-scenarios']}"
          title="RCP Scenarios"
        />
      </AccordionItem>
      <AccordionItem title="Select Models">
        <SelectModels
          selectedIds="{$modelsStore}"
          items="{modelList}"
          on:change="{changeModels}"
        />
        <ShowDefinition
          on:define
          topics="{['gcms']}"
          title="Global Climate Models (GCMs)"
        />
      </AccordionItem>
    </Accordion>
  </div>
</div>

<Modal
  id="share"
  passiveModal
  bind:open="{showShare}"
  modalHeading="Share Link"
  on:open
  on:close
>
  <CodeSnippet
    type="multi"
    wrapText
    code="{$bookmark}"
    on:click="{() => copy($bookmark)}"
  />
</Modal>

<DownloadChart bind:open="{showDownload}" on:download="{downloadViz}" />

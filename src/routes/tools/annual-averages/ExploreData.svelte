<script>
  import {
    Button,
    Modal,
    Accordion,
    AccordionItem,
    CodeSnippet,
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { csvFormat, csvFormatRows } from "d3-dsv";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";
  import copy from "clipboard-copy";

  // Helpers
  import {
    climvarList,
    modelList,
    scenarioList,
    boundaryList,
  } from "./_helpers";
  import { flattenData, getDataByDate, formatDataForExport } from "./_data";

  // Components
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    ShowDefinition,
  } from "../../../components/tools/Settings";
  import { StaticMap } from "../../../components/tools/Location";
  import { LineAreaChart } from "../../../components/tools/Charts";
  import { RangeAvg } from "../../../components/tools/Stats";

  // Store
  import {
    climvarStore,
    scenarioStore,
    locationStore,
    dataStore,
    modelsStore,
    bookmark,
    datasetStore,
  } from "./_store";

  const { location, boundary } = locationStore;
  const { data } = dataStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { titles } = datasetStore;

  let isLoading = true;
  let dataByDate;
  let statsData;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;

  let ChangeLocation;
  let DownloadChart;

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  async function loadLocation() {
    showChangeLocation = true;
    ChangeLocation = (
      await import("../../../components/tools/Partials/ChangeLocation.svelte")
    ).default;
  }

  async function loadDownload() {
    showDownload = true;
    csvData = formatDataForExport(dataByDate);
    metadata = [
      ["boundary", $boundary.id],
      ["feature", $location.title],
      ["center", `${$location.center[0]}, ${$location.center[1]}`],
      ["scenario", $scenario.label],
      ["climate indicator", $climvar.label],
      ["units", $climvar.units.imperial],
    ];
    printContainer = document.querySelector(".explore");
    printSkipElements = ["explore-settings"];
    DownloadChart = (
      await import("../../../components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

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

  function changeLocation(e) {
    if (e.detail.boundaryId === "custom") {
      locationStore.updateBoundary("locagrid");
      locationStore.updateLocation(e.detail.location, true);
    } else {
      locationStore.updateBoundary(e.detail.boundaryId);
      locationStore.updateLocation(e.detail.location);
    }
    console.log("location change");
  }
</script>

<div class="explore">
  {#if isLoading}
    <div class="explore-loading-overlay"></div>
  {/if}

  <!-- Controls -->
  <div class="explore-controls"></div>

  <!-- Title -->
  <div class="explore-header block">
    <StaticMap location="{$location}" width="{300}" height="{300}" />
    <div class="explore-header-title">
      <h3><span class="block-title">{$location.title}</span></h3>
      <h4>
        Projected changes in <span class="block-title">{$climvar.title}</span>
        under a <span class="block-title">{$scenario.labelLong}</span>.
      </h4>
      <Button size="small" icon="{Location16}" on:click="{loadLocation}">
        Change Location
      </Button>
    </div>
  </div>

  <!-- Stats -->
  <ul class="explore-stats">
    <li class="block">
      <RangeAvg
        units="{$climvar.units.imperial}"
        data="{statsData}"
        isHistorical="{true}"
        series="{'historical'}"
        period="{'baseline'}"
        format="{formatFn}"
      />
    </li>
    <li class="block">
      <RangeAvg
        units="{$climvar.units.imperial}"
        data="{statsData}"
        isHistorical="{false}"
        series="{'future'}"
        period="{'mid-century'}"
        format="{formatFn}"
      />
    </li>
    <li class="block">
      <RangeAvg
        units="{$climvar.units.imperial}"
        data="{statsData}"
        isHistorical="{false}"
        series="{'future'}"
        period="{'end-century'}"
        format="{formatFn}"
      />
    </li>
  </ul>

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
        Source: Cal-Adapt. Data: {$titles.join(", ")}.
      </p>
    </div>
    <div class="chart-download">
      <ShowDefinition
        topics="{['annual-averages-chart']}"
        title="Chart"
        on:define
      />
      <div>
        <Button size="small" icon="{Download16}" on:click="{loadDownload}">
          Download Chart
        </Button>
        <Button
          size="small"
          icon="{Share16}"
          on:click="{() => (showShare = true)}"
        >
          Share
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
      <AccordionItem open title="Select Models">
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

<svelte:component
  this="{ChangeLocation}"
  bind:open="{showChangeLocation}"
  location="{$location}"
  boundary="{$boundary}"
  boundaryList="{boundaryList}"
  on:change="{changeLocation}"
/>

<svelte:component
  this="{DownloadChart}"
  metadata="{metadata}"
  csvData="{csvData}"
  printContainer="{printContainer}"
  printSkipElements="{printSkipElements}"
  bind:open="{showDownload}"
/>

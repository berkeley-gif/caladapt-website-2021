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
  import { climvarList, modelList, scenarioList } from "./_helpers";
  import { flattenData, getDataByDate, formatDataForExport } from "./_data";
  import { exportPNG, exportCSV } from "../../../helpers/export";

  // Components
  import ChangeLocation from "./ChangeLocation.svelte";
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    ShowDefinition,
  } from "../../../components/tools/Settings";
  import { StaticMap } from "../../../components/tools/Location";
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

  $: metadata = [
    ["boundary", $boundary.id],
    ["feature", $location.title],
    ["center", `${$location.center[0]}, ${$location.center[1]}`],
    ["scenario", $scenario.label],
    ["climate indicator", $climvar.label],
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
      const container = document.querySelector(".explore");
      switch (format) {
        case "png":
          await exportPNG(container, ["explore-settings"]);
          break;
        case "csv":
          var csvData = formatDataForExport(dataByDate);
          var csvWithMetadata = `${csvFormatRows(metadata)} \n \n ${csvFormat(
            csvData
          )}`;
          await exportCSV(csvWithMetadata);
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

  function changeLocation(e) {
    showChangeLocation = false;
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
    <StaticMap location="{$location}" width="{500}" height="{500}" />
    <div class="explore-header-title">
      <h3><span class="block-title">{$location.title}</span></h3>
      <h4>
        Projected changes in <span class="block-title">{$climvar.title}</span>
        under a <span class="block-title">{$scenario.labelLong}</span>.
      </h4>
      <Button
        size="small"
        icon="{Location16}"
        on:click="{() => (showChangeLocation = true)}"
      >
        Change Location
      </Button>
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
        <Button
          size="small"
          icon="{Download16}"
          on:click="{() => (showDownload = true)}"
        >
          Download
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

<ChangeLocation bind:open="{showChangeLocation}" on:change="{changeLocation}" />

<DownloadChart bind:open="{showDownload}" on:download="{downloadViz}" />

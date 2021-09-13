<script>
  import { Button, Loading } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import {
    climIndiList,
    climvarList,
    modelList,
    scenarioList,
    boundaryList,
  } from "./_helpers";
  import { flattenData, getDataByDate, formatDataForExport } from "./_data";

  // Components
  import { Dashboard } from "~/components/tools/Partials";
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    ShowDefinition,
  } from "~/components/tools/Settings";
  import { StaticMap } from "~/components/tools/Location";
  import { LineAreaChart } from "~/components/tools/Charts";
  import { RangeAvg } from "~/components/tools/Stats";

  // Store
  import {
    indicatorsStore,
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
  const { indicator } = indicatorsStore;
  const { scenario } = scenarioStore;
  const { titles } = datasetStore;

  $: console.log($climvar);

  let isLoading = true;
  let dataByDate;
  let statsData;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;

  let ChangeLocation;
  let DownloadChart;
  let ShareLink;

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  async function loadShare() {
    showShare = true;
    ShareLink = (await import("~/components/tools/Partials/ShareLink.svelte"))
      .default;
  }

  async function loadLocation() {
    showChangeLocation = true;
    ChangeLocation = (
      await import("~/components/tools/Partials/ChangeLocation.svelte")
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

      /* TODO: add both variable & indicator? **/
      // ["climate variable", $climvar.label],
      // ["climate indicator", $indicator.label],

      ["units", $climvar.units.imperial],
    ];
    printContainer = document.querySelector("#explore");
    printSkipElements = ["settings"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
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

  function changeIndicator(e) {
    indicatorsStore.set(e.detail.id);
    console.log("indicator change");
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

<style lang="scss">
  .block {
    background-color: var(--white);
    box-shadow: var(--box-shadow);
    height: 100%;
    box-sizing: border-box;
    padding: var(--spacing-16);
  }

  .annotate {
    font-weight: 600;
  }

  .h4 {
    font-weight: 400;
  }

  .title {
    > * {
      margin: var(--spacing-8) 0;
    }

    .h3 {
      margin-top: 0;
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    grid-gap: var(--spacing-16);
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .chart-download {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .settings {
    width: 100%;
    display: grid;
    grid-gap: var(--spacing-8);
    grid-template-columns: repeat(auto-fit, minmax(208px, 1fr));

    .block {
      background-color: var(--gray-20);
      height: auto;
    }
  }
</style>

{#if isLoading}
  <Loading />
{/if}

<Dashboard>
  <div slot="map">
    <StaticMap location="{$location}" width="{500}" height="{500}" />
  </div>

  <div slot="title" class="block title">
    <div class="h3">
      {$location.title}
    </div>
    <div class="h4">
      Projected changes in <span class="annotate">{$climvar.title}</span>
      under a <span class="annotate">{$scenario.labelLong}</span>.
    </div>
    <Button size="small" icon="{Location16}" on:click="{loadLocation}">
      Change Location
    </Button>
  </div>

  <div slot="stats">
    <ul class="stats">
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
  </div>

  <div slot="graphic" class="graphic block">
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

    <div class="chart-notes margin--v-8">
      <p>
        Source: Cal-Adapt. Data: {$titles.join(", ")}.
      </p>
    </div>

    <div class="chart-download margin--v-8">
      <ShowDefinition
        topics="{['chart']}"
        title="About the Chart"
        cta="Explain Chart"
        on:define
      />
      <div>
        <Button size="small" icon="{Download16}" on:click="{loadDownload}">
          Download Chart
        </Button>
        <Button size="small" icon="{Share16}" on:click="{loadShare}">
          Share
        </Button>
      </div>
    </div>
  </div>

  <div slot="settings" class="settings">
    <div class="block">
      <SelectClimvar
        title="Select Indicator"
        selectedId="{$indicatorsStore}"
        items="{climIndiList}"
        on:change="{changeIndicator}"
      />
      <ShowDefinition
        on:define
        topics="{['hdd', 'cdd']}"
        title="Climate Indicators"
      />
    </div>
    <div class="block">
      <SelectClimvar
        title="{$climvarStore}"
        items="{climvarList}"
        on:change="{changeClimvar}"
      />
      <ShowDefinition
        on:define
        topics="{['annual-average-tasmax', 'annual-average-tasmin']}"
        title="Climate Variables"
      />
    </div>
    <div class="block">
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
    </div>
    <div class="block">
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
    </div>
  </div>
</Dashboard>

<svelte:component
  this="{ShareLink}"
  bind:open="{showShare}"
  state="{$bookmark}"
/>

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

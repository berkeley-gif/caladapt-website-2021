<script>
  import { afterUpdate } from "svelte";
  import { Button, Loading } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    DEFAULT_BOUNDARIES,
    SELECT_LOCATION_DESCRIPTION,
    DEFAULT_STAT_GROUPS,
    DEFAULT_STAT_PERIODS,
  } from "../_common/constants";
  import {
    serialize,
    flattenData,
    groupDataByYear,
    formatDataForExport,
  } from "../_common/helpers";

  // Components
  import { Dashboard, LearnMoreButton } from "~/components/tools/Partials";
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
  } from "~/components/tools/Settings";
  import { LocationMap } from "~/components/tools/Location/";
  import { LineAreaChart } from "~/components/tools/Charts";
  import { AvgRange } from "~/components/tools/Stats";

  // Store
  import {
    scenarioStore,
    locationStore,
    dataStore,
    modelsStore,
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import { climvarList, climvarStore } from "./_store";

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { titles } = datasetStore;

  let dataByDate;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;
  let showLearnMore = false;

  let ChangeLocation;
  let DownloadChart;
  let ShareLink;
  let LearnMoreModal;

  let bookmark = "";
  $: shareLinkWarning =
    $boundary.id === "custom"
      ? "Cannot create a share link for custom boundaries."
      : "";

  let learnMoreProps = {};
  let chartDescription = `<p>The colored lines on this visualization represent 
    a timeseries of annual average values from individual downscaled GCMs. 
    The gray shaded region in the background represents the range of projections 
    from all 32 downscaled GCMs. The historical observed data is represented by 
    a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries.</p>`;

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  let chartTitle = "";

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if ($dataStore) {
    dataByDate = groupDataByYear(flattenData($dataStore));
  } else {
    dataByDate = null;
  }

  $: if ($location) {
    loadLocation();
  }

  afterUpdate(() => {
    if ($location && $location.title) {
      chartTitle = $location.title;
    }
  });

  async function loadLearnMore({
    slugs = [],
    content = "",
    header = "Glossary",
  }) {
    learnMoreProps = { slugs, content, header };
    showLearnMore = true;
    LearnMoreModal = (
      await import(
        "~/components/tools/Partials/LearnMore/LearnMoreModal.svelte"
      )
    ).default;
  }

  async function loadShare() {
    bookmark = serialize({
      climvar: $climvarStore,
      scenario: $scenarioStore,
      models: $modelsStore.join(","),
      boundary: $boundary.id,
      fid: $location.id,
    });
    showShare = true;
    ShareLink = (await import("~/components/tools/Partials/ShareLink.svelte"))
      .default;
  }

  async function loadLocation() {
    showChangeLocation = true;
    ChangeLocation = (
      await import(
        "~/components/tools/Partials/ChangeLocationStation/ChangeLocationStation.svelte"
      )
    ).default;
  }

  async function loadDownload() {
    showDownload = true;
    csvData = formatDataForExport(dataByDate);
    metadata = [
      ["boundary", $boundary.id],
      ["feature", $location.title],
      ["feature id", $location.id],
      ["center", `${$location.center[0]}, ${$location.center[1]}`],
      ["scenario", $scenario.label],
      ["climate indicator", $climvar.label],
      ["units", $climvar.units.imperial],
    ];
    printContainer = document.querySelector("#explore-data");
    printSkipElements = ["settings"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
  }

  function changeLocation({ detail: { location, boundaryId } }) {
    locationStore.updateAll({
      location,
      boundaryId,
      isUpload: boundaryId === "custom",
    });
  }
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard>
  <div slot="chart_title" class="block title">
    <Button
      class="btn-change-location"
      size="small"
      icon="{Location16}"
      kind="ghost"
      on:click="{loadLocation}"
    >
      Change Location
    </Button>
    <div class="h3">
      {chartTitle}
    </div>
    <div class="h4">
      Projected changes in <span class="annotate">{$climvar.title}</span>
      under a <span class="annotate">{$scenario.labelLong}</span>.
    </div>
  </div>

  <div slot="stats">
    <ul class="stats">
      <li class="block">
        <AvgRange
          units="{$climvar.units.imperial}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() < 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => d.historical)}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => d.historical)}"
          format="{formatFn}"
          models="{$modelsStore}"
          isFetching="{$isFetchingStore}"
        />
      </li>
      <li class="block">
        <AvgRange
          units="{$climvar.units.imperial}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() >= 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
          periodId="mid-century"
          format="{formatFn}"
          models="{$modelsStore}"
          isFetching="{$isFetchingStore}"
        />
      </li>
      <li class="block">
        <AvgRange
          units="{$climvar.units.imperial}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() >= 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
          periodId="end-century"
          format="{formatFn}"
          models="{$modelsStore}"
          isFetching="{$isFetchingStore}"
        />
      </li>
    </ul>
  </div>

  <div slot="graphic" class="graphic block">
    <LineAreaChart
      data="{$dataStore}"
      dataByDate="{dataByDate}"
      yAxis="{{
        key: 'value',
        label: `${$climvar.title} (${$climvar.units.imperial})`,
        tickFormat: formatFn,
        units: `${$climvar.units.imperial}`,
      }}"
      isFetching="{$isFetchingStore}"
    />

    <div class="chart-notes margin--v-32">
      <p>
        Source: Cal-Adapt. Data: {$titles.join(", ")}.
      </p>
    </div>
    <div class="chart-download margin--v-16">
      <LearnMoreButton
        cta="{'Explain Chart'}"
        on:click="{() =>
          loadLearnMore({
            content: chartDescription,
            header: 'About this Chart',
          })}"
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
      <span class="bx--label">Select Location</span>
      <LocationMap on:click="{loadLocation}" location="{$location}" />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            content: SELECT_LOCATION_DESCRIPTION,
            header: 'Select Location',
          })}"
      />
    </div>
    <div class="block">
      <SelectClimvar
        selectedId="{$climvarStore}"
        items="{climvarList}"
        on:change="{changeClimvar}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            slugs: [
              'annual-average-tasmax',
              'annual-average-tasmin',
              'annual-average-pr',
            ],
          })}"
      />
    </div>
    <div class="block">
      <SelectScenario
        selectedId="{$scenarioStore}"
        items="{DEFAULT_SCENARIOS}"
        on:change="{changeScenario}"
      />
      <LearnMoreButton
        on:click="{() => loadLearnMore({ slugs: ['emissions-scenario'] })}"
      />
    </div>
    <div class="block">
      <SelectModels
        selectedIds="{$modelsStore}"
        items="{PRIORITY_10_MODELS}"
        on:change="{changeModels}"
      />
      <LearnMoreButton
        on:click="{() => loadLearnMore({ slugs: ['global-climate-model'] })}"
      />
    </div>
  </div>
</Dashboard>

<svelte:component
  this="{LearnMoreModal}"
  bind:open="{showLearnMore}"
  {...learnMoreProps}
/>

<svelte:component
  this="{ShareLink}"
  bind:open="{showShare}"
  state="{bookmark}"
  errorMsg="{shareLinkWarning}"
/>

<svelte:component
  this="{ChangeLocation}"
  bind:open="{showChangeLocation}"
  location="{$location}"
  boundary="{$boundary}"
  boundaryList="{DEFAULT_BOUNDARIES}"
  addStateBoundary="{true}"
  enableUpload="{true}"
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

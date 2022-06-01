<script>
  import { afterUpdate } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { format } from "d3-format";

  // Helpers
  import { SMALL_SCALE_BOUNDARIES } from "../_common/constants";
  import {
    flattenData,
    groupDataByYear,
    groupDataByDay,
    formatDataForExport,
    serialize,
  } from "../_common/helpers";

  // Components
  import { Dashboard } from "~/components/tools/Partials";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import StatsPanel from "./_StatsPanel.svelte";
  import ExtremeHeatChart from "./_ExtremeHeatChart.svelte";
  import ChartTitle from "./_ChartTitle.svelte";

  // Store
  import {
    scenarioStore,
    locationStore,
    modelsStore,
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import {
    climvarStore,
    indicatorStore,
    thresholdStore,
    durationStore,
    dataStore,
  } from "./_store";

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { indicator } = indicatorStore;
  const { titles } = datasetStore;
  const { data } = dataStore;

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

  let learnMoreProps = {};
  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  let chartTitle = "";

  $: chartDescription =
    $climvarStore === "tasmax"
      ? $indicator.description
      : $indicator.description.replace("extreme heat days", "warm nights");

  $: formatFn = format(`.${$indicator.decimals}f`);

  $: thresholdLabel = `${$thresholdStore} °F`;

  $: indicatorLabel =
    $climvarStore === "tasmax"
      ? $indicator.title
      : $indicator.title.replace("Extreme Heat Days", "Warm Nights");

  $: durationLabel =
    $climvarStore === "tasmax"
      ? `${$durationStore} Day`
      : `${$durationStore} Night`;

  $: if ($data) {
    if ($indicator.id === "timing") {
      dataByDate = groupDataByDay(flattenData($data));
    } else {
      dataByDate = groupDataByYear(flattenData($data));
    }
  } else {
    dataByDate = null;
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
    // TODO: add threshold value?
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
      await import("~/components/tools/Partials/ChangeLocationStation.svelte")
    ).default;
  }

  function formatDailyDataForExport(_arr) {
    return _arr.map((item) => {
      const row = {};
      row.date = item.date;
      item.values.forEach((d) => {
        if (Array.isArray(d.value)) {
          row[`${d.label} Min`] = d.value[0];
          row[`${d.label} Max`] = d.value[1];
        } else {
          row[d.label] = d.value;
        }
      });
      return row;
    });
  }

  async function loadDownload() {
    showDownload = true;
    if ($indicator.id === "timing") {
      csvData = formatDailyDataForExport(dataByDate);
    } else {
      csvData = formatDataForExport(dataByDate);
    }
    metadata = [
      ["boundary", $boundary.id],
      ["feature", $location.title],
      ["feature id", $location.id],
      ["center", `${$location.center[0]}, ${$location.center[1]}`],
      ["scenario", $scenario.label],
      ["climate indicator", `${$climvar.label} ${$indicator.label}`],
      ["threshold", `${$thresholdStore} ${$climvar.units.imperial}`],
    ];
    printContainer = document.querySelector("#explore-data");
    printSkipElements = ["settings"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
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
    <ChartTitle
      title="{chartTitle}"
      indicatorLabel="{indicatorLabel}"
      climvarLabel="{$climvar.title}"
      scenarioLabel="{$scenario.labelLong}"
      thresholdLabel="{thresholdLabel}"
      loadLocation="{loadLocation}"
      durationLabel="{durationLabel}"
    />
  </div>

  <div slot="stats">
    <StatsPanel
      {...{
        statsComponent: $indicator.statsComponent,
        units: $indicator.units,
        dataByDate,
        formatFn,
        models: $modelsStore,
        isFetching: $isFetchingStore,
      }}
    />
  </div>

  <div slot="graphic" class="graphic block">
    <ExtremeHeatChart
      chartComponent="{$indicator.chartComponent}"
      data="{$data}"
      dataByDate="{dataByDate}"
      formatFn="{formatFn}"
      units="{$indicator.units}"
      label="{indicatorLabel}"
      dataSource="{$titles.join(', ')}"
      on:showDownload="{loadDownload}"
      on:showShare="{loadShare}"
      on:showLearnMore="{({ detail }) => loadLearnMore(detail)}"
      isFetching="{$isFetchingStore}"
      chartDescription="{chartDescription}"
    />
  </div>

  <div slot="settings" class="settings">
    <SettingsPanel
      on:showLearnMore="{(e) => loadLearnMore(e.detail)}"
      on:showLoadLocation="{() => loadLocation()}"
    />
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
/>

<svelte:component
  this="{ChangeLocation}"
  bind:open="{showChangeLocation}"
  enableUpload="{false}"
  location="{$location}"
  boundary="{$boundary}"
  boundaryList="{SMALL_SCALE_BOUNDARIES}"
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

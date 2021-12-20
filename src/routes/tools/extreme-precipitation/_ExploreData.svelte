<script>
  import { Loading } from "carbon-components-svelte";
  import { format } from "d3-format";

  // Helpers
  import { SMALL_SCALE_BOUNDARIES } from "../_common/constants";
  import {
    flattenData,
    groupDataByYear,
    groupDataByDay,
    formatDataForExport,
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
    intervalsStore,
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

  let bookmark;
  let learnMoreProps = {};
  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  $: chartDescription = $indicator.description;

  $: chartTitle = $location.title;

  $: formatFn = format(`.${$indicator.decimals}f`);

  $: thresholdLabel = `${$thresholdStore} ${$climvar.units.imperial}`;
  $: indicatorLabel = $indicator.title;
  $: eventLabel = `${$durationStore}-day rainfall total`;
  $: intervalsLabel = `${$intervalsStore} years`;

  $: if ($data) {
    console.log("data", $data);
    // if ($indicator.id === "timing") {
    //   dataByDate = groupDataByDay(flattenData($data));
    // } else {
    //   dataByDate = groupDataByYear(flattenData($data));
    // }
  } else {
    dataByDate = null;
  }

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
    if ($boundary.id === "custom") {
      bookmark = "Cannot create a bookmark for an uploaded boundary";
    } else {
      const [lng, lat] = $location.center;
      const modelsStr = $modelsStore.join(",");
      bookmark = `climvar=${$climvarStore}&scenario=${$scenarioStore}&models=${modelsStr}&lng=${lng}&lat=${lat}&boundary=${$boundary.id}`;
    }
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

  function changeLocation(e) {
    if (e.detail.boundaryId === "custom") {
      locationStore.updateBoundary("locagrid");
      locationStore.updateLocation(e.detail.location, true);
    } else {
      locationStore.updateBoundary(e.detail.boundaryId);
      locationStore.updateLocation(e.detail.location);
    }
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
      eventLabel="{eventLabel}"
      scenarioLabel="{$scenario.labelLong}"
      thresholdLabel="{thresholdLabel}"
      intervalsLabel="{intervalsLabel}"
      loadLocation="{loadLocation}"
    />
  </div>

  <div slot="stats">
    <!--     <StatsPanel
      {...{
        statsComponent: $indicator.statsComponent,
        units: $indicator.units,
        dataByDate,
        formatFn,
        models: $modelsStore,
        isFetching: $isFetchingStore,
      }}
    /> -->
  </div>

  <div slot="graphic" class="graphic block">
    <!--     <ExtremeHeatChart
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
    /> -->
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

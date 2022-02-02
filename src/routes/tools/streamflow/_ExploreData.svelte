<script>
  import { Loading } from "carbon-components-svelte";
  import { format } from "d3-format";

  // Helpers
  import {
    flattenData,
    groupDataByYear,
    formatDataForExport,
    groupDataByMonth,
  } from "../_common/helpers";
  import { getSelectedMonthStrings } from "./_helpers";
  import { serialize } from "~/helpers/utilities";
  import { DEFAULT_STATION_LAYER } from "./_constants";
  import { getBasinCenter } from "./_data";

  // Components
  import { Dashboard } from "~/components/tools/Partials";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import StreamflowChart from "./_StreamflowChart.svelte";
  import ChartTitle from "./_ChartTitle.svelte";
  import StatsPanel from "./_StatsPanel.svelte";

  // Store
  import {
    scenarioStore,
    locationStore,
    modelsStore,
    datasetStore,
    isFetchingStore,
    dataStore,
  } from "../_common/stores";
  import {
    climvarStore,
    indicatorStore,
    selectedMonthsStore,
    totalAnnual,
    averageMonthly,
    selectedPeriodStore,
    runoffMidpoint,
  } from "./_store";

  const { location } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { indicator } = indicatorStore;
  const { titles } = datasetStore;
  const { period } = selectedPeriodStore;

  let data;
  let dataByDate;
  let statsData;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;
  let showLearnMore = false;

  let ChangeStation;
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

  $: formatFn = format(`,.${$indicator.decimals}f`);

  $: indicatorLabel = `${$indicator.title} (${$indicator.units})`;

  $: monthsLabel =
    $indicatorStore === "annual" && $selectedMonthsStore
      ? getMonthsLabel()
      : "";

  $: periodLabel = $period.text;

  $: $averageMonthly, $totalAnnual, updateData();

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
      station: $locationStore.id,
    });
    showShare = true;
    ShareLink = (await import("~/components/tools/Partials/ShareLink.svelte"))
      .default;
  }

  async function loadLocation() {
    showChangeLocation = true;
    ChangeStation = (
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
      ["feature", $location.title],
      ["center", `${$location.center[0]}, ${$location.center[1]}`],
      ["scenario", $scenario.label],
      ["climate indicator", `${$climvar.label} ${$indicator.label}`],
    ];
    printContainer = document.querySelector("#explore-data");
    printSkipElements = ["settings"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  function changeLocation(e) {
    showChangeLocation = false;
    locationStore.updateLocation(getBasinCenter(e.detail.location));
    console.log("location change");
  }

  function getMonthsLabel() {
    if (Array.isArray($selectedMonthsStore) && $selectedMonthsStore.length) {
      return getSelectedMonthStrings($selectedMonthsStore).reduce(
        (acc, cur, idx, arr) =>
          idx === 0
            ? cur
            : idx === arr.length - 1
            ? `${acc} and ${cur}`
            : `${acc}, ${cur}`,
        ""
      );
    }
  }

  function updateData() {
    if (!$dataStore || !$totalAnnual || !$averageMonthly) {
      data = null;
      dataByDate = null;
      return;
    }
    if ($indicator.id === "annual") {
      data = $totalAnnual;
      dataByDate = groupDataByYear(flattenData(data));
      console.log("databydate", dataByDate);
      statsData = dataByDate;
    } else {
      data = $averageMonthly;
      dataByDate = groupDataByMonth(flattenData(data));
      console.log("databydate", dataByDate);
      statsData = $runoffMidpoint;
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
      indicatorLabel="{$indicator.title}"
      monthsLabel="{monthsLabel}"
      scenarioLabel="{$scenario.labelLong}"
      loadLocation="{loadLocation}"
      periodLabel="{periodLabel}"
    />
  </div>

  <div slot="stats">
    <StatsPanel
      {...{
        statsComponent: $indicator.statsComponent,
        units: $indicator.units,
        statsData,
        formatFn,
        models: $modelsStore,
        isFetching: $isFetchingStore,
        indicatorId: $indicator.id,
        periodId: $period.id,
      }}
    />
  </div>

  <div slot="graphic" class="graphic block">
    <StreamflowChart
      data="{data}"
      dataByDate="{dataByDate}"
      formatFn="{formatFn}"
      units="{$indicator.units}"
      label="{indicatorLabel}"
      description="{$indicator.description}"
      dataSource="{$titles.join(', ')}"
      on:showDownload="{loadDownload}"
      on:showShare="{loadShare}"
      on:showLearnMore="{({ detail }) => loadLearnMore(detail)}"
      isFetching="{$isFetchingStore}"
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
  this="{ChangeStation}"
  bind:open="{showChangeLocation}"
  location="{$location}"
  stationsLayer="{DEFAULT_STATION_LAYER}"
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

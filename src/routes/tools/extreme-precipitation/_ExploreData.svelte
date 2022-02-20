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
    thresholdTypeStore,
    durationStore,
    dataStore,
    returnPeriodStore,
    uncertaintyStore,
  } from "./_store";

  export let learnMoreContent;
  export let notificationText;
  export let warningLowSampleSize;
  export let warningMissingCI;

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { indicator } = indicatorStore;
  const { titles } = datasetStore;
  const { intensity, events, frequency, duration } = dataStore;

  let data;
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

  let chartTitle = "";
  let thresholdLabel = "";
  let intervalsLabel = "";
  let durationLabel = "";
  let polygonAggregationMsg = "";
  let uncertaintyMsg = "";

  $: chartDescription = $indicator.description;
  $: formatFn = format(`.${$indicator.decimals}f`);
  $: indicatorLabel = $indicator.title;

  $: if ($indicator.id === "intensity") {
    data = $intensity;
    dataByDate = null;
  } else if ($indicator.id === "timing") {
    data = $events;
    dataByDate = groupDataByDay(flattenData(data));
  } else {
    data = $indicator.id === "frequency" ? $frequency : $duration;
    dataByDate = groupDataByYear(flattenData(data));
  }

  function removeTags(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }

  function getNotificationText() {
    if ($boundary.id === "locagrid") {
      return "";
    } else {
      return removeTags(notificationText);
    }
  }

  function getUncertaintyText() {
    if (!$uncertaintyStore || $indicator.id !== "intensity") return "";
    const { lowSampleSize, nullCIValues } = $uncertaintyStore;
    if (lowSampleSize && nullCIValues) {
      return removeTags(`${warningLowSampleSize}. ${warningMissingCI}`);
    } else if (lowSampleSize) {
      return removeTags(warningLowSampleSize);
    } else if (nullCIValues) {
      return removeTags(warningMissingCI);
    } else {
      return "";
    }
  }

  afterUpdate(() => {
    if ($location && $location.title) {
      chartTitle = $location.title;
    }
    thresholdLabel = `${$thresholdStore} ${$climvar.units.imperial}`;
    intervalsLabel = `${$returnPeriodStore} years`;
    durationLabel = `${$durationStore}-day`;
    polygonAggregationMsg = getNotificationText();
    uncertaintyMsg = getUncertaintyText();
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
    if ($boundary.id === "custom") {
      bookmark = "Cannot create a bookmark for an uploaded boundary";
    } else {
      const [lng, lat] = $location.center;
      const modelsStr = $modelsStore.join(",");
      bookmark = `climvar=${$climvarStore}&scenario=${$scenarioStore}&duration=${$durationStore}&threshId=${$thresholdTypeStore}&models=${modelsStr}&lng=${lng}&lat=${lat}&boundary=${$boundary.id}`;
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

  function formatIntensityDataForExport(_arr) {
    return _arr.map(
      ({ label, begin, end, interval, ci_lower, value, ci_upper }) => {
        return { label, begin, end, interval, ci_lower, value, ci_upper };
      }
    );
  }

  async function loadDownload() {
    showDownload = true;
    if ($indicator.id === "timing") {
      csvData = formatDailyDataForExport(dataByDate);
    } else if ($indicator.id === "intensity") {
      csvData = formatIntensityDataForExport(data);
    } else {
      csvData = formatDataForExport(dataByDate);
    }
    metadata = [
      ["boundary", $boundary.id],
      ["feature", $location.title],
      ["center", `${$location.center[0]}, ${$location.center[1]}`],
      ["scenario", $scenario.label],
      ["climate indicator", `${indicatorLabel}`],
      ["threshold", `${thresholdLabel}`],
      ["duration", `${durationLabel}`],
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
      durationLabel="{durationLabel}"
      scenarioLabel="{$scenario.labelLong}"
      thresholdLabel="{thresholdLabel}"
      intervalsLabel="{intervalsLabel}"
      loadLocation="{loadLocation}"
      polygonAggregationMsg="{polygonAggregationMsg}"
      uncertaintyMsg="{uncertaintyMsg}"
    />
  </div>

  <div slot="stats">
    {#if $indicator.id !== "intensity"}
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
    {/if}
  </div>

  <div slot="graphic" class="graphic block">
    <ExtremeHeatChart
      chartComponent="{$indicator.chartComponent}"
      data="{data}"
      dataByDate="{dataByDate}"
      formatFn="{formatFn}"
      units="{$climvar.units.imperial}"
      label="{indicatorLabel}"
      dataSource="{$titles.join(', ')}"
      niceMax="{['intensity'].includes($indicator.id) ? 5 : 10}"
      height="{['timing', 'intensity'].includes($indicator.id) ? 550 : 400}"
      on:showDownload="{loadDownload}"
      on:showShare="{loadShare}"
      on:showLearnMore="{({ detail }) => loadLearnMore(detail)}"
      isFetching="{$isFetchingStore}"
      chartDescription="{chartDescription}"
    />
  </div>

  <div slot="settings" class="settings">
    <SettingsPanel
      learnMoreContent="{learnMoreContent}"
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

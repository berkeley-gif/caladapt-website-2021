<script>
  import { afterUpdate } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { extent } from "d3-array";

  import { serialize } from "~/helpers/utilities";
  import { Dashboard } from "~/components/tools/Partials";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import StatsPanel from "./_StatsPanel.svelte";
  import ChartTitle from "./_ChartTitle.svelte";
  import ExtremeWeatherCharts from "./_ExtremeWeatherCharts.svelte";

  import { DEFAULT_STATION_LAYER } from "./_constants";

  import { isFetchingStore } from "../_common/stores";

  import {
    climvarStore,
    locationStore,
    extremesStore,
    thresholdStore,
    doyStore,
    baseline,
    thresholdBound,
  } from "./_store";

  const { location } = locationStore;
  const { climvar } = climvarStore;
  const { doyText } = doyStore;
  //TODO: Use dataset info from API after data download tool is migrated
  //const { titles } = datasetStore;
  const titles = ["Hourly Observed Historical Data (Met Office Hadley Centre)"];

  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;
  let showLearnMore = false;

  // async component imports
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

  let chartTitle = "";

  let histogramData = null;
  let histogramXDomain = [];

  $: chartSubtitle = `Distribution of daily <span class="annotate">${$climvar.title}s</span>
      around <span class="annotate">${$doyText}</span> 
      (<span class="annotate">&#177;10 days</span>) from 1991-2020`;
  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if ($baseline) {
    thresholdStore.set($thresholdBound);
    histogramData = $baseline.values.map((d) => +d.value);
    histogramXDomain = updateDataExtent(histogramData);
  } else {
    histogramData = null;
    histogramXDomain = [];
  }

  afterUpdate(() => {
    // Note: for some reason the chartTitle variable will only update
    // when setting it here.
    if ($location && $location.title) {
      chartTitle = `${$location.title} (${$location.geometry.coordinates[0]}°, ${$location.geometry.coordinates[1]}°)`;
    }
  });

  function updateDataExtent(arr) {
    const dataExtent = extent(arr);
    return [dataExtent[0] - 2, dataExtent[1] + 2];
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
    bookmark = serialize({
      climvar: $climvarStore,
      station: $locationStore.id,
      doy: $doyText,
      extremes: $extremesStore,
    });
    showShare = true;
    ShareLink = (await import("~/components/tools/Partials/ShareLink.svelte"))
      .default;
  }

  async function loadLocation() {
    showChangeLocation = true;
    ChangeStation = (
      await import("~/components/tools/Partials/ChangeStation.svelte")
    ).default;
  }

  async function loadDownload() {
    showDownload = true;
    csvData = [];
    metadata = [
      ["station", $location.title],
      ["variable", $climvar.label],
      ["units", $climvar.units.imperial],
      ["record high", `{$baseline.high.value} on {$baseline.high.date}`],
      ["record low", `{$baseline.low.value} on {$baseline.low.date}`],
    ];
    printContainer = document.querySelector("#explore-data");
    printSkipElements = ["settings", "bx--tabs--container"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  function changeLocation(e) {
    showChangeLocation = false;
    locationStore.updateLocation(e.detail.location);
    console.log("location change");
  }
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard useTabs="{false}">
  <!-- Chart components -->
  <div slot="title" class="block title">
    <ChartTitle
      title="{chartTitle}"
      subtitle="{chartSubtitle}"
      loadLocation="{loadLocation}"
    />
  </div>

  <div slot="stats">
    <StatsPanel on:showLearnMore="{(e) => loadLearnMore(e.detail)}" />
  </div>

  <div slot="graphic" class="graphic block">
    <ExtremeWeatherCharts
      histogramData="{histogramData}"
      histogramXDomain="{histogramXDomain}"
      dataSource="{titles.join(', ')}"
      histogramXAxis="{{
        label: `${$climvar.title} (${$climvar.units.imperial})`,
        tickFormat: formatFn,
        units: `${$climvar.units.imperial}`,
      }}"
      histogramYAxis="{{
        label: `% Days`,
      }}"
      on:showDownload="{loadDownload}"
      on:showShare="{loadShare}"
      on:showLearnMore="{({ detail }) => loadLearnMore(detail)}"
    />
  </div>

  <!-- Settings component shared by both Map & Chart -->
  <div slot="settings" class="settings">
    <SettingsPanel
      on:showLearnMore="{(e) => loadLearnMore(e.detail)}"
      on:showLoadLocation="{() => loadLocation()}"
    />
  </div>
</Dashboard>

<!-- Modal Components -->
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

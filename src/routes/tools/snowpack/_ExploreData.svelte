<script>
  import { afterUpdate } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { format } from "d3-format";

  import { DEFAULT_BOUNDARIES } from "../_common/constants";

  import {
    flattenData,
    groupDataByYear,
    formatDataForExport,
    serialize,
  } from "../_common/helpers";

  import { getImgOverlayPath } from "./_data";

  import { Dashboard } from "~/components/tools/Partials";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import StatsPanel from "./_StatsPanel.svelte";
  import SnowpackChart from "./_SnowpackChart.svelte";
  import SnowpackMap from "./_SnowpackMap.svelte";
  import MapTimeSlider from "./_MapTimeSlider.svelte";
  import ChartTitle from "./_ChartTitle.svelte";
  import MapTitle from "./_MapTitle.svelte";

  import {
    scenarioStore,
    locationStore,
    dataStore,
    modelsStore,
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import {
    climvarStore,
    durationStore,
    monthStore,
    modelSingleStore,
    yearStore,
  } from "./_store";

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { titles } = datasetStore;
  const { month } = monthStore;

  let dataByDate;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;
  let showLearnMore = false;

  // async component imports
  let ChangeLocation;
  let DownloadChart;
  let ShareLink;
  let LearnMoreModal;

  // reference to mapbox slippy map
  let mapboxMap;

  // reference to time slider component
  let timeSlider;

  let bookmark = "";
  $: shareLinkWarning =
    $boundary.id === "custom"
      ? "Cannot create a share link for custom boundaries."
      : "";

  let learnMoreProps = {};

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  let chartTitle = "";
  let mapCaveat =
    "The maps for the period between 1960-2010 display the observed historical Snow Water Equivalent for the selected month, while those for 2010–2099 show the modeled projections.";

  let activeTab = 0;
  $: activeTab, mapboxMap && mapboxMap.resize();
  $: activeTab, timeSlider && timeSlider.cancelAnimation();

  $: chartSubtitle = `Projected changes in Snow Water Equivalent for the month of ${$month.label} under a`;

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: imgOverlayPath = getImgOverlayPath({
    climvarId: $climvarStore,
    modelId: $modelSingleStore,
    scenarioId: $scenarioStore,
    yearStart: $yearStore,
    yearEnd: $yearStore + $durationStore - 1,
    monthNumber: $monthStore,
  });

  $: if (Array.isArray($dataStore) && $dataStore.length) {
    dataByDate = groupDataByYear(flattenData($dataStore));
  } else {
    dataByDate = null;
  }

  afterUpdate(() => {
    // Note: for some reason the chartTitle variable will only update
    // when setting it here.
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
      modelSingle: $modelSingleStore,
      year: $yearStore,
      month: $monthStore,
      duration: $durationStore,
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
      ["climate variable", $climvar.label],
    ];
    printContainer = document.querySelector("#explore-data");
    printSkipElements = ["settings", "bx--tabs--container"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  function handleTabChange(event) {
    activeTab = event.detail;
  }

  function changeLocation({ detail: { location, boundaryId } }) {
    locationStore.updateAll({
      location,
      boundaryId,
      isUpload: boundaryId === "custom",
    });
  }

  function handleSliderChange(e) {
    if (e && e.detail && typeof e.detail === "number") {
      yearStore.set(e.detail);
    }
  }
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard
  useTabs="{true}"
  activeTab="{activeTab}"
  on:tabChange="{handleTabChange}"
>
  <!-- Map components -->
  <div slot="map_title" class="block">
    <MapTitle
      month="{$month.label}"
      scenarioLabel="{$scenario.labelLong}"
      model="{$modelSingleStore}"
      year="{$yearStore}"
      duration="{$durationStore}"
      caveat="{mapCaveat}"
    />
  </div>

  <div
    slot="slippy_map"
    class="bx--aspect-ratio bx--aspect-ratio--16x9 graphic block"
  >
    {#if !activeTab}
      <SnowpackMap bind:mapboxMap imgOverlayPath="{imgOverlayPath}" />
    {/if}
  </div>

  <div
    slot="slippy_map_controls"
    class="graphic block"
    style="background-color: var(--gray-20);"
  >
    {#if !activeTab}
      <MapTimeSlider
        bind:this="{timeSlider}"
        on:change="{handleSliderChange}"
        on:showLearnMore="{(e) => loadLearnMore(e.detail)}"
        climvarId="{$climvarStore}"
        modelId="{$modelSingleStore}"
        scenarioId="{$scenarioStore}"
        monthNumber="{$monthStore}"
        duration="{$durationStore}"
      />
    {/if}
  </div>

  <!-- Chart components -->
  <div slot="chart_title" class="block title">
    {#if activeTab}
      <ChartTitle
        title="{chartTitle}"
        subtitle="{chartSubtitle}"
        monthLabel="{$month.label}"
        scenarioLabel="{$scenario.labelLong}"
        loadLocation="{loadLocation}"
      />
    {/if}
  </div>

  <div slot="stats">
    {#if activeTab}
      <StatsPanel
        {...{
          units: $climvar.units.imperial,
          dataByDate,
          formatFn,
          models: $modelsStore,
          isFetching: $isFetchingStore,
        }}
      />
    {/if}
  </div>

  <div slot="graphic" class="graphic block">
    {#if activeTab}
      <SnowpackChart
        data="{$dataStore}"
        dataByDate="{dataByDate}"
        formatFn="{formatFn}"
        units="{$climvar.units.imperial}"
        label="{$month.label} {$climvar.label}"
        dataSource="{$titles.join(', ')}"
        on:showDownload="{loadDownload}"
        on:showShare="{loadShare}"
        on:showLearnMore="{({ detail }) => loadLearnMore(detail)}"
        isFetching="{$isFetchingStore}"
      />
    {/if}
  </div>

  <!-- Settings component shared by both Map & Chart -->
  <div slot="settings" class="settings">
    <SettingsPanel
      activeTab="{activeTab}"
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

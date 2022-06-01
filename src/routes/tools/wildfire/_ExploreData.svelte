<script>
  import { afterUpdate } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { format } from "d3-format";

  import { DEFAULT_BOUNDARIES } from "../_common/constants";
  import { NO_DATA_MAP_MSG, NO_DATA_MSG, DATA_DISCLAIMER } from "./_constants";

  import {
    flattenData,
    groupDataByYear,
    formatDataForExport,
  } from "../_common/helpers";
  import { getMapOverlayImgURL } from "./_helpers";

  import { serialize } from "~/helpers/utilities";

  import { Dashboard } from "~/components/tools/Partials";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import StatsPanel from "./_StatsPanel.svelte";
  import WildfireChart from "./_WildfireChart.svelte";
  import WildfireMap from "./_WildfireMap.svelte";
  import MapTimeSlider from "./_MapTimeSlider.svelte";
  import Title from "./_Title.svelte";

  import { isEmptyData } from "./_helpers";

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
    simulationStore,
    monthStore,
    modelSingleStore,
    yearStore,
    stateBoundaryStore,
    pctndStore,
  } from "./_store";

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { titles } = datasetStore;
  const { month } = monthStore;

  let dataByDate;

  let noData = false;
  let dataMsg = "";

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

  let learnMoreProps = {};

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  let locationTitle = $location.title;

  let activeTab = 0;
  $: activeTab, mapboxMap && mapboxMap.resize();
  $: activeTab, timeSlider && timeSlider.cancelAnimation();

  $: shareLinkWarning =
    $boundary.id === "custom"
      ? "Cannot create a share link for custom boundaries."
      : "";

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: palette = $climvarStore === "fire" ? "YlOrRd" : "PuRd";

  $: imgOverlayPath = getMapOverlayImgURL({
    climvar: $climvarStore,
    model: $modelSingleStore,
    scenario: $scenarioStore,
    year: $yearStore,
    simulation: $simulationStore,
    month: $monthStore,
    palette,
  });

  $: pctnd = $pctndStore;

  $: if (Array.isArray($dataStore) && $dataStore.length) {
    noData = pctnd === 1 || isEmptyData($dataStore);
    dataByDate = noData ? [] : groupDataByYear(flattenData($dataStore));
  } else {
    dataByDate = null;
  }

  afterUpdate(() => {
    if (!activeTab) {
      dataMsg = NO_DATA_MAP_MSG;
    } else if (noData) {
      dataMsg = NO_DATA_MSG;
    } else if (typeof pctnd === "number" && !isNaN(pctnd) && pctnd > 0) {
      dataMsg = `${format(".0%")(pctnd)} of grid cells in this area contain no 
        data. ${DATA_DISCLAIMER}`;
    } else {
      dataMsg = "";
    }
    locationTitle = $location.title;
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
      simulation: $simulationStore,
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
  <div slot="map_title" class="block title">
    <Title
      simulation="{$simulationStore}"
      scenario="{$scenario.labelLong}"
      climvar="{$climvarStore}"
      year="{$yearStore}"
      model="{$modelSingleStore}"
      month="{$month.label}"
      dataMsg="{dataMsg}"
      activeTab="{activeTab}"
    />
  </div>

  <div
    slot="slippy_map"
    class="bx--aspect-ratio bx--aspect-ratio--16x9 graphic block"
  >
    {#if !activeTab}
      <WildfireMap
        bind:mapboxMap
        imgOverlayPath="{imgOverlayPath}"
        climvarId="{$climvarStore}"
        stateBoundary="{$stateBoundaryStore}"
      />
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
        simulation="{$simulationStore}"
        palette="{palette}"
      />
    {/if}
  </div>

  <!-- Chart components -->
  <div slot="chart_title" class="block title">
    {#if activeTab}
      <Title
        simulation="{$simulationStore}"
        scenario="{$scenario.labelLong}"
        climvar="{$climvarStore}"
        month="{$month.label}"
        location="{locationTitle}"
        loadLocation="{loadLocation}"
        dataMsg="{dataMsg}"
      />
    {/if}
  </div>

  <div slot="stats">
    {#if activeTab}
      <StatsPanel
        {...{
          units: $climvar.units.metric,
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
      <WildfireChart
        data="{$dataStore}"
        dataByDate="{dataByDate}"
        formatFn="{formatFn}"
        units="{$climvar.units.metric}"
        month="{$month.label}"
        climvarId="{$climvarStore}"
        dataSource="{$titles.join(', ')}"
        simulation="{$simulationStore}"
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

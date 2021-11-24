<script>
  import { afterUpdate } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { format } from "d3-format";

  import { DEFAULT_BOUNDARIES } from "../_common/constants";

  import {
    flattenData,
    groupDataByYear,
    formatDataForExport,
  } from "../_common/helpers";

  import { serialize } from "~/helpers/utilities";

  import { Dashboard } from "~/components/tools/Partials";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import StatsPanel from "./_StatsPanel.svelte";
  import ExtendedDroughtChart from "./_ExtendedDroughtChart.svelte";
  import ChartTitle from "./_ChartTitle.svelte";

  import {
    locationStore,
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import {
    climvarStore,
    periodStore,
    scenarioStore,
    droughtDataStore,
    observedDataStore,
    annotationsStore,
  } from "./_store";
  import { DEFAULT_MODEL } from "./_constants";

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { titles } = datasetStore;
  const { period } = periodStore;

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

  let bookmark;

  let learnMoreProps = {};

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  let chartTitle = "";

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if (Array.isArray($droughtDataStore) && $droughtDataStore.length) {
    dataByDate = groupDataByYear(
      flattenData([...$droughtDataStore, ...$observedDataStore])
    );
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
    if ($boundary.id === "custom") {
      bookmark = "Cannot create a bookmark for an uploaded boundary";
    } else {
      const [lng, lat] = $location.center;
      /*      const modelsStr = $modelsStore.join(",");
      bookmark = serialize({
        climvar: $climvarStore,
        scenario: $scenarioStore,
        models: modelsStr,
        modelSingle: $modelSingleStore,
        year: $yearStore,
        month: $monthStore,
        duration: $durationStore,
        lng,
        lat,
        boundary: $boundary.id,
      });*/
    }
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
      ["climate variable", $climvar.label],
    ];
    printContainer = document.querySelector("#explore-data");
    printSkipElements = ["settings", "bx--tabs--container"];
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

<Dashboard useTabs="{false}">
  <!-- Chart components -->
  <div slot="title" class="block title">
    <ChartTitle
      title="{chartTitle}"
      subtitle="{$scenario.desc}"
      periodLabel="{$period.label}"
      climvarLabel="{$climvar.label}"
      scenarioLabel="{$scenario.labelLong}"
      loadLocation="{loadLocation}"
    />
  </div>

  <div slot="stats">
    <StatsPanel
      units="{$climvar.units.imperial}"
      data="{dataByDate}"
      formatFn="{formatFn}"
      models="{[DEFAULT_MODEL]}"
      scenario="{$scenario.id}"
    />
  </div>

  <div slot="graphic" class="graphic block">
    <ExtendedDroughtChart
      annotations="{$annotationsStore}"
      data="{$droughtDataStore}"
      dataByDate="{dataByDate}"
      formatFn="{formatFn}"
      units="{$climvar.units.imperial}"
      label="{$climvar.label} ({$climvar.units.imperial})"
      dataSource="{$titles.join(', ')}"
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

<script>
  import { Loading } from "carbon-components-svelte";
  import { format } from "d3-format";

  import { DEFAULT_BOUNDARIES } from "../_common/constants";

  import {
    flattenData,
    getDataByDate,
    formatDataForExport,
  } from "../_common/helpers";

  import { serialize } from "~/helpers/utilities";

  import { Dashboard, LearnMoreButton } from "~/components/tools/Partials";
  import { Map, NavigationControl } from "~/components/tools/Map";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import StatsPanel from "./_StatsPanel.svelte";
  import SnowpackChart from "./_SnowpackChart.svelte";

  import {
    scenarioStore,
    locationStore,
    dataStore,
    modelsStore,
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import { climvarStore, monthStore } from "./_store";

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { titles } = datasetStore;

  let dataByDate;
  let statsData;
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

  let bookmark;

  let learnMoreProps = {};

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  let activeTab = 1;
  $: activeTab, mapboxMap && mapboxMap.resize();

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if (Array.isArray($dataStore) && $dataStore.length) {
    statsData = $dataStore.filter((d) => d.mark !== "area");
    dataByDate = getDataByDate(flattenData($dataStore));
  } else {
    statsData = null;
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
      bookmark = serialize({
        climvar: $climvarStore,
        scenario: $scenarioStore,
        models: modelsStr,
        month: $monthStore,
        lng,
        lat,
        boundary: $boundary.id,
      });
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
    printContainer = document.querySelector("#explore");
    printSkipElements = ["settings"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  function handleTabChange(event) {
    activeTab = event.detail;
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

<Dashboard
  useTabs="{true}"
  activeTab="{activeTab}"
  on:tabChange="{handleTabChange}"
>
  <div
    slot="tab_content_slippy_map"
    class="graphic block bx--aspect-ratio bx--aspect-ratio--16x9"
  >
    <Map bind:this="{mapboxMap}">
      <NavigationControl />
    </Map>
  </div>

  <div slot="tab_content_title" class="block title">
    <div class="h3">
      <!-- FIXME: bug where this never seems to update?  -->
      {$location.title}
    </div>
    <div class="h4">
      Projected changes in Snow Water Equivalence under a {$scenario.labelLong}
    </div>
  </div>

  <div slot="tab_content_stats">
    <StatsPanel
      {...{ units: $climvar.units.imperial, data: statsData, formatFn }}
    />
  </div>

  <div slot="tab_content_graphic" class="graphic block">
    <SnowpackChart
      data="{$dataStore}"
      dataByDate="{dataByDate}"
      formatFn="{formatFn}"
      units="{$climvar.units.imperial}"
      label="{$climvar.label}"
      dataSource="{$titles.join(', ')}"
      on:showDownload="{loadDownload}"
      on:showShare="{loadShare}"
      on:showLearnMore="{({ detail }) => loadLearnMore(detail)}"
    />
  </div>

  <div slot="settings" class="settings">
    <SettingsPanel
      activeTab="{activeTab}"
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

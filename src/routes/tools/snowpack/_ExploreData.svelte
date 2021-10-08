<script>
  import { Button, Loading } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    SELECT_LOCATION_DESCRIPTION,
    DEFAULT_BOUNDARIES,
    MONTHS_LIST,
  } from "../_common/constants";
  import { LEARN_MORE_SELECT_MONTH } from "./_constants";

  import {
    flattenData,
    getDataByDate,
    formatDataForExport,
  } from "../_common/helpers";

  import { serialize } from "~/helpers/utilities";

  import { Dashboard, LearnMoreButton } from "~/components/tools/Partials";
  import {
    RadioBtnGroup,
    SelectMonth,
    SelectScenario,
    SelectModels,
    SelectThresholdNumeric,
  } from "~/components/tools/Settings";
  import { StaticMap } from "~/components/tools/Location";
  import { Map, NavigationControl } from "~/components/tools/Map";
  import { LineAreaChart } from "~/components/tools/Charts";
  import { RangeAvg } from "~/components/tools/Stats";

  import {
    scenarioStore,
    locationStore,
    dataStore,
    modelsStore,
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import { climvarStore, monthStore, viewStore } from "./_store";

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

  let bookmark;

  let learnMoreProps = {};
  let chartDescription = `<p>The colored lines on this visualization represent 
    a timeseries of montly average values from individual downscaled GCMs. The historical observed data is represented by 
    a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries.</p>`;

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  let activeTab;

  $: if (Array.isArray($dataStore) && $dataStore.length) {
    statsData = $dataStore.filter((d) => d.type !== "area");
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

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
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

  function changeSelectedMonth(e) {
    monthStore.set(e.detail.id);
  }
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard useTabs="{true}" on:tabChange="{handleTabChange}">
  <div
    slot="tab_content_slippy_map"
    class="graphic block bx--aspect-ratio bx--aspect-ratio--16x9"
  >
    <Map>
      <NavigationControl />
    </Map>
  </div>

  <div slot="tab_content_map">
    <StaticMap location="{$location}" width="{500}" height="{500}" />
  </div>

  <div slot="tab_content_title" class="block title">
    <div class="h3">
      {$location.title}
    </div>
    <div class="h4">
      Projected changes in Snow Water Equivalence under a {$scenario.labelLong}
    </div>
    <Button size="small" icon="{Location16}" on:click="{loadLocation}">
      Change Location
    </Button>
  </div>

  <div slot="tab_content_stats">
    <ul class="stats">
      <li class="block"></li>
      <li class="block"></li>
      <li class="block"></li>
      <!-- <li class="block">
        <RangeAvg
          units="{$indicator.units}"
          data="{statsData}"
          isHistorical="{true}"
          series="{'historical'}"
          period="{'baseline'}"
          format="{formatFn}"
        />
      </li>
      <li class="block">
        <RangeAvg
          units="{$indicator.units}"
          data="{statsData}"
          isHistorical="{false}"
          series="{'future'}"
          period="{'mid-century'}"
          format="{formatFn}"
        />
      </li>
      <li class="block">
        <RangeAvg
          units="{$indicator.units}"
          data="{statsData}"
          isHistorical="{false}"
          series="{'future'}"
          period="{'end-century'}"
          format="{formatFn}"
        />
      </li> -->
    </ul>
  </div>

  <div slot="tab_content_graphic" class="graphic block">
    <!-- <LineAreaChart
      data="{$dataStore}"
      dataByDate="{dataByDate}"
      yAxis="{{
        key: 'value',
        label: `Number of ${$indicator.label} (Base temperature ${$thresholdStore}˚F)`,
        tickFormat: formatFn,
        units: `${$indicator.units}`,
      }}"
    /> -->

    <div class="chart-notes margin--v-8">
      <p>
        Source: Cal-Adapt. Data: {$titles.join(", ")}.
      </p>
    </div>
    <div class="chart-download margin--v-8">
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
    {#if activeTab === "map"}
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
        <SelectMonth
          items="{MONTHS_LIST}"
          selectedId="{$monthStore}"
          on:change="{changeSelectedMonth}"
        />
        <LearnMoreButton
          on:click="{() => loadLearnMore({ content: LEARN_MORE_SELECT_MONTH })}"
        />
      </div>
    {:else}
      <div class="block">
        <span class="bx--label">Select Location</span>
        <StaticMap
          location="{$location}"
          width="{350}"
          height="{350}"
          on:click="{loadLocation}"
        />
        <div class="center-row">
          <LearnMoreButton
            on:click="{() =>
              loadLearnMore({
                content: SELECT_LOCATION_DESCRIPTION,
                header: 'Select Location',
              })}"
          />
        </div>
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
        <SelectMonth
          items="{MONTHS_LIST}"
          selectedId="{$monthStore}"
          on:change="{changeSelectedMonth}"
        />
        <LearnMoreButton
          on:click="{() => loadLearnMore({ content: LEARN_MORE_SELECT_MONTH })}"
        />
      </div>

      <div class="block">
        <SelectModels
          selectedIds="{$modelsStore}"
          items="{PRIORITY_10_MODELS}"
          on:change="{changeModels}"
        />
        <LearnMoreButton
          on:click="{() =>
            loadLearnMore({
              slugs: ['cooling-degree-day', 'heating-degree-day'],
            })}"
        />
      </div>

      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
    {/if}
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

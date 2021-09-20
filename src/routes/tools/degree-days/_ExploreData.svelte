<script>
  import { Button, Loading } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    SMALL_SCALE_BOUNDARIES,
    MONTHS_LIST,
  } from "../_common/constants";
  import {
    DEFAULT_SELECTED_MONTHS,
    MAX_THRESHOLD_DEGREES_F,
    MIN_THRESHOLD_DEGREES_F,
  } from "./_constants";
  import {
    flattenData,
    getDataByDate,
    formatDataForExport,
  } from "../_common/helpers";
  import { getSelectedMonthStrings } from "./_helpers";

  // Components
  import { Dashboard, LearnMoreButton } from "~/components/tools/Partials";
  import {
    RadioBtnGroup,
    SelectMonth,
    SelectScenario,
    SelectModels,
    SelectThresholdNumeric,
  } from "~/components/tools/Settings";
  import { StaticMap } from "~/components/tools/Location";
  import { LineAreaChart } from "~/components/tools/Charts";
  import { RangeAvg } from "~/components/tools/Stats";

  // Store
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
    indicatorsList,
    indicatorsStore,
    thresholdStore,
    frequencyStore,
    frequencyList,
    selectedMonthsStore,
  } from "./_store";

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { titles } = datasetStore;
  const { indicator } = indicatorsStore;

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
    a timeseries of annual average values from individual downscaled GCMs. 
    The gray shaded region in the background represents the range of projections 
    from all 32 downscaled GCMs. The historical observed data is represented by 
    a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries.</p>`;

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  $: formatFn = format(`.${$indicator.decimals}f`);

  $: indicatorTitle = $indicator.title.replace("Degree Days ", "");
  $: frequencyLabel = frequencyList.find((d) => d.id === $frequencyStore).label;
  $: frequencyLabel =
    $frequencyStore === "A" ? frequencyLabel.replace("ly", "") : frequencyLabel;
  $: monthsLabel = $frequencyStore === "M" ? getMonthsLabel() : "";

  $: if (Array.isArray($dataStore) && $dataStore.length) {
    statsData = $dataStore.filter((d) => d.type !== "area");
    dataByDate = getDataByDate(flattenData($dataStore));
    isFetchingStore.set(false);
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
      bookmark = `climvar=${$climvarStore}&scenario=${$scenarioStore}&models=${modelsStr}&lng=${lng}&lat=${lat}&boundary=${$boundary.id}`;
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
      ["climate indicator", $indicator],
      ["units", $climvar.units.imperial],
    ];
    printContainer = document.querySelector("#explore");
    printSkipElements = ["settings"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
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

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
    console.log("scenario change");
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
    console.log("models change");
  }

  function changeIndicator(e) {
    indicatorsStore.set(e.detail);
    console.log(`indicator changed: ${e.detail.id}`);
  }

  function changeLocation(e) {
    if (e.detail.boundaryId === "custom") {
      locationStore.updateBoundary("locagrid");
      locationStore.updateLocation(e.detail.location, true);
    } else {
      locationStore.updateBoundary(e.detail.boundaryId);
      locationStore.updateLocation(e.detail.location);
    }
    console.log("location change");
  }

  function changeThreshold(e) {
    thresholdStore.set(e.detail);
    console.log("threshold changed:", e.detail);
  }

  function changeFrequency(e) {
    frequencyStore.set(e.detail);
    console.log(`frequency changed: ${e.detail}`);
  }

  function changeSelectedMonths(e) {
    selectedMonthsStore.set(e.detail);
    console.log(`frequency months changed: ${e.detail}`);
  }
</script>

<style lang="scss">
  .block {
    background-color: var(--white);
    box-shadow: var(--box-shadow);
    height: 100%;
    box-sizing: border-box;
    padding: var(--spacing-16);
  }

  .annotate {
    font-weight: 600;
  }

  .h4 {
    font-weight: 400;
  }

  .title {
    > * {
      margin: var(--spacing-8) 0;
    }

    .h3 {
      margin-top: 0;
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    grid-gap: var(--spacing-16);
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .chart-download {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .settings {
    width: 100%;
    display: grid;
    grid-gap: var(--spacing-8);
    grid-template-columns: repeat(auto-fit, minmax(208px, 1fr));

    .block {
      background-color: var(--gray-20);
      height: auto;
    }
  }
</style>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard>
  <div slot="map">
    <StaticMap location="{$location}" width="{500}" height="{500}" />
  </div>

  <div slot="title" class="block title">
    <div class="h3">
      {$location.title}
    </div>
    <div class="h4">
      Projected changes in <span class="annotate"
        >{frequencyLabel} {indicatorTitle}</span
      >
      under a <span class="annotate">{$scenario.labelLong}</span>{monthsLabel
        ? ""
        : "."}
      {#if monthsLabel}
        for the months of <span class="annotate">{monthsLabel}</span>.
      {/if}
    </div>
    <Button size="small" icon="{Location16}" on:click="{loadLocation}">
      Change Location
    </Button>
  </div>

  <div slot="stats">
    <ul class="stats">
      <li class="block">
        <RangeAvg
          units="{$indicator.units.imperial}"
          data="{statsData}"
          isHistorical="{true}"
          series="{'historical'}"
          period="{'baseline'}"
          format="{formatFn}"
        />
      </li>
      <li class="block">
        <RangeAvg
          units="{$indicator.units.imperial}"
          data="{statsData}"
          isHistorical="{false}"
          series="{'future'}"
          period="{'mid-century'}"
          format="{formatFn}"
        />
      </li>
      <li class="block">
        <RangeAvg
          units="{$indicator.units.imperial}"
          data="{statsData}"
          isHistorical="{false}"
          series="{'future'}"
          period="{'end-century'}"
          format="{formatFn}"
        />
      </li>
    </ul>
  </div>

  <div slot="graphic" class="graphic block">
    <LineAreaChart
      data="{$dataStore}"
      dataByDate="{dataByDate}"
      yAxis="{{
        key: 'value',
        label: `Number of ${$indicator.label} (Base temperature ${$thresholdStore}˚F)`,
        tickFormat: formatFn,
        units: `${$indicator.units.imperial}`,
      }}"
    />

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
    <div class="block">
      <RadioBtnGroup
        selected="{$indicatorsStore}"
        items="{indicatorsList}"
        title="Select Indicator"
        on:change="{changeIndicator}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            slugs: ['cooling-degree-day', 'heating-degree-day'],
          })}"
      />
    </div>

    <div class="block">
      <SelectScenario
        selectedId="{$scenarioStore}"
        items="{DEFAULT_SCENARIOS}"
        on:change="{changeScenario}"
      />
      <LearnMoreButton
        on:click="{() => loadLearnMore({ slugs: ['climate-scenarios'] })}"
      />
    </div>

    <div class="block">
      <RadioBtnGroup
        title="Select frequency"
        selected="{$frequencyStore}"
        items="{frequencyList}"
        on:change="{changeFrequency}"
      />
      <div class="spacing--v-16"></div>
      {#if $frequencyStore === "M"}
        <SelectMonth
          multi="{true}"
          items="{MONTHS_LIST}"
          selectedId="{DEFAULT_SELECTED_MONTHS}"
          on:change="{changeSelectedMonths}"
        />
      {/if}
      <LearnMoreButton />
    </div>

    <div class="block">
      <SelectThresholdNumeric
        title="Set Threshold"
        value="{$thresholdStore}"
        minValue="{MIN_THRESHOLD_DEGREES_F}"
        maxValue="{MAX_THRESHOLD_DEGREES_F}"
        on:change="{changeThreshold}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            slugs: ['cooling-degree-day', 'heating-degree-day'],
          })}"
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
  boundaryList="{SMALL_SCALE_BOUNDARIES}"
  enableUpload="{false}"
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

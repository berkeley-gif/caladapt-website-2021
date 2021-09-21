<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    RadioButtonGroup,
    Button,
    Loading,
    NumberInput,
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    SMALL_SCALE_BOUNDARIES,
  } from "../_common/constants";
  import {
    flattenData,
    getDataByDate,
    formatDataForExport,
  } from "../_common/helpers";

  // Components
  import { Dashboard, LearnMoreButton } from "~/components/tools/Partials";
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    SelectThreshold,
    RadioBtnGroup,
  } from "~/components/tools/Settings";
  import { StaticMap } from "~/components/tools/Location";

  // Store
  import {
    scenarioStore,
    locationStore,
    modelsStore,
    datasetStore,
  } from "../_common/stores";
  import {
    climvarList,
    climvarStore,
    indicatorList,
    indicatorStore,
    thresholdStore,
    thresholdListStore,
    durationStore,
    dataStore,
  } from "./_store";

  const dispatch = createEventDispatcher();
  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { indicator } = indicatorStore;
  const { titles } = datasetStore;
  const { data } = dataStore;

  let isLoading = true;
  let dataByDate;
  let statsData;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;
  let showLearnMore = false;
  let modelsInit = false;

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
      ["climate indicator", $climvar.label],
      ["units", $climvar.units.imperial],
    ];
    printContainer = document.querySelector("#explore");
    printSkipElements = ["settings"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  $: if (modelsInit) dispatch("ready");

  $: formatFn = format(`.${$indicator.decimals}f`);

  $: if ($data) {
    console.log("from explore", $data);
    statsData = $data.filter((d) => d.type !== "area");
    dataByDate = getDataByDate(flattenData($data));
    isLoading = false;
  } else {
    statsData = null;
    dataByDate = null;
    isLoading = true;
  }

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
    console.log("scenario change");
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
    modelsInit = true;
    console.log("models change");
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
    console.log("climvar change");
  }

  function changeIndicator(e) {
    indicatorStore.set(e.detail.id);
    console.log("indicator change");
  }

  function changeDuration(e) {
    durationStore.set(e.detail);
    console.log("duration change");
  }

  function changeThreshold(e) {
    thresholdStore.set(e.detail);
    console.log("threshold change");
  }

  function addThreshold(e) {
    thresholdListStore.add(e.detail);
    console.log("threshold add");
  }

  function removeThreshold(e) {
    thresholdListStore.remove(e.detail);
    console.log("threshold remove");
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

{#if isLoading}
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
      Projected changes in <span class="annotate">{$indicator.title}</span>
      above <span class="annotate">{$thresholdStore} °F</span> under a
      <span class="annotate">{$scenario.labelLong}</span>.
    </div>
    <Button size="small" icon="{Location16}" on:click="{loadLocation}">
      Change Location
    </Button>
  </div>

  <div slot="stats">
    <ul class="stats">
      <li class="block">
        <svelte:component
          this="{$indicator.statsComponent}"
          units="{$indicator.units}"
          data="{statsData}"
          isHistorical="{true}"
          series="{'historical'}"
          period="{'baseline'}"
          format="{formatFn}"
        />
      </li>
      <li class="block">
        <svelte:component
          this="{$indicator.statsComponent}"
          units="{$indicator.units}"
          data="{statsData}"
          isHistorical="{false}"
          series="{'future'}"
          period="{'mid-century'}"
          format="{formatFn}"
        />
      </li>
      <li class="block">
        <svelte:component
          this="{$indicator.statsComponent}"
          units="{$indicator.units}"
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
    <svelte:component
      this="{$indicator.chartComponent}"
      data="{$data}"
      dataByDate="{dataByDate}"
      yAxis="{{
        key: 'value',
        label: `${$indicator.title}`,
        baseValue: 0,
        tickFormat: formatFn,
        units: `${$indicator.units}`,
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
        selected="{$climvarStore}"
        items="{climvarList}"
        title="Select Indicator"
        on:change="{changeClimvar}"
      />
      <SelectClimvar
        title=""
        selectedId="{$indicatorStore}"
        items="{indicatorList}"
        on:change="{changeIndicator}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            slugs: [
              'annual-average-tasmax',
              'annual-average-tasmin',
              'annual-average-pr',
            ],
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
      <SelectThreshold
        items="{$thresholdListStore}"
        selected="{$thresholdStore}"
        units="{$climvar.units.imperial}"
        helperText="Add a new threshold value or select from existing values."
        on:change="{changeThreshold}"
        on:add="{addThreshold}"
        on:remove="{removeThreshold}"
      />
      <LearnMoreButton />
    </div>
    {#if $indicator.id === "waves"}
      <div class="block">
        <NumberInput
          label="Change Heat Wave Duration"
          min="{2}"
          max="{7}"
          helperText="A number between 2-7. This sets the number of consecutive days in a heat wave."
          value="{$durationStore}"
          on:change="{changeDuration}"
        />
        <LearnMoreButton />
      </div>
    {/if}
    <div class="block">
      <SelectModels
        selectedIds="{$modelsStore}"
        items="{PRIORITY_10_MODELS}"
        on:change="{changeModels}"
      />
      <LearnMoreButton on:click="{() => loadLearnMore({ slugs: ['gcms'] })}" />
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

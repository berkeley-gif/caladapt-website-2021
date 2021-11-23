<script>
  import { createEventDispatcher } from "svelte";
  import { Button, Loading, NumberInput } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    SMALL_SCALE_BOUNDARIES,
    SELECT_LOCATION_DESCRIPTION,
    DEFAULT_STAT_GROUPS,
    DEFAULT_STAT_PERIODS,
  } from "../_common/constants";
  import { HEATMAP_COLOR_SCALE, INDICATOR_DESCRIPTION } from "./_constants";
  import {
    flattenData,
    groupDataByYear,
    groupDataByDay,
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
  $: chartDescription = $indicator.description;

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
      ["climate indicator", `${$climvar.label} ${$indicator.label}`],
      ["threshold", `${thresholdStore} ${$climvar.units.imperial}`],
    ];
    printContainer = document.querySelector("#explore-data");
    printSkipElements = ["settings"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  $: if (modelsInit) dispatch("ready");

  $: formatFn = format(`.${$indicator.decimals}f`);
  $: indicatorTitle =
    $climvar.id === "tasmin"
      ? $indicator.title.replace("Extreme Heat Days", "Warm Nights")
      : $indicator.title;

  $: if ($data) {
    if ($indicator.id === "timing") {
      dataByDate = groupDataByDay(flattenData($data));
    } else {
      dataByDate = groupDataByYear(flattenData($data));
    }
    isLoading = false;
  } else {
    dataByDate = null;
    isLoading = true;
  }

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
    modelsInit = true;
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail);
  }

  function changeIndicator(e) {
    indicatorStore.set(e.detail.id);
  }

  function changeDuration(e) {
    durationStore.set(e.detail);
  }

  function changeThreshold(e) {
    thresholdStore.set(e.detail);
  }

  function addThreshold(e) {
    thresholdListStore.add(e.detail);
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

{#if isLoading}
  <Loading />
{/if}

<Dashboard>
  <div slot="title" class="block title">
    <Button
      class="btn-change-location"
      size="small"
      icon="{Location16}"
      kind="ghost"
      on:click="{loadLocation}"
    >
      Change Location
    </Button>
    <div class="h3">
      {$location.title}
    </div>
    {#if $indicator.id === "waves"}
      <div class="h4">
        Projected changes in <span class="annotate"
          >Number of {$durationStore} Day Heat Wave Events per Year</span
        >
        when <span class="annotate">{$climvar.title}</span> is above
        <span class="annotate">{$thresholdStore} °F</span>
        under a
        <span class="annotate">{$scenario.labelLong}</span>.
      </div>
    {:else}
      <div class="h4">
        Projected changes in <span class="annotate">{indicatorTitle}</span>
        when <span class="annotate">{$climvar.title}</span> is above
        <span class="annotate">{$thresholdStore} °F</span>
        under a
        <span class="annotate">{$scenario.labelLong}</span>.
      </div>
    {/if}
  </div>

  <div slot="stats">
    <ul class="stats">
      <li class="block">
        <svelte:component
          this="{$indicator.statsComponent}"
          units="{$indicator.units}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() < 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => d.historical)}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => d.historical)}"
          format="{formatFn}"
          models="{$modelsStore}"
        />
      </li>
      <li class="block">
        <svelte:component
          this="{$indicator.statsComponent}"
          units="{$indicator.units}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() >= 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
          format="{formatFn}"
          models="{$modelsStore}"
        />
      </li>
      <li class="block">
        <svelte:component
          this="{$indicator.statsComponent}"
          units="{$indicator.units}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() >= 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
          periodId="end-century"
          format="{formatFn}"
          models="{$modelsStore}"
        />
      </li>
    </ul>
  </div>

  <div slot="graphic" class="graphic block">
    <svelte:component
      this="{$indicator.chartComponent}"
      height="400px"
      data="{$data}"
      dataByDate="{dataByDate}"
      yAxis="{{
        key: 'value',
        label: `${$indicator.title}`,
        domainMin: 0,
        niceMax: 10,
        tickFormat: formatFn,
        units: `${$indicator.units}`,
      }}"
      colors="{HEATMAP_COLOR_SCALE}"
    />
    <div class="chart-notes margin--v-32">
      <p>
        Source: Cal-Adapt. Data: {$titles.join(", ")}.
      </p>
    </div>
    <div class="chart-download margin--v-16">
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
      <span class="bx--label">Select Location</span>
      <StaticMap
        location="{$location}"
        width="{350}"
        height="{350}"
        on:click="{loadLocation}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            content: SELECT_LOCATION_DESCRIPTION,
            header: 'Select Location',
          })}"
      />
    </div>
    <div class="block">
      <RadioBtnGroup
        selected="{$climvarStore}"
        items="{climvarList}"
        title="Select Climate Variable"
        on:change="{changeClimvar}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            slugs: ['extreme-heat-day', 'warm-night'],
          })}"
      />
    </div>
    <div class="block">
      <SelectClimvar
        title="Select Indicator"
        selectedId="{$indicatorStore}"
        items="{indicatorList}"
        on:change="{changeIndicator}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            content: INDICATOR_DESCRIPTION,
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
        on:click="{() => loadLearnMore({ slugs: ['emissions-scenario'] })}"
      />
    </div>
    {#if $indicator.id === "waves"}
      <div class="block">
        <NumberInput
          label="Change Heat Wave Duration"
          min="{2}"
          max="{7}"
          value="{$durationStore}"
          on:change="{changeDuration}"
        />
        <LearnMoreButton
          on:click="{() => loadLearnMore({ slugs: ['heat-wave-event'] })}"
        />
      </div>
    {/if}
    <div class="block">
      <SelectThreshold
        items="{$thresholdListStore}"
        selected="{$thresholdStore}"
        units="{$climvar.units.imperial}"
        helperText="Add a new threshold value or select from list"
        on:change="{changeThreshold}"
        on:add="{addThreshold}"
      />
      <LearnMoreButton
        on:click="{() => loadLearnMore({ slugs: ['extreme-heat-threshold'] })}"
      />
    </div>
    <div class="block">
      <SelectModels
        selectedIds="{$modelsStore}"
        items="{PRIORITY_10_MODELS}"
        on:change="{changeModels}"
      />
      <LearnMoreButton
        on:click="{() => loadLearnMore({ slugs: ['global-climate-model'] })}"
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

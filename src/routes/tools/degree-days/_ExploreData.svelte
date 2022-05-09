<script>
  import { afterUpdate } from "svelte";
  import { Button, Loading } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    SMALL_SCALE_BOUNDARIES,
    MONTHS_LIST,
    SELECT_LOCATION_DESCRIPTION,
    DEFAULT_STAT_GROUPS,
    DEFAULT_STAT_PERIODS,
  } from "../_common/constants";
  import {
    MAX_THRESHOLD_DEGREES_F,
    MIN_THRESHOLD_DEGREES_F,
  } from "./_constants";
  import {
    flattenData,
    groupDataByYear,
    formatDataForExport,
  } from "../_common/helpers";
  import { getSelectedMonthStrings } from "./_helpers";
  import { serialize } from "~/helpers/utilities";

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
  import { AvgRange } from "~/components/tools/Stats";

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
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;
  let showLearnMore = false;

  // async component imports
  let ChangeLocation;
  let DownloadChart;
  let ShareLink;
  let LearnMoreModal;

  let bookmark = "";
  let shareLinkWarning = "";

  let learnMoreProps = {};
  let chartDescription = `<p>The colored lines on this visualization represent 
    a timeseries of CDDs or HDDs averaged annually or over the selected months from individual downscaled GCMs. The historical observed data is represented by 
    a gray line from 1950-2006.</p><p>Click on any of the legend keys to highlight 
    corresponding timeseries.</p>`;

  let learnMoreFrequency = `<p>You can explore average number of CDDs or HDDs per 
    year (Annual) or for selected months (Monthly). Monthly frequency can be a single 
    month or several consecutive months e.g.  exploring CDDs for June, July & August.
    </p>`;

  let baseTemperature = `<p>Heating or Cooling Degree Days are calculated with reference to a Base Temperature, e.g. 65 °F. You can set the Base Temperature to a different value that meets your analysis requirements.</p>`;

  let invalidThresholdText = `Value must be between ${MIN_THRESHOLD_DEGREES_F} 
    and ${MAX_THRESHOLD_DEGREES_F}.`;

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  let chartTitle = "";

  $: formatFn = format(`.${$indicator.decimals}f`);

  $: indicatorTitle = $indicator.title.replace("Degree Days ", "");
  $: frequencyLabel = setFrequencyLabel($frequencyStore);
  $: monthsLabel =
    $frequencyStore === "M" && $selectedMonthsStore ? getMonthsLabel() : "";

  $: if (Array.isArray($dataStore) && $dataStore.length) {
    dataByDate = groupDataByYear(flattenData($dataStore));
    isFetchingStore.set(false);
  } else {
    dataByDate = null;
  }

  afterUpdate(() => {
    if ($location && $location.title) {
      chartTitle = $location.title;
    }
  });

  function setFrequencyLabel(fstoreValue) {
    let value = frequencyList.find((d) => d.id === fstoreValue).label;
    return fstoreValue === "AS" ? value.replace("ly", "") : value;
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
      shareLinkWarning = "Cannot create a share link for a custom boundary";
    } else {
      bookmark = serialize({
        climvar: $climvarStore,
        frequency: $frequencyStore,
        indicator: $indicatorsStore,
        scenario: $scenarioStore,
        threshold: $thresholdStore,
        models: $modelsStore.join(","),
        months: $selectedMonthsStore,
        fid: $location.id,
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
      await import("~/components/tools/Partials/ChangeLocationStation.svelte")
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
      ["units", $indicator.units],
    ];
    printContainer = document.querySelector("#explore-data");
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
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
  }

  function changeIndicator(e) {
    indicatorsStore.set(e.detail);
  }

  function changeLocation(e) {
    if (e.detail.boundaryId === "custom") {
      // FIXME: this prevents the ShareLink from preventing a shareable URL
      // because the boundary id will never be "custom" when a user clicks the
      // share button.
      // NOTE: custom boundary upload was removed in #236 so currenty this code
      // does nothing. When re-implementing the custom boundary upload, this
      // should be fixed.
      locationStore.updateBoundary("locagrid");
      locationStore.updateLocation(e.detail.location, true);
    } else {
      locationStore.updateBoundary(e.detail.boundaryId);
      locationStore.updateLocation(e.detail.location);
    }
  }

  function changeThreshold(e) {
    thresholdStore.set(e.detail);
  }

  function changeFrequency(e) {
    frequencyStore.set(e.detail);
  }

  function changeSelectedMonths(e) {
    selectedMonthsStore.set(e.detail);
  }
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard>
  <div slot="chart_title" class="block title">
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
      {chartTitle}
    </div>
    <div class="h4">
      Projected changes in <span class="annotate"
        >{frequencyLabel} {indicatorTitle}</span
      >
      using a base temperature of
      <span class="annotate">{$thresholdStore} °F</span>
      under a <span class="annotate">{$scenario.labelLong}</span>{monthsLabel
        ? ""
        : "."}
      {#if monthsLabel}
        for the months of <span class="annotate">{monthsLabel}</span>.
      {/if}
    </div>
  </div>

  <div slot="stats">
    <ul class="stats">
      <li class="block">
        <AvgRange
          units="{$indicator.units}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() < 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => d.id === 'observed')}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => d.historical)}"
          format="{formatFn}"
          models="{$modelsStore}"
          isFetching="{$isFetchingStore}"
        />
      </li>
      <li class="block">
        <AvgRange
          units="{$indicator.units}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() >= 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
          periodId="mid-century"
          format="{formatFn}"
          models="{$modelsStore}"
          isFetching="{$isFetchingStore}"
        />
      </li>
      <li class="block">
        <AvgRange
          units="{$indicator.units}"
          data="{dataByDate
            ? dataByDate.filter((d) => d.date.getUTCFullYear() >= 2006)
            : null}"
          groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
          periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
          periodId="end-century"
          format="{formatFn}"
          models="{$modelsStore}"
          isFetching="{$isFetchingStore}"
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
        units: `${$indicator.units}`,
        domainMin: 0,
        niceMax: 10,
      }}"
      isFetching="{$isFetchingStore}"
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
        height="{250}"
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
        on:click="{() => loadLearnMore({ slugs: ['emissions-scenario'] })}"
      />
    </div>

    <div class="block">
      <RadioBtnGroup
        title="Select frequency"
        selected="{$frequencyStore}"
        items="{frequencyList}"
        on:change="{changeFrequency}"
      />
      <div class="spacing--v-8"></div>
      {#if $frequencyStore === "M"}
        <SelectMonth
          multi="{true}"
          items="{MONTHS_LIST}"
          selectedId="{$selectedMonthsStore}"
          on:change="{changeSelectedMonths}"
        />
      {/if}
      <LearnMoreButton
        on:click="{() => loadLearnMore({ content: learnMoreFrequency })}"
      />
    </div>

    <div class="block">
      <SelectThresholdNumeric
        title="Set Base Temperature"
        value="{$thresholdStore}"
        minValue="{MIN_THRESHOLD_DEGREES_F}"
        maxValue="{MAX_THRESHOLD_DEGREES_F}"
        invalidText="{invalidThresholdText}"
        delay="{1200}"
        on:change="{changeThreshold}"
      />
      <LearnMoreButton
        on:click="{() => loadLearnMore({ content: baseTemperature })}"
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
  errorMsg="{shareLinkWarning}"
/>

<svelte:component
  this="{ChangeLocation}"
  bind:open="{showChangeLocation}"
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

<script>
  import {
    Button,
    Loading,
    NumberInput,
    RadioButtonGroup,
    RadioButton,
    Checkbox,
    InlineLoading,
    SkeletonText,
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { extent } from "d3-array";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import {
    DEFAULT_STATION_LAYER,
    CHART_DESCRIPTION,
    SELECT_STATION_DESCRIPTION,
    THRESHOLD_DESCRIPTION,
    EXTREME_EVENT_DESCRIPTION,
    PROPBABILITY_DESCRIPTION,
    DOY_DESCRIPTION,
    EXTREMES_DESCRIPTION,
  } from "./_constants";
  import {
    getObservedReturnLevels,
    filterPercentiles,
    filterThreshold,
    getThresholdText,
    calcThresholdProbability,
    calcThresholdExceedances,
    getForecastData,
    filterForecast,
    getMeasuredData,
    filterMeasured,
  } from "./_data";

  // Components
  import { Dashboard, LearnMoreButton } from "~/components/tools/Partials";
  import { SelectClimvar, SelectDayOfYear } from "~/components/tools/Settings";
  import { StaticMap } from "~/components/tools/Location";
  import { Histogram, Observations } from "~/components/tools/Charts";
  import { notifier } from "~/components/notifications";

  // Store
  import {
    climvarList,
    climvarStore,
    locationStore,
    doyStore,
    thresholdStore,
    hadisdStore,
    unitsStore,
    extremesStore,
    forecastDate,
    forecastStore,
    measuredStore,
    measuredDateRange,
    queryParams,
    threshCIStore,
    baseline,
  } from "./_store";

  const { gevisf, hadisdDateRange } = hadisdStore;
  const { doyText, begin, end } = doyStore;
  const { climvar } = climvarStore;
  const { location } = locationStore;
  //TODO: Use dataset info from API after data download tool is migrated
  //const { titles } = datasetStore;
  const titles = ["Hourly Observed Historical Data (Met Office Hadley Centre)"];

  let isLoading = true;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;
  let showLearnMore = false;

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

  let histogramData;
  let histogramAnnotation;

  let threshBound;
  let threshInvalidText;
  let threshValid = true;
  let threshProbability;
  let threshExceedances;
  let threshCI;
  let threshCILoading = true;
  let probability_description_with_ci = PROPBABILITY_DESCRIPTION;

  let showForecast = false;
  let forecast = null;
  let forecastLoading = false;

  let showMeasured = false;
  let measured = null;
  let measuredLoading = false;

  let xDomain;

  $: formatFn = format(`.${$climvar.decimals}f`);
  $: dataSourceTitles = titles;
  $: $locationStore, resetObservations();
  $: $climvar, updateObservations();

  $: if ($baseline) {
    histogramData = $baseline.values.map((d) => +d.value);
    histogramAnnotation = filterPercentiles(
      $baseline.percentiles,
      $extremesStore
    );
    threshBound = filterThreshold($baseline.percentiles, $extremesStore);
    threshInvalidText = getThresholdText($extremesStore);
    changeThreshold({ detail: threshBound });
    isLoading = false;
  } else {
    isLoading = true;
  }

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
    const id = $locationStore.id;
    const { imperial } = $unitsStore;
    const { doy } = $doyStore;
    bookmark = `climvar=${$climvarStore}&imperial=${imperial}&station=${id}&doy=${doy}&extremes=${$extremesStore}`;
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
    metadata = [
      ["station", $location.title],
      ["variable", $climvar.label],
      ["units", $climvar.units.imperial],
      ["record high", `{$baseline.high.value} on {$baseline.high.date}`],
      ["record low", `{$baseline.low.value} on {$baseline.low.date}`],
    ];
    csvData = $baseline.values;
    printContainer = document.querySelector("#explore-data");
    printSkipElements = ["settings", "chart-controls"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
    if (e.detail.id === "tasmax") {
      extremesStore.set("high");
    } else if (e.detail.id === "tasmin") {
      extremesStore.set("low");
    } else {
      extremesStore.set("high");
    }
    console.log("climvar change");
  }

  function changeExtremes(e) {
    extremesStore.set(e.detail);
    console.log("extremes change");
  }

  function changeDayOfYear(e) {
    doyStore.set(e.detail);
    console.log("doy change");
  }

  function changeLocation(e) {
    showChangeLocation = false;
    locationStore.updateLocation(e.detail.location);
    console.log("location change");
  }

  function checkThresholdValidity(val) {
    if ($extremesStore === "high") {
      return val >= threshBound;
    }
    return val <= threshBound;
  }

  async function getProbabilityCI(rp) {
    const config = {
      climvarId: $climvarStore,
    };
    const { params } = $queryParams;
    params.intervals = rp;
    const response = await getObservedReturnLevels(config, params);
    const level = response[0].levels[0];
    return [level.lowerci, level.upperci];
  }

  async function changeThreshold(e) {
    if (!e || !e.detail) return;
    threshValid = checkThresholdValidity(e.detail);
    if (!threshValid) return;
    thresholdStore.set(+e.detail);
    console.log("threshold change");
    xDomain = updateDataExtent([...$baseline.dataExtent, +e.detail]);
    threshProbability = calcThresholdProbability({
      gevisf: $gevisf,
      threshold: +e.detail,
    });
    threshExceedances = calcThresholdExceedances({
      values: histogramData,
      threshold: +e.detail,
      extremes: $extremesStore,
    });
    threshCILoading = true;
    threshCI = await getProbabilityCI(threshProbability.rp);
    threshCIStore.set(threshCI);
    probability_description_with_ci = `${PROPBABILITY_DESCRIPTION}
    <p>The <strong>95% Confidence Intervals</strong> for your selected 
    threshold value are <strong>[${$threshCIStore[0].toFixed(1)}, 
    ${$threshCIStore[1].toFixed(1)}] °F</strong></p>`;
    threshCILoading = false;
  }

  function resetObservations() {
    showForecast = false;
    showMeasured = false;
    forecastStore.set(null);
    measuredStore.set(null);
    forecast = null;
    measured = null;
  }

  function updateObservations() {
    if ($forecastStore) {
      forecast = filterForecast($climvar.id, $forecastStore);
    }
    if ($measuredStore) {
      measured = filterMeasured($climvar.id, $measuredStore);
    }
  }

  async function getForecast() {
    forecastLoading = true;
    try {
      const data = await getForecastData({
        lng: $location.geometry.coordinates[0],
        lat: $location.geometry.coordinates[1],
      });
      forecastStore.set(data);
      forecast = filterForecast($climvar.id, data);
      forecastLoading = false;
      return data;
    } catch (error) {
      console.log("error fetching forecast");
      forecastLoading = false;
      dataSourceTitles = dataSourceTitles.filter((d) => !d.includes("NWS"));
      showForecast = false;
      notifier.error(
        "Error",
        "Unable to get forecast from NWS at this time. Try again in a few minutes.",
        2000
      );
    }
  }

  function toggleForecastDisplay() {
    showForecast = !showForecast;
    if (showForecast) {
      dataSourceTitles = [...dataSourceTitles, "Near-Term Forecast (NWS)"];
      if (forecast === null) {
        getForecast();
      }
    } else {
      dataSourceTitles = dataSourceTitles.filter((d) => !d.includes("NWS"));
    }
  }

  async function getMeasured() {
    measuredLoading = true;
    try {
      const data = await getMeasuredData({
        stationId: `USW000${$location.properties.wban}`,
        startDate: $measuredDateRange.start,
        endDate: $measuredDateRange.end,
      });
      measuredStore.set(data);
      measured = filterMeasured($climvar.id, data);
      measuredLoading = false;
      return data;
    } catch (error) {
      console.log("error fetching noaa data");
      measuredLoading = false;
      showMeasured = false;
      dataSourceTitles = dataSourceTitles.filter((d) => !d.includes("NCEI"));
      notifier.error(
        "Error",
        "Unable to get recent observations from NCEI at this time. Try again in a few minutes.",
        2000
      );
    }
  }

  function toggleMeasuredDisplay() {
    showMeasured = !showMeasured;
    if (showMeasured) {
      dataSourceTitles = [...dataSourceTitles, "GHCN-Daily (NCEI)"];
      if (measured === null) {
        getMeasured();
      }
    } else {
      dataSourceTitles = dataSourceTitles.filter((d) => !d.includes("NCEI"));
    }
  }
</script>

<style lang="scss">
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    grid-gap: var(--spacing-16);

    .wide {
      grid-column-end: span 2;
    }
  }
</style>

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
      Change Station
    </Button>
    <div class="h3">
      {$location.title} ({$location.geometry.coordinates[0]}°, {$location
        .geometry.coordinates[1]}°)
    </div>
    <div class="h4">
      Distribution of daily <span class="annotate">{$climvar.title}s</span>
      around <span class="annotate">{$doyText}</span> (<span class="annotate"
        >&#177;10 days</span
      >) from 1991-2020.
    </div>
  </div>

  <div slot="stats" class="stats">
    <div class="block wide">
      {#if threshValid && !threshCILoading}
        <p>
          A daily <span class="annotate">{$climvar.title}</span> of
          <span class="annotate threshold">{$thresholdStore}°F</span>
          around <span class="annotate">{$doyText}</span> is a
          <span class="annotate">{threshProbability.label}</span>
          event. Based on Extreme Value Theory and historical observations (1991-2020),
          the probability of daily
          <span class="annotate">{$climvar.title}</span>
          being {$extremesStore}er than
          <span class="annotate threshold">{$thresholdStore}°F</span>
          at least once between <span class="annotate">{$begin}</span> and
          <span class="annotate">{$end}</span>
          is {threshProbability.append}
          <span class="annotate">{threshProbability.value}%</span>.
        </p>
        <p>
          In the Baseline Period (1991-2020), a daily <span class="annotate"
            >{$climvar.title}</span
          >
          {$extremesStore}er than
          <span class="annotate threshold">{$thresholdStore} °F</span>
          occurred <span class="annotate">{threshExceedances}</span>
          times between <span class="annotate">{$begin}</span> and
          <span class="annotate">{$end}</span>.
        </p>
        <LearnMoreButton
          cta="{'Extreme Events'}"
          on:click="{() =>
            loadLearnMore({
              content: EXTREME_EVENT_DESCRIPTION,
              header: 'What is an extreme event?',
            })}"
        />
        <LearnMoreButton
          cta="{'Exceedance Probability'}"
          on:click="{() =>
            loadLearnMore({
              content: probability_description_with_ci,
              header: 'What is Exceedance Probability?',
            })}"
        />
      {:else}
        <SkeletonText paragraph />
      {/if}
    </div>
    <div class="block">
      {#if $baseline}
        <p>
          In the available record ({$hadisdDateRange}) between
          <span class="annotate">{$begin}</span>
          and
          <span class="annotate">{$end}</span>:
        </p>
        <p>
          A <span class="annotate">Record Low</span> of
          <span class="annotate">{$baseline.low.value}</span>
          was observed on <span class="annotate">{$baseline.low.date}</span>
        </p>
        <p>
          A <span class="annotate">Record High</span> of
          <span class="annotate">{$baseline.high.value}</span>
          was observed on <span class="annotate">{$baseline.high.date}</span>
        </p>
      {/if}
    </div>
  </div>

  <div slot="graphic" class="graphic block">
    <div class="chart-controls">
      {#if measuredLoading && !measured}
        <InlineLoading
          description="Fetching recent observations from NCEI..."
        />
      {:else}
        <div class="measured-toggle">
          <Checkbox
            labelText="{`Show Recent Observations of ${$climvar.title}`}"
            checked="{showMeasured}"
            on:check="{toggleMeasuredDisplay}"
          />
        </div>
      {/if}
      {#if forecastLoading && !forecast}
        <InlineLoading description="Fetching forecast from NWS..." />
      {:else}
        <div class="forecast-toggle">
          <Checkbox
            labelText="{`Show 7 Day Forecast for ${$forecastDate}`}"
            checked="{showForecast}"
            on:check="{toggleForecastDisplay}"
          />
        </div>
      {/if}
    </div>
    <Histogram
      data="{histogramData}"
      labels="{histogramAnnotation}"
      threshold="{threshValid ? $thresholdStore : null}"
      xDomain="{xDomain}"
      yAxis="{{
        label: `% Days`,
        tickFormat: formatFn,
        units: `${$climvar.units.imperial}`,
      }}"
      xAxis="{{
        label: `${$climvar.title} (${$climvar.units.imperial})`,
        tickFormat: formatFn,
        units: `${$climvar.units.imperial}`,
      }}"
    />
    {#if showMeasured && measured}
      <Observations
        title="{'Recent Observations'}"
        data="{measured}"
        height="{240}"
        y1="{80}"
        xDomain="{xDomain}"
        units="{$climvar.units.imperial}"
      />
    {/if}
    {#if showForecast && forecast}
      <Observations
        title="{'Forecast'}"
        data="{forecast}"
        height="{180}"
        y1="{showMeasured ? 320 : 80}"
        xDomain="{xDomain}"
        units="{$climvar.units.imperial}"
      />
    {/if}
    <div class="chart-notes margin--v-16">
      <p>
        Source: Cal-Adapt. Data: {dataSourceTitles.join(", ")}.
      </p>
    </div>
    <div class="chart-download margin--v-8">
      <LearnMoreButton
        cta="{'Explain Chart'}"
        on:click="{() =>
          loadLearnMore({
            content: CHART_DESCRIPTION,
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
      <span class="bx--label">Select Station</span>
      <StaticMap
        location="{$location}"
        width="{350}"
        height="{350}"
        on:click="{loadLocation}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            content: SELECT_STATION_DESCRIPTION,
            header: 'Select Station',
          })}"
      />
    </div>
    <div class="block">
      <SelectClimvar
        labelText="Select Climate Variable"
        selectedId="{$climvarStore}"
        items="{climvarList}"
        on:change="{changeClimvar}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            slugs: ['daily-maximum-temp', 'daily-minimum-temp'],
          })}"
      />
    </div>
    <div class="block">
      <RadioButtonGroup
        legendText="Choose Type of Extremes"
        orientation="vertical"
        selected="{$extremesStore}"
        on:change="{changeExtremes}"
      >
        <RadioButton labelText="High Extremes" value="high" />
        <RadioButton labelText="Low Extremes" value="low" />
      </RadioButtonGroup>
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            content: EXTREMES_DESCRIPTION,
            header: 'Type of Extremes',
          })}"
      />
    </div>
    <div class="block">
      <SelectDayOfYear
        labelText="Enter Day of Year"
        value="{$doyStore}"
        on:change="{changeDayOfYear}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            content: DOY_DESCRIPTION,
            header: 'Day of Year',
          })}"
      />
    </div>
    <div class="block">
      <NumberInput
        label="Enter Threshold"
        invalid="{!threshValid}"
        invalidText="{threshInvalidText}"
        value="{$thresholdStore}"
        on:change="{changeThreshold}"
      />
      <LearnMoreButton
        on:click="{() =>
          loadLearnMore({
            content: THRESHOLD_DESCRIPTION,
            header: 'Threshold',
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

<script>
  import {
    Button,
    Loading,
    NumberInput,
    RadioButtonGroup,
    RadioButton,
    Checkbox,
    InlineLoading,
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { min, max, extent } from "d3-array";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import { climvarList, stationsLayer } from "./_helpers";
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
  import { Dashboard } from "~/components/tools/Partials";
  import {
    SelectClimvar,
    SelectDayOfYear,
    ShowDefinition,
  } from "~/components/tools/Settings";
  import { StaticMap } from "~/components/tools/Location";
  import { Histogram, Observations } from "~/components/tools/Charts";
  import { notifier } from "~/components/notifications";

  // Store
  import {
    climvarStore,
    locationStore,
    bookmark,
    doyStore,
    doyRange,
    thresholdStore,
    hadisdStore,
    //datasetStore,
    extremesStore,
    forecastDate,
    forecastStore,
    measuredStore,
    measuredDateRange,
    queryParams,
    threshCIStore,
  } from "./_store";

  const { baseline, gevisf, begin, end, hadisdDateRange } = hadisdStore;
  const { doyText } = doyStore;
  const { climvar } = climvarStore;
  const { location } = locationStore;
  //TODO: Use dataset info from API after data download tool is migrated
  //const { titles } = datasetStore;
  const titles = ["Hourly Observed Historical Data (Met Office Hadley Centre)"];

  let isLoading = true;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;

  let ChangeStation;
  let DownloadChart;
  let ShareLink;

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
    thresholdStore.set(threshBound);
    //xDomain = updateDataExtent([...$baseline.dataExtent, $thresholdStore]);
    isLoading = false;
  } else {
    isLoading = true;
  }

  function updateDataExtent(arr) {
    const dataExtent = extent(arr);
    return [dataExtent[0] - 2, dataExtent[1] + 2];
  }

  async function loadShare() {
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
    printContainer = document.querySelector("#explore");
    printSkipElements = ["settings", "chart-controls"];
    DownloadChart = (
      await import("~/components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
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
    threshCI = await getProbabilityCI(threshProbability.rp);
    threshCIStore.set(threshCI);
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
  .block {
    background-color: var(--white);
    box-shadow: var(--box-shadow);
    height: 100%;
    box-sizing: border-box;
    padding: var(--spacing-16);
  }

  .annotate {
    font-weight: 600;

    &.threshold {
      color: red;
    }
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

    .wide {
      grid-column-end: span 2;
    }
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
      {$location.title} ({$location.geometry.coordinates[0]}°, {$location
        .geometry.coordinates[1]}°)
    </div>
    <div class="h4">
      Distribution of daily <span class="annotate">{$climvar.title}s</span>
      around <span class="annotate">{$doyText}</span> (<span class="annotate"
        >{$doyRange}</span
      >) from 1991-2020.
    </div>
    <Button size="small" icon="{Location16}" on:click="{loadLocation}">
      Change Location
    </Button>
  </div>

  <div slot="stats" class="stats">
    <div class="block wide">
      {#if threshValid && threshProbability}
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
        <ShowDefinition
          topics="{['extreme-event']}"
          title="What is an extreme event?"
          cta="Extreme Events"
          on:define
        />
        <ShowDefinition
          topics="{['probability']}"
          title="What is Exceedance Probability?"
          cta="Exceedance Probability"
          on:define
        />
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
    <div class="chart-notes margin--v-8">
      <p>
        Source: Cal-Adapt. Data: {dataSourceTitles.join(", ")}.
      </p>
    </div>
    <div class="chart-download margin--v-8">
      <ShowDefinition
        topics="{['chart']}"
        title="About the Chart"
        cta="Explain Chart"
        on:define
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
      <SelectClimvar
        labelText="Select Climate Variable"
        selectedId="{$climvarStore}"
        items="{climvarList}"
        on:change="{changeClimvar}"
      />
      <ShowDefinition
        on:define
        topics="{['tasmax', 'tasmin']}"
        title="Climate Variables"
      />
    </div>
    <div class="block">
      <RadioButtonGroup
        legendText="Choose Type of Extremes"
        orientation="vertical"
        selected="high"
        on:change="{changeExtremes}"
      >
        <RadioButton labelText="High Extremes" value="high" />
        <RadioButton labelText="Low Extremes" value="low" />
      </RadioButtonGroup>
      <ShowDefinition
        on:define
        topics="{['extremes']}"
        title="Type of Extremes"
      />
    </div>
    <div class="block">
      <SelectDayOfYear
        labelText="Choose Day of Year"
        value="{$doyStore}"
        on:change="{changeDayOfYear}"
      />
      <ShowDefinition on:define topics="{['doy']}" title="Day of Year" />
    </div>
    <div class="block">
      <NumberInput
        label="Enter Threshold"
        invalid="{!threshValid}"
        invalidText="{threshInvalidText}"
        value="{$thresholdStore}"
        on:change="{changeThreshold}"
      />
      <ShowDefinition on:define topics="{['threshold']}" title="Threshold" />
    </div>
  </div>
</Dashboard>

<svelte:component
  this="{ShareLink}"
  bind:open="{showShare}"
  state="{$bookmark}"
/>

<svelte:component
  this="{ChangeStation}"
  bind:open="{showChangeLocation}"
  location="{$location}"
  stationsLayer="{stationsLayer}"
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

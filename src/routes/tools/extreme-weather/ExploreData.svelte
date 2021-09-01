<script>
  import {
    Button,
    Modal,
    Accordion,
    AccordionItem,
    NumberInput,
    RadioButtonGroup,
    RadioButton,
    Checkbox,
    InlineLoading,
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";

  // Helpers
  import { climvarList, stationsLayer } from "./_helpers";
  import {
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
  import {
    SelectClimvar,
    SelectDayOfYear,
    ShowDefinition,
  } from "~/components/tools/Settings";
  import { StaticMap } from "~/components/tools/Location";
  import { Histogram } from "~/components/tools/Charts";
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
    datasetStore,
    extremesStore,
    forecastDate,
    forecastStore,
    measuredStore,
    measuredDateRange,
  } from "./_store";

  const { baseline, gevisf, begin, end, hadisdDateRange } = hadisdStore;
  const { doyText } = doyStore;
  const { climvar } = climvarStore;
  const { location } = locationStore;
  const { titles } = datasetStore;

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
  let recordLow;
  let recordHigh;

  let threshBound;
  let threshInvalidText;
  let threshValid = true;
  let threshProbability;
  let threshExceedances;

  let showForecast = false;
  let forecast = null;
  let forecastLoading = false;

  let showMeasured = false;
  let measured = null;
  let measuredLoading = false;

  $: formatFn = format(`.${$climvar.decimals}f`);
  $: dataSourceTitles = $titles;
  $: $locationStore, resetObservations();
  $: $climvar, updateObservations();

  $: if ($baseline) {
    histogramData = $baseline.values.map((d) => +d.value);
    histogramAnnotation = filterPercentiles(
      $baseline.percentiles,
      $extremesStore
    );
    recordLow = $baseline.low;
    recordHigh = $baseline.high;
    threshBound = filterThreshold($baseline.percentiles, $extremesStore);
    threshInvalidText = getThresholdText($extremesStore);
    thresholdStore.set(threshBound);
    isLoading = false;
  } else {
    isLoading = true;
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
      ["record high", recordHigh],
      ["record low", recordLow],
    ];
    csvData = $baseline.values;
    printContainer = document.querySelector(".explore");
    printSkipElements = ["explore-settings"];
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

  async function changeThreshold(e) {
    if (!e || !e.detail) return;
    threshValid = checkThresholdValidity(e.detail);
    if (!threshValid) return;
    thresholdStore.set(+e.detail);
    console.log("threshold change");
    threshProbability = calcThresholdProbability({
      gevisf: $gevisf,
      threshold: +e.detail,
    });
    threshExceedances = calcThresholdExceedances({
      values: histogramData,
      threshold: +e.detail,
    });
    //threshCI = await getProbabilityCI(thresholdProbability.rp);
    // console.log("trehosld ci", thresholdCI);
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
      dataSourceTitles = [...dataSourceTitles, "National Weather Service"];
      return data;
    } catch (error) {
      console.log("error fetching forecast");
      forecastLoading = false;
      dataSourceTitles = dataSourceTitles.filter(
        (d) => d !== "National Weather Service"
      );
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
      if (forecast === null) {
        getForecast();
      }
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
      console.log("data", data);
      measuredStore.set(data);
      measured = filterMeasured($climvar.id, data);
      measuredLoading = false;
      dataSourceTitles = [
        ...dataSourceTitles,
        "National Centers for Environmental Information",
      ];
      return data;
    } catch (error) {
      console.log("error fetching noaa data");
      measuredLoading = false;
      showMeasured = false;
      dataSourceTitles = dataSourceTitles.filter(
        (d) => d !== "National Centers for Environmental Information"
      );
      notifier.error(
        "Error",
        "Unable to get recent observations from NOAA at this time. Try again in a few minutes.",
        2000
      );
    }
  }

  function toggleMeasuredDisplay() {
    showMeasured = !showMeasured;
    if (showMeasured) {
      if (measured === null) {
        getMeasured();
      }
    }
  }
</script>

<style>
  .block-title.threshold {
    color: red;
  }
</style>

<div class="explore">
  {#if isLoading}
    <div class="explore-loading-overlay"></div>
  {/if}

  <!-- Controls -->
  <div class="explore-controls"></div>

  <!-- Title -->
  <div class="explore-header block">
    <StaticMap location="{$location}" width="{500}" height="{500}" />
    <div class="explore-header-title">
      <div class="h3 block-title">
        {$location.title}&nbsp; (<span class="block-title"
          >{$location.geometry.coordinates[0]}°</span
        >,&nbsp;
        <span class="block-title">{$location.geometry.coordinates[1]}°</span>)
      </div>
      <div class="h4">
        Distribution of daily <span class="block-title">{$climvar.title}s</span>
        around
        <span class="block-title">{$doyText} ({$doyRange})</span> from 1991-2020.
      </div>
      <div>
        <Button size="small" icon="{Location16}" on:click="{loadLocation}">
          Change Location
        </Button>
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div
    class="explore-stats"
    style="grid-template-columns: auto minmax(18rem, 1fr);"
  >
    <div class="block">
      {#if threshValid && threshProbability}
        <p>
          A daily <span class="block-title">{$climvar.title}</span> of
          <span class="block-title threshold">{$thresholdStore}°F</span>
          around <span class="block-title">{$doyText}</span> is a
          <span class="block-title">{threshProbability.label}</span>
          event. Based on historical observations, the probability of exceeding
          <span class="block-title threshold">{$thresholdStore}°F</span>
          at least once between <span class="block-title">{$begin}</span> and
          <span class="block-title">{$end}</span>
          is <span class="block-title">{threshProbability.value}%</span>.
        </p>
        <p>
          In the Baseline period (1991-2020), a temperature of <span
            class="block-title threshold">{$thresholdStore} °F</span
          >
          was exceeded <span class="block-title">{threshExceedances}</span>
          times between <span class="block-title">{$begin}</span> and
          <span class="block-title">{$end}</span> for the graphic below.
        </p>
        <ShowDefinition
          topics="{['extreme-event']}"
          title="Extreme Value Analysis"
          on:define
        />
      {/if}
    </div>

    <div class="block">
      {#if $baseline}
        <p>
          From the Historical period ({$hadisdDateRange}) available for this
          station, between <span class="block-title">{$begin}</span> and
          <span class="block-title">{$end}</span>:
        </p>
        <p>
          A <span class="block-title">Record Low</span> of
          <span class="block-title">{$baseline.low.value}</span>
          was observed on <span class="block-title">{$baseline.low.date}</span>
        </p>
        <p>
          A <span class="block-title">Record High</span> of
          <span class="block-title">{$baseline.high.value}</span>
          was observed on <span class="block-title">{$baseline.high.date}</span>
        </p>
      {/if}
    </div>
  </div>

  <!-- Chart-->
  <div class="explore-chart block">
    <div class="chart-controls">
      {#if measuredLoading && !measured}
        <InlineLoading
          description="Fetching recent observations from NOAA..."
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
      forecast="{showForecast ? forecast : null}"
      measured="{showMeasured ? measured : null}"
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
    <div class="chart-notes">
      <p>
        Source: Cal-Adapt. Data: {dataSourceTitles.join(", ")}.
      </p>
    </div>
    <div class="chart-download">
      <ShowDefinition topics="{['chart']}" title="About the Chart" on:define />
      <div>
        <Button size="small" icon="{Download16}" on:click="{loadDownload}">
          Download Chart
        </Button>
        <Button
          size="small"
          icon="{Share16}"
          on:click="{() => (showShare = true)}"
        >
          Share
        </Button>
      </div>
    </div>
  </div>

  <!-- Settings-->
  <div class="explore-settings">
    <div class="h4 block-title">Change Settings:</div>
    <Accordion class="settings-list">
      <AccordionItem open title="Select Climate Variable">
        <SelectClimvar
          selectedId="{$climvarStore}"
          items="{climvarList}"
          on:change="{changeClimvar}"
        />
        <ShowDefinition
          on:define
          topics="{['tasmax', 'tasmin']}"
          title="Climate Variables"
        />
      </AccordionItem>
      <AccordionItem open title="Choose Type of Extremes">
        <RadioButtonGroup
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
      </AccordionItem>
      <AccordionItem open title="Choose Day of Year">
        <SelectDayOfYear value="{$doyStore}" on:change="{changeDayOfYear}" />
        <ShowDefinition on:define topics="{['doy']}" title="Day of Year" />
      </AccordionItem>
      <AccordionItem open title="Enter Threshold">
        <NumberInput
          invalid="{!threshValid}"
          invalidText="{threshInvalidText}"
          value="{$thresholdStore}"
          on:change="{changeThreshold}"
        />
        <ShowDefinition on:define topics="{['threshold']}" title="Threshold" />
      </AccordionItem>
    </Accordion>
  </div>
</div>

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

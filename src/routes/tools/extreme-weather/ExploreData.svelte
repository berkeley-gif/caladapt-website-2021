<script>
  import {
    Button,
    Modal,
    Accordion,
    AccordionItem,
    CodeSnippet,
    NumberInput,
    RadioButtonGroup,
    RadioButton,
    Checkbox,
    InlineLoading,
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import {
    Download16,
    Share16,
    Location16,
    Information16,
  } from "carbon-icons-svelte";
  import copy from "clipboard-copy";

  // Helpers
  import { climvarList, stationsLayer } from "./_helpers";
  import {
    calcBaselineStats,
    calcThreshold,
    calcReturnPeriod,
    getForecastData,
    getObservedReturnLevels,
    filterForecast,
  } from "./_data";

  // Components
  import {
    SelectClimvar,
    SelectDayOfYear,
    ShowDefinition,
  } from "../../../components/tools/Settings";
  import { StaticMap } from "../../../components/tools/Location";
  import { Histogram } from "../../../components/tools/Charts";
  import { notifier } from "../../../components/notifications";

  // Store
  import {
    climvarStore,
    locationStore,
    bookmark,
    doyStore,
    thresholdStore,
    observationsStore,
    datasetStore,
    extremesStore,
    forecastDate,
    forecastStore,
    queryParams,
  } from "./_store";

  const { baseline, returnLevels, doyRange } = observationsStore;
  const { climvar } = climvarStore;
  const { doyText } = doyStore;
  const { titles } = datasetStore;
  const { location } = locationStore;

  let isLoading = true;
  let showDownload = false;
  let showShare = false;
  let showChangeLocation = false;

  let showForecast = false;
  let forecast = null;
  let forecastLoading = false;

  let baselineData;
  let baselineLabels;
  let thresholdOpts = {};
  let isThresholdValid;
  let thresholdProbability;
  let thresholdCI;

  let ChangeStation;
  let DownloadChart;

  let metadata;
  let csvData;
  let printContainer;
  let printSkipElements;

  $: $locationStore, updateForecast();

  function checkThresholdValidity(val) {
    if ($extremesStore === "high") {
      return val >= thresholdOpts.bound;
    }
    return val <= thresholdOpts.bound;
  }

  function updateForecast() {
    showForecast = false;
    forecastStore.reset();
    forecast = null;
  }

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if ($baseline) {
    baselineData = $baseline.values.map((d) => +d.value);
    baselineLabels = calcBaselineStats($baseline, $extremesStore);
    thresholdOpts = calcThreshold(baselineLabels, $extremesStore);
    thresholdStore.set(thresholdOpts.bound);
    isLoading = false;
  } else {
    isLoading = true;
  }

  async function loadLocation() {
    showChangeLocation = true;
    ChangeStation = (
      await import("../../../components/tools/Partials/ChangeStation.svelte")
    ).default;
  }

  async function loadDownload() {
    showDownload = true;
    metadata = [
      ["station", $location.title],
      ["variable", $climvar.label],
      ["units", $climvar.units.imperial],
      ["record high", `${$baseline.high.value} on ${$baseline.high.date}`],
      ["record low", `${$baseline.low.value} on ${$baseline.low.date}`],
    ];
    csvData = $baseline.values;
    printContainer = document.querySelector(".explore");
    printSkipElements = ["explore-settings"];
    DownloadChart = (
      await import("../../../components/tools/Partials/DownloadChart.svelte")
    ).default;
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
    if ($forecastStore) {
      forecast = filterForecast(e.detail.id, $forecastStore);
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
    isThresholdValid = checkThresholdValidity(e.detail);
    if (!isThresholdValid) return;
    thresholdStore.set(e.detail);
    console.log("threshold change");
    thresholdProbability = calcReturnPeriod($returnLevels, e.detail);
    //thresholdCI = await getProbabilityCI(thresholdProbability.rp);
    //console.log("trehosld ci", thresholdCI);
  }

  function changeLocation(e) {
    showChangeLocation = false;
    locationStore.updateLocation(e.detail.location);
    console.log("location change");
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
      notifier.error(
        "Error",
        "Unable to get forecast from NWS at this time. Try again in a few minutes.",
        2000
      );
      forecastLoading = false;
      showForecast = false;
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
</script>

<style>
  :global(.forecast-toggle .bx--checkbox-label-text::after) {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: var(--teal-60);
    margin-left: 2px;
  }

  .block-title.threshold::after {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: red;
    margin-left: 2px;
  }

  .threshold-info p {
    margin-bottom: 0;
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
      <h3><span class="block-title">{$location.title}</span></h3>
      <h4>
        Distribution of daily <span class="block-title">{$climvar.title}s</span>
        around
        <span class="block-title">{$doyText} ({$doyRange})</span> from 1991-2020.
      </h4>
      {#if isThresholdValid && thresholdProbability}
        <div class="threshold-info">
          <p>
            A daily <span class="block-title">{$climvar.title}</span> of
            <span class="block-title threshold">{$thresholdStore} °F</span>
            around <span class="block-title">{$doyText}</span> is a
            <span class="block-title">{thresholdProbability.label}</span>
            event. The probability of exceeding
            <span class="block-title">{$thresholdStore} °F</span>
            is
            <span class="block-title">{thresholdProbability.probability}%</span>
            and is estimated to be a
            <span class="block-title">1 in {thresholdProbability.rp}</span> year
            event.
          </p>
          <!-- <ShowDefinition topics="{['probability']}" title="Chart" on:define /> -->
        </div>
      {/if}
      <div>
        <Button size="small" icon="{Location16}" on:click="{loadLocation}">
          Change Location
        </Button>
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="explore-stats"></div>

  <!-- Chart-->
  <div class="explore-chart block">
    <div class="chart-controls">
      {#if forecastLoading && !forecast}
        <InlineLoading description="Fetching forecast from NWS..." />
      {:else}
        <div class="forecast-toggle">
          <Checkbox
            labelText="{`Show 7-Day Forecast for ${$forecastDate}`}"
            checked="{showForecast}"
            on:click="{toggleForecastDisplay}"
          />
        </div>
      {/if}
    </div>
    <Histogram
      data="{baselineData}"
      labels="{baselineLabels}"
      forecast="{forecast}"
      threshold="{isThresholdValid ? $thresholdStore : null}"
      yAxis="{{
        label: `Count of Days`,
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
        Source: Cal-Adapt. Data: {$titles.join(", ")}.
      </p>
    </div>
    <div class="chart-download">
      <ShowDefinition topics="{['histogram-chart']}" title="Chart" on:define />
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
    <h4 class="block-title">Change Settings:</h4>
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
          invalid="{!isThresholdValid}"
          invalidText="{thresholdOpts.invalidText}"
          value="{$thresholdStore}"
          on:change="{changeThreshold}"
        />
        <ShowDefinition on:define topics="{['threshold']}" title="Threshold" />
      </AccordionItem>
    </Accordion>
  </div>
</div>

<Modal
  id="share"
  passiveModal
  bind:open="{showShare}"
  modalHeading="Share Link"
  on:open
  on:close
>
  <CodeSnippet
    type="multi"
    wrapText
    code="{$bookmark}"
    on:click="{() => copy($bookmark)}"
  />
</Modal>

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

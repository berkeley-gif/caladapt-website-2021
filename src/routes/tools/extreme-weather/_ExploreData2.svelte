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
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";
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
    thresholdStore,
    observationsStore,
    datasetStore,
    extremesStore,
    forecastDate,
    forecastStore,
    queryParams,
    doyRange,
    measuredStore,
    measuredDateRange,
  } from "./_store";

  const { baseline, returnLevels } = observationsStore;
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

  let showMeasured = false;
  let measured = null;
  let measuredLoading = false;

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

  $: dataSourceTitles = $titles;
  $: $locationStore, resetForecast();

  $: if (showForecast) {
    dataSourceTitles = [...dataSourceTitles, "National Weather Service"];
  } else {
    dataSourceTitles = dataSourceTitles.filter(
      (d) => d !== "National Weather Service"
    );
  }

  $: if (showMeasured) {
    dataSourceTitles = [
      ...dataSourceTitles,
      "National Centers for Environmental Information",
    ];
  } else {
    dataSourceTitles = dataSourceTitles.filter(
      (d) => d !== "National Centers for Environmental Information"
    );
  }

  function checkThresholdValidity(val) {
    if ($extremesStore === "high") {
      return val >= thresholdOpts.bound;
    }
    return val <= thresholdOpts.bound;
  }

  function resetForecast() {
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
      await import("~/components/tools/Partials/ChangeStation.svelte")
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
      await import("~/components/tools/Partials/DownloadChart.svelte")
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
    thresholdProbability = calcReturnPeriod({
      returnLevels: $returnLevels,
      threshold: e.detail,
      observations: baselineData,
    });
    console.log("thresholdProbability", thresholdProbability);
    thresholdCI = await getProbabilityCI(thresholdProbability.rp);
    console.log("trehosld ci", thresholdCI);
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

  async function getMeasured() {
    measuredLoading = true;
    console.log($measuredDateRange);
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
      return data;
    } catch (error) {
      console.log("error fetching noaa data");
      notifier.error(
        "Error",
        "Unable to get recent observations from NOAA at this time. Try again in a few minutes.",
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
  .block-title.threshold::after {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: red;
    margin-left: 2px;
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
        <span class="block-title">{$doyText} (m days before, n days after)</span
        > from 1991-2020.
      </div>
      <div>
        <Button size="small" icon="{Location16}" on:click="{loadLocation}">
          Change Location
        </Button>
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="explore-stats">
    <div class="block">
      {#if isThresholdValid && thresholdProbability}
        <p>
          A daily <span class="block-title">{$climvar.title}</span> of
          <span class="block-title threshold">{$thresholdStore} °F</span>
          around <span class="block-title">{$doyText}</span> is a
          <span class="block-title">{thresholdProbability.label}</span>
          event.
        </p>
        <p>
          Based on historical observations, the probability of exceeding <span
            class="block-title">{$thresholdStore} °F</span
          >
          at least once between
          <span class="block-title">{$doyRange.begin}</span>
          and <span class="block-title">{$doyRange.end}</span> is
          <span class="block-title">{thresholdProbability.probability}%</span>.
        </p>
        <p>
          In the baseline period (1991-2020), a temperature of <span
            class="block-title threshold">{$thresholdStore} °F</span
          >
          was exceeded <span class="block-title">m</span> times between
          <span class="block-title">{$doyRange.begin}</span>
          and <span class="block-title">{$doyRange.end}</span> for the graphic below.
        </p>
        <ShowDefinition
          topics="{['extreme-event', 'return-period']}"
          title="Extreme Value Analysis"
          on:define
        />
      {/if}
    </div>

    <div class="block">
      {#if baselineLabels}
        <div>
          <span class="h5">Record Low</span>
          <span class="h5"
            >{baselineLabels.low.value} on {baselineLabels.low.date}</span
          >
        </div>
        <div>
          <span class="h5">Record High</span>
          <span class="h5"
            >{baselineLabels.high.value} on {baselineLabels.high.date}</span
          >
        </div>
      {/if}
    </div>
  </div>

  Based on historical observations, the probability of exceeding 106 deg F at
  least once between mm/dd and mm/dd is yy%.

  <!-- Chart-->
  <div class="explore-chart block">
    <div class="chart-controls">
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
      {#if measuredLoading && !measured}
        <InlineLoading
          description="Fetching recent observations from NOAA..."
        />
      {:else}
        <div class="measured-toggle">
          <Checkbox
            labelText="{`Show Past 7 Days ${$climvar.title}s`}"
            checked="{showMeasured}"
            on:check="{toggleMeasuredDisplay}"
          />
        </div>
      {/if}
    </div>
    <!--     <Histogram
      data="{baselineData}"
      labels="{baselineLabels}"
      forecast="{showForecast ? forecast : null}"
      measured="{showMeasured ? measured : null}"
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
    /> -->
    <div class="chart-notes">
      <p>
        Source: Cal-Adapt. Data: {dataSourceTitles.join(", ")}.
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

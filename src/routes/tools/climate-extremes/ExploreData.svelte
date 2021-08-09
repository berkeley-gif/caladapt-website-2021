<script>
  import { createEventDispatcher } from "svelte";
  import {
    Button,
    Modal,
    Accordion,
    AccordionItem,
    CodeSnippet,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    NumberInput,
    Loading,
    SkeletonText,
    Grid,
    Row,
    Column,
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { timeFormat } from "d3-time-format";
  import { csvFormat, csvFormatRows } from "d3-dsv";
  import { Download16, Share16, ChartLineData32 } from "carbon-icons-svelte";
  import copy from "clipboard-copy";
  import {
    ReturnLevelCurveChart,
    Histogram,
    Forecast,
  } from "../../../components/tools/Charts";

  // Helpers
  import {
    climvarList,
    modelList,
    scenarioList,
    indicatorList,
  } from "./_helpers";
  import {
    getReturnLevels,
    formatDataForExport,
    getObservationStats,
    getBaselineStats,
    getSeriesReturnPeriods,
  } from "./_data";
  import {
    exportSVG,
    exportPNG,
    exportCSV,
    exportPDF,
  } from "../../../helpers/export";
  import { debounce } from "../../../helpers/utilities";

  // Components
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    SelectDayOfYear,
    ShowDefinition,
  } from "../../../components/tools/Settings";
  import { ValuesList } from "../../../components/tools/Stats";
  import DownloadChart from "../../../components/tools/DownloadChart.svelte";
  import { notifier } from "../../../components/notifications";

  // Store
  import {
    climvarStore,
    scenarioStore,
    dataStore,
    modelsStore,
    stationStore,
    bookmark,
    doyStore,
    thresholdStore,
    indicatorStore,
    observationsStore,
    forecastStore,
  } from "./_store";

  export let runUpdate = false;

  const dispatch = createEventDispatcher();

  const { data } = dataStore;
  const { baseline, observations } = observationsStore;
  const { forecast } = forecastStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { indicator } = indicatorStore;
  const { doyText } = doyStore;
  const { station } = stationStore;

  let isLoading = true;
  let showDownload = false;
  let showShare = false;

  let projectionsChartData;
  let histogramChartData;
  let forecastChartData;

  let series;
  let statsData;

  let thresholdBound;
  let thresholdExtreme;
  let thresholdInvalid;
  let thresholdInvalidText;

  let returnPeriods;
  let historicalReturnPeriod;
  let projectedReturnPeriods;

  $: metadata = [
    ["station", $station.properties.name],
    ["center", `${$station.lng}, ${$station.lat}`],
    ["scenario", $scenario.label],
    ["units", $climvar.units.imperial],
  ];

  $: valueFormat = format(`.${$climvar.decimals}f`);

  $: if ($data) {
    projectionsChartData = getReturnLevels($data);
    series = $data.map((d) => ({ key: d.key, label: d.label, color: d.color }));
    isLoading = false;
  } else {
    isLoading = true;
    projectionsChartData = null;
    returnPeriods = null;
  }

  $: if ($baseline) {
    histogramChartData = $baseline.map((d) => d.value);
    const observedStart = $observations[0].date.getFullYear();
    const observedEnd =
      $observations[$observations.length - 1].date.getFullYear();
    const observedStats = getObservationStats($observations);
    const baselineStats = getBaselineStats($baseline, $climvar.id);
    if ($climvar.id === "tasmax") {
      thresholdBound = baselineStats.find(
        (d) => d.label === "75th Percentile"
      ).value;
      thresholdExtreme = baselineStats.find(
        (d) => d.label === "90th Percentile"
      ).value;
    } else if ($climvar.id === "tasmin") {
      thresholdBound = baselineStats.find(
        (d) => d.label === "25th Percentile"
      ).value;
      thresholdExtreme = baselineStats.find(
        (d) => d.label === "10th Percentile"
      ).value;
    } else {
      thresholdBound = 0;
      thresholdExtreme = 0;
    }
    statsData = [
      {
        title: `Full Record (${observedStart}-${observedEnd})`,
        stats: observedStats,
      },
      {
        title: `Baseline (1991-2020)`,
        stats: baselineStats,
      },
    ];
  } else {
    histogramChartData = null;
    statsData = [];
  }

  $: if ($forecast) {
    forecastChartData = $forecast;
    console.log("forecastData", forecastChartData);
  }

  // Reset user defined threshold value only when a new location is selected
  $: if (runUpdate) {
    thresholdStore.set(thresholdBound);
  }

  $: if ($thresholdStore && $data) {
    returnPeriods = $data.map((series) =>
      getSeriesReturnPeriods(series, $thresholdStore)
    );
    historicalReturnPeriod = returnPeriods.find((d) => d.key === "historical");
    projectedReturnPeriods = returnPeriods.filter(
      (d) => d.key !== "historical"
    );
    if ($climvar.id === "tasmax") {
      thresholdInvalid = $thresholdStore < thresholdBound;
      thresholdInvalidText = "Number must be >= 75th percentile value";
    } else if ($climvar.id === "tasmin") {
      thresholdInvalid = $thresholdStore > thresholdBound;
      thresholdInvalidText = "Number must be <= 25th percentile value";
    } else {
      thresholdInvalid = false;
      thresholdInvalidText = "";
    }
  }

  // TODO: Fix downloads
  async function downloadViz(e) {
    isLoading = true;
    const format = e.detail;
    showDownload = false;
    try {
      const container = document.querySelector(".explore-chart");
      switch (format) {
        case "png":
          await exportPNG(container);
          break;
        case "svg":
          await exportSVG(container);
          break;
        case "csv":
          var csvData = formatDataForExport(data);
          var csvWithMetadata = `${csvFormatRows(metadata)} \n \n ${csvFormat(
            csvData
          )}`;
          await exportCSV(csvWithMetadata);
          break;
        case "pdf":
          var gridContainer = document.querySelector(".explore-grid");
          await exportPDF(gridContainer, $station);
          break;
        default:
        // Do nothing
      }
      notifier.success(
        "Download",
        `Successfully created ${format} file`,
        "",
        2000
      );
    } catch (error) {
      notifier.error("Download", `Error creating ${format} file`, error, 2000);
    }
    isLoading = false;
  }

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
    console.log("scenario change");
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds.join(","));
    console.log("models change");
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
    console.log("climvar change");
  }

  function changeDayOfYear(e) {
    doyStore.set(e.detail);
    console.log("doy change", e.detail);
  }

  function changeIndicator(e) {
    indicatorStore.updateIndicator(e.detail);
  }

  const changeThreshold = debounce((e) => {
    console.log("threshold change");
    thresholdStore.set(e.detail);
  }, 500);
</script>

<div class="explore">
  {#if isLoading}
    <div class="explore-loading-overlay">
      {#if runUpdate}
        <Loading withOverlay="{false}" />
      {/if}
    </div>
  {/if}

  <!-- Controls -->
  <div class="explore-controls">
    <Button
      size="lg"
      icon="{ChartLineData32}"
      disabled="{runUpdate}"
      on:click="{() => dispatch('update')}"
    >
      FETCH DATA FOR LOCATION
    </Button>
  </div>

  <!-- Title -->
  <div class="explore-title">
    <div class="block">
      <FormGroup legendText="SELECT VIEW" style="margin-bottom:0;">
        <RadioButtonGroup selected="observations" on:change="{changeIndicator}">
          {#each indicatorList as opt}
            <RadioButton labelText="{opt.label}" value="{opt.id}" />
          {/each}
        </RadioButtonGroup>
      </FormGroup>
    </div>
    <div class="block">
      <div class="center-row">
        <span class="icon">
          <svelte:component this="{$climvar.icon}" dimension="50" />
        </span>
        <div>
          {#if $indicator.id === "observations"}
            <h3 class="block-title">
              Frequency of Observed Daily {$climvar.title}s for {$doyText} from 1991-2020
            </h3>
            <p class="block-note">
              Note: Using data for 30 days around selected date from 30 year
              period
            </p>
            <h4 class="block-title">
              {$station.properties.name}, {$station.properties.city} CA
            </h4>
          {:else if $indicator.id === "forecast"}
            <h3 class="block-title">
              Near Term Forecast for {$climvar.title}
            </h3>
            <p class="block-note">
              Note: Forecast data from the National Weather Service is for next
              7 days
            </p>
            <h4 class="block-title">
              {$station.properties.name}, {$station.properties.city} CA
            </h4>
          {:else}
            <h3 class="block-title">
              Return Level Estimates of {$climvar.title} for {$doyText} from Baseline,
              Mid-Century and End-Century periods
            </h3>
            <p class="block-note">
              Note: Using data for 30 days around selected date from each 30
              year period
            </p>
            <h4 class="block-title">
              {$station.properties.name}, {$station.properties.city} CA
            </h4>
            <h4 class="block-title">{$scenario.labelLong}</h4>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="explore-stats">
    <!-- TODO: remove inline styles -->
    <div
      class="block"
      style="width:100%;height:auto;display:flex;justify-content:space-around;margin:0 0 1rem;"
    >
      {#if statsData}
        {#each statsData as opt}
          <ValuesList
            title="{opt.title}"
            stats="{opt.stats}"
            units="{$climvar.units.imperial}"
            on:change="{changeThreshold}"
          />
        {/each}
      {/if}
    </div>
    <div class="block" style="width:100%;height:auto;margin:0;">
      {#if historicalReturnPeriod && !thresholdInvalid}
        <p>
          A daily {$climvar.title} of
          <strong>{$thresholdStore}{$climvar.units.imperial}</strong>
          around <strong>{$doyText}</strong> is estimated to be a
          <strong>1 in {historicalReturnPeriod.values[0].rp} year event</strong>
          using observed data for <strong>Baseline Period (1991-2020)</strong>.
        </p>
      {:else}
        <SkeletonText />
      {/if}
      {#if $indicator.id === "projections"}
        {#if !thresholdInvalid}
          <p>From climate projections, it is estimated to change to a:</p>
          <Grid>
            <Row
              style="font-size:0.8rem;color:#51585e;text-transform:uppercase;margin-bottom:0.5rem;"
            >
              <Column>Model</Column>
              <Column>Mid-Century (2035-2064)</Column>
              <Column>End-Century (2070-2099)</Column>
            </Row>
            {#each projectedReturnPeriods as series}
              <Row style="margin-bottom:0.25rem;">
                <Column>
                  <span
                    style="background:{series.color};width:10px;height:10px;display:inline-block;"
                  ></span>
                  {series.label}
                </Column>
                {#each series.values as opt}
                  <Column>
                    <strong>1 in {opt.rp} year event</strong>
                  </Column>
                {/each}
              </Row>
            {/each}
          </Grid>
        {:else}
          <SkeletonText paragraph />
        {/if}
      {/if}
      <ShowDefinition on:define topics="{['return-period']}" />
    </div>
  </div>

  <!-- Chart-->
  <div class="explore-chart block">
    {#if $indicator.id === "observations"}
      <Histogram
        data="{histogramChartData}"
        labels="{statsData.find((d) => d.title.includes('Baseline'))}"
        yAxis="{{
          label: `Count of Days`,
          tickFormat: (d) => d,
        }}"
        xAxis="{{
          label: `${$climvar.title} (${$climvar.units.imperial})`,
          tickFormat: (d) => d,
        }}"
      />
    {:else if $indicator.id === "projections"}
      <ReturnLevelCurveChart
        data="{projectionsChartData}"
        legend="{series}"
        yAxis="{{
          key: 'value',
          label: `Return Level (${$climvar.units.imperial})`,
          tickFormat: valueFormat,
          units: `${$climvar.units.imperial}`,
        }}"
        xAxis="{{
          key: 'period',
          label: `Return Period (years)`,
          tickFormat: (d) => d,
          units: 'year',
        }}"
      />
    {:else}
      <Forecast
        data="{forecastChartData}"
        yAxis="{{
          key: 'value',
          label: `Forecasted ${$climvar.title} (${
            $climvar.units.imperial
          }) as of ${timeFormat('%Y-%m-%d')(new Date())}`,
          tickFormat: valueFormat,
          units: `${$climvar.units.imperial}`,
        }}"
        xAxis="{{
          key: 'date',
          label: '',
          tickFormat: (d) => timeFormat('%b %e, %Y')(d),
        }}"
      />
    {/if}
    <div class="chart-notes">
      <p>
        Source: Cal-Adapt. Data: HadISD, LOCA Downscaled Climate Projections
        (Scripps Institution Of Oceanography - University of California, San
        Diego), National Weather Serivce.
      </p>
    </div>
    <div class="chart-download">
      <ShowDefinition
        topics="{[$indicator.id]}"
        title="{$indicator.label}"
        on:define
      />
      <div>
        <Button
          disabled
          size="small"
          icon="{Download16}"
          on:click="{() => (showDownload = true)}"
        >
          DOWNLOAD
        </Button>
        <Button
          disabled
          size="small"
          icon="{Share16}"
          on:click="{() => (showShare = true)}"
        >
          SHARE
        </Button>
      </div>
    </div>
  </div>
  <!-- end explore-chart -->

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
          topics="{[
            'annual-average-tasmax',
            'annual-average-tasmin',
            'annual-average-pr',
          ]}"
          title="Climate Variables"
        />
      </AccordionItem>
      <AccordionItem open title="Choose Day of Year">
        <SelectDayOfYear value="{$doyStore}" on:change="{changeDayOfYear}" />
        <ShowDefinition
          on:define
          topics="{['climate-scenarios']}"
          title="Day of Year"
        />
      </AccordionItem>
      <AccordionItem open title="Enter Threshold">
        <NumberInput
          invalid="{thresholdInvalid}"
          invalidText="{thresholdInvalidText}"
          value="{$thresholdStore}"
          on:change="{changeThreshold}"
        />
        <ShowDefinition on:define topics="{['threshold']}" title="Threshold" />
      </AccordionItem>
      <!--  Show scenario only is on projection tab -->
      {#if $indicator.id === "projections"}
        <AccordionItem open title="Choose Scenario">
          <SelectScenario
            selectedId="{$scenarioStore}"
            items="{scenarioList}"
            on:change="{changeScenario}"
          />
          <ShowDefinition
            on:define
            topics="{['climate-scenarios']}"
            title="RCP Scenarios"
          />
        </AccordionItem>
      {/if}
      <AccordionItem title="Select Models">
        <SelectModels
          selectedIds="{$modelsStore}"
          items="{modelList}"
          on:change="{changeModels}"
        />
        <ShowDefinition
          on:define
          topics="{['gcms']}"
          title="Global Climate Models (GCMs)"
        />
      </AccordionItem>
    </Accordion>
  </div>
  <!-- end explore-settings -->
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

<DownloadChart bind:open="{showDownload}" on:download="{downloadViz}" />

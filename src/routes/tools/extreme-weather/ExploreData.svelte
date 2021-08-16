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
  } from "carbon-components-svelte";
  import { format } from "d3-format";
  import { timeFormat } from "d3-time-format";
  import { csvFormat, csvFormatRows } from "d3-dsv";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";
  import copy from "clipboard-copy";

  // Helpers
  import {
    climvarList,
  } from "./_helpers";
  import {
    getBaselineStats,
    getThreshold,
    getReturnPeriod,
    formatDataForExport,
  } from "./_data";
  import { exportPNG, exportCSV } from "../../../helpers/export";
  import { debounce } from "../../../helpers/utilities";

  // Components
  import ChangeLocation from "./ChangeLocation.svelte";
  import {
    SelectClimvar,
    SelectDayOfYear,
    ShowDefinition,
  } from "../../../components/tools/Settings";
  import { StaticMap } from "../../../components/tools/Location";
  import { Histogram } from "../../../components/tools/Charts";
  import DownloadChart from "../../../components/tools/DownloadChart.svelte";
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

  let baselineData;
  let baselineLabels;
  let thresholdOpts = {};
  let thresholdInvalid;
  let thresholdReturnPeriod;

  $: metadata = [
    ["station", $location.title],
    ["variable", $climvar.label],
    ["units", $climvar.units.imperial],
  ];

  $: formatFn = format(`.${$climvar.decimals}f`);

  $: if ($baseline) {
    baselineData = $baseline.values;
    baselineLabels = getBaselineStats($baseline, $extremesStore);
    thresholdOpts = getThreshold(baselineLabels, $extremesStore);
    thresholdStore.set(thresholdOpts.bound);
    isLoading = false;    
  } else {
    isLoading = true;
  }

  $: if ($extremesStore === "high") {
    thresholdInvalid = $thresholdStore < thresholdOpts.bound;
  }
  else {
    thresholdInvalid = $thresholdStore > thresholdOpts.bound;
  }

  async function downloadViz(e) {
    isLoading = true;
    const format = e.detail;
    showDownload = false;
    try {
      const container = document.querySelector(".explore");
      switch (format) {
        case "png":
          await exportPNG(container, ["explore-settings"]);
          break;
        case "csv":
          var csvData = formatDataForExport($baseline.values);
          var csvWithMetadata = `${csvFormatRows(metadata)} \n \n ${csvFormat(
            csvData
          )}`;
          await exportCSV(csvWithMetadata);
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
    console.log("doy change", e.detail);
  }

  const changeThreshold = debounce((e) => {
    if (!e || !e.detail) return;
    console.log("threshold change");
    thresholdStore.set(e.detail);
    thresholdReturnPeriod = getReturnPeriod($returnLevels, $thresholdStore);
    console.log('return period', thresholdReturnPeriod);
  }, 500);

  function changeLocation(e) {
    showChangeLocation = false;
    locationStore.updateLocation(e.detail.location);
    console.log("location change");
  }

</script>

<div class="explore">
  {#if isLoading}
    <div class="explore-loading-overlay"></div>
  {/if}

  <!-- Controls -->
  <div class="explore-controls">
  </div>

  <!-- Title -->
  <div class="explore-header block">
    <StaticMap location={$location} width={500} height={500} />
    <div class="explore-header-title">
      <h3><span class="block-title">{$location.title}</span></h3>
      <h4>
        Distribution of <span class="block-title">{$climvar.title}</span> on <span class="block-title">{$doyText} ({$doyRange})</span> from 1991-2020.
      </h4>
      <div>
        <Button
          size="small"
          icon="{Location16}"
          on:click="{() => (showChangeLocation = true)}">
          Change Location
        </Button> 
      </div>   
    </div>
  </div>

  <!-- Stats -->
  <div class="explore-stats">
  </div>

  <!-- Chart-->
  <div class="explore-chart block">
      <div class="chart-controls">
        <Checkbox style="align-items:flex-end;" labelText={`Show 7-Day Forecast for ${$forecastDate}`} checked={showForecast} />
      </div>
      <Histogram
        data="{baselineData}"
        labels="{baselineLabels}"
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
      <ShowDefinition
        topics="{['histogram-chart']}"
        title="Chart"
        on:define
      />
      <div>
        <Button size="small" icon="{Download16}" on:click="{() => (showDownload = true)}">
          Download
        </Button>
        <Button size="small" icon="{Share16}" on:click="{() => (showShare = true)}">
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
          topics="{[
            'annual-average-tasmax',
            'annual-average-tasmin',
          ]}"
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
          topics="{[
            'annual-average-tasmax',
            'annual-average-tasmin',
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
          invalidText="{thresholdOpts.text}"
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

<ChangeLocation bind:open="{showChangeLocation}" on:change="{changeLocation}" />

<DownloadChart bind:open="{showDownload}" on:download="{downloadViz}" />


 
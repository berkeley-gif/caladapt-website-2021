<script>
  import { fade } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { Button, InlineLoading, Checkbox } from "carbon-components-svelte";
  import { Download16, Share16 } from "carbon-icons-svelte";
  import { extent } from "d3-array";

  import { Histogram, Observations } from "~/components/tools/Charts";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { notifier } from "~/components/notifications";
  import { CHART_DESCRIPTION } from "./_constants";
  import {
    locationStore,
    forecastDate,
    thresholdStore,
    thresholdProps,
    histogramPercentiles,
    climvarForecast,
    climvarRecentObs,
    forecastStore,
    recentObsStore,
    recentObsDateRange,
  } from "./_store";
  import { isFetchingStore } from "../_common/stores";
  import { getForecastData, getRecentObsData } from "./_data";

  export let histogramXAxis;
  export let histogramYAxis;
  export let histogramData;
  export let dataSource;

  const dispatch = createEventDispatcher();
  const { isForecastLoaded } = forecastStore;
  const { isRecentObsLoaded } = recentObsStore;
  const { location } = locationStore;

  let xDomain;

  let showRecentObs;
  let recentObsChartHeight;

  let showForecast;
  let forecastChartHeight;

  // Uncheck forecast & recent obs checkboxes and clear stores
  // when location changes.
  $: $location, resetObservations();

  // When checked is true:
  // Fetch NWS/NCEI data for all 3 climvars for a location if it's not already in
  // the respective stores. If the data is already loaded, there's no need to fetch
  // it again. The derived stores climvarForecast or climvarRecentObs
  // will update & provide data corresponding to current climvar.
  // When checked is false:
  // Remove data source name from list
  $: if (showForecast) {
    if (!$isForecastLoaded) {
      getForecast();
    }
  } else {
    dataSource = dataSource.filter((d) => !d.includes("NWS"));
  }
  $: if (showRecentObs) {
    if (!$isRecentObsLoaded) {
      getRecentObs();
    }
  } else {
    dataSource = dataSource.filter((d) => !d.includes("NCEI"));
  }

  // Calculate xDomain for histogram data
  $: if (Array.isArray(histogramData) && histogramData.length) {
    xDomain = updateDataExtent(histogramData);
  }

  // Do not show threshold annotation in histogram for invalid value
  $: histogramThreshold = thresholdProps.invalid ? null : $thresholdStore;

  // Calculate chart height, update xDomain and data sources.
  // xDomain in updated to capture any extreme forecasts or recent observations
  // in the graphic
  $: if (Array.isArray($climvarForecast) && $climvarForecast.length) {
    forecastChartHeight = $climvarForecast.length * 25;
    xDomain = updateDataExtent([
      ...xDomain,
      ...$climvarForecast.map(({ value }) => value),
    ]);
    if (!dataSource.find((d) => d.includes("NWS"))) {
      dataSource = [...dataSource, "Near-Term Forecast (NWS)"];
    }
  }
  $: if (Array.isArray($climvarRecentObs) && $climvarRecentObs.length) {
    recentObsChartHeight = $climvarRecentObs.length * 25;
    xDomain = updateDataExtent([
      ...xDomain,
      ...$climvarRecentObs.map(({ value }) => value),
    ]);
    if (!dataSource.find((d) => d.includes("NCEI"))) {
      dataSource = [...dataSource, "GHCN-Daily (NCEI)"];
    }
  }

  function resetObservations() {
    showForecast = false;
    showRecentObs = false;
    forecastStore.set(null);
    recentObsStore.set(null);
  }

  // To prevent the first & last bar of histogram from brushing up
  // against the axis labels, add/subtract 2 from domain
  function updateDataExtent(arr) {
    const dataExtent = extent(arr);
    return [dataExtent[0] - 2, dataExtent[1] + 2];
  }

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function showDownload() {
    dispatch("showDownload");
  }

  function showShare() {
    dispatch("showShare");
  }

  // These functions fetch NWS/NCEI data for all 3 climvars at the same time for a location
  // and add it to respective stores
  async function getForecast() {
    isFetchingStore.set(true);
    try {
      const data = await getForecastData({
        lng: $location.geometry.coordinates[0],
        lat: $location.geometry.coordinates[1],
      });
      forecastStore.set(data);
    } catch (error) {
      showForecast = false;
      forecastStore.set(null);
      notifier.error(
        "Error",
        "Unable to get forecast from NWS at this time. Try again in a few minutes.",
        2000
      );
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function getRecentObs() {
    isFetchingStore.set(true);
    try {
      const data = await getRecentObsData({
        stationId: `USW000${$location.properties.wban}`,
        startDate: $recentObsDateRange.start,
        endDate: $recentObsDateRange.end,
      });
      recentObsStore.set(data);
    } catch (error) {
      showRecentObs = false;
      recentObsStore.set(null);
      notifier.error(
        "Error",
        "Unable to get recent observations from NCEI at this time. Try again in a few minutes.",
        2000
      );
    } finally {
      isFetchingStore.set(false);
    }
  }
</script>

<div class="chart-controls">
  {#if showRecentObs && !$isRecentObsLoaded}
    <InlineLoading description="Loading recent observations from NCEI..." />
  {:else}
    <div class="measured-toggle">
      <Checkbox
        labelText="Show Recent Observations"
        bind:checked="{showRecentObs}"
      />
    </div>
  {/if}
  {#if showForecast && !$isForecastLoaded}
    <InlineLoading description="Loading forecast from NWS..." />
  {:else}
    <div class="forecast-toggle">
      <Checkbox
        labelText="{`Show 7 Day Forecast for ${$forecastDate}`}"
        bind:checked="{showForecast}"
      />
    </div>
  {/if}
</div>

<div class="h4">
  <span class="annotate">Baseline Period (1991-2020)</span>
</div>
<div>
  <Histogram
    data="{histogramData}"
    labels="{$histogramPercentiles}"
    threshold="{histogramThreshold}"
    xDomain="{xDomain}"
    xAxis="{histogramXAxis}"
    yAxis="{histogramYAxis}"
  />
</div>

{#if showRecentObs && $climvarRecentObs}
  <div class="h4">
    <span class="annotate">Recent Observations</span>
  </div>
  <div transition:fade>
    <Observations
      data="{$climvarRecentObs}"
      height="{recentObsChartHeight}"
      y1="{100}"
      xDomain="{xDomain}"
    />
  </div>
{/if}

{#if showForecast && $climvarForecast}
  <div class="h4">
    <span class="annotate">Forecast for {$forecastDate}</span>
  </div>
  <div transition:fade>
    <Observations
      data="{$climvarForecast}"
      height="{forecastChartHeight}"
      y1="{showRecentObs ? 416 : 100}"
      xDomain="{xDomain}"
      tooltipFn="{(d) => d.detailedForecast}"
    />
  </div>
{/if}

<div class="chart-notes margin--v-32">
  <p>
    Source: Cal-Adapt. Data: {dataSource.join(", ")}.
  </p>
</div>
<div class="chart-download margin--v-16">
  <LearnMoreButton
    cta="{'Explain Chart'}"
    on:click="{() =>
      showLearnMore({
        content: CHART_DESCRIPTION,
        header: 'About this Chart',
      })}"
  />
  <div>
    <Button size="small" icon="{Download16}" on:click="{showDownload}">
      Download Chart
    </Button>
    <Button size="small" icon="{Share16}" on:click="{showShare}">Share</Button>
  </div>
</div>

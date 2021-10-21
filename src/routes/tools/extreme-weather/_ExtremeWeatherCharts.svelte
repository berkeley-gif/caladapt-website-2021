<script>
  import { createEventDispatcher } from "svelte";
  import { Button, InlineLoading, Checkbox } from "carbon-components-svelte";
  import { Download16, Share16 } from "carbon-icons-svelte";

  import { Histogram } from "~/components/tools/Charts";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { isFetchingStore } from "../_common/stores";
  import { CHART_DESCRIPTION } from "./_constants";
  import {
    forecastDate,
    thresholdStore,
    thresholdProps,
    histogramPercentiles,
  } from "./_store";
  //import { getForecastData } from "./_data";

  export let histogramXAxis;
  export let histogramYAxis;
  export let histogramData = [];
  export let histogramXDomain;
  export let dataSource;
  export let forecastData;

  const dispatch = createEventDispatcher();

  let showForecast = false;

  $: histogramThreshold = thresholdProps.invalid ? null : $thresholdStore;

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function showDownload() {
    dispatch("showDownload");
  }

  function showShare() {
    dispatch("showShare");
  }

  function toggleForecastDisplay() {
    showForecast = !showForecast;
    if (showForecast) {
      dataSource = [...dataSource, "Near-Term Forecast (NWS)"];
      if (Array.isArray(forecastData) && forecastData.length) {
        console.log("show forecast in chart");
      } else {
        console.log("fetch forecast from api");
        isFetchingStore.set(true);
        dispatch("getForecast", $forecastDate);
      }
    } else {
      dataSource = dataSource.filter((d) => !d.includes("NWS"));
    }
  }
</script>

<div class="chart-controls">
  {#if showForecast && !forecastData.length}
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

<div class="h4">
  <span class="annotate">Baseline Period (1991-2020)</span>
</div>
<Histogram
  data="{histogramData}"
  labels="{$histogramPercentiles}"
  threshold="{histogramThreshold}"
  xDomain="{histogramXDomain}"
  xAxis="{histogramXAxis}"
  yAxis="{histogramYAxis}"
/>

{#if showForecast}
  <div class="h4">
    <span class="annotate">Forecast</span>
  </div>
{/if}

<div class="chart-notes margin--v-8">
  <p>
    Source: Cal-Adapt. Data: {dataSource}.
  </p>
</div>
<div class="chart-download margin--v-8">
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

<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import { Download16, Share16 } from "carbon-icons-svelte";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { HEATMAP_COLOR_SCALE } from "./_constants";

  export let chartComponent;
  export let data;
  export let dataByDate;
  export let formatFn;
  export let units;
  export let label;
  export let dataSource;
  export let isFetching;
  export let chartDescription;
  export let height;

  const dispatch = createEventDispatcher();

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function showDownload() {
    dispatch("showDownload");
  }

  function showShare() {
    dispatch("showShare");
  }
</script>

<svelte:component
  this="{chartComponent}"
  height="{`${height}px`}"
  data="{data}"
  dataByDate="{dataByDate}"
  yAxis="{{
    key: 'value',
    label: `${label}`,
    domainMin: 0,
    niceMax: 10,
    tickFormat: formatFn,
    units: `${units}`,
  }}"
  colors="{HEATMAP_COLOR_SCALE}"
  isFetching="{isFetching}"
/>

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
        content: chartDescription,
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

<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import { Download16, Share16, Location16 } from "carbon-icons-svelte";
  import { LineAreaChart } from "~/components/tools/Charts";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { EXPLAIN_CHART } from "./_constants";

  export let data;
  export let dataByDate;
  export let formatFn;
  export let units;
  export let dataSource;
  export let simulation;
  export let month;
  export let climvarId;

  const dispatch = createEventDispatcher();

  $: label = `${simulation === "year" ? "Annual" : month} ${
    climvarId === "fire" ? "acres burned" : "wildfire probability"
  }`;

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

<LineAreaChart
  data="{data}"
  dataByDate="{dataByDate}"
  yAxis="{{
    key: 'value',
    label,
    tickFormat: formatFn,
    units,
  }}"
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
        content: EXPLAIN_CHART,
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

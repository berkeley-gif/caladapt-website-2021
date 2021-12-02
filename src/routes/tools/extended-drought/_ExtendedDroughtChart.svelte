<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import { Download16, Share16 } from "carbon-icons-svelte";
  import { LineAreaChart } from "~/components/tools/Charts";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { EXPLAIN_CHART } from "./_constants";

  export let data;
  export let dataByDate;
  export let formatFn;
  export let units;
  export let label;
  export let dataSource;
  export let annotations;
  export let isFetching;

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

<LineAreaChart
  annotations="{annotations}"
  data="{data}"
  dataByDate="{dataByDate}"
  yAxis="{{
    key: 'value',
    label,
    tickFormat: formatFn,
    units,
  }}"
  isFetching="{isFetching}"
/>

<div class="chart-notes margin--v-32">
  <p>
    Source: Cal-Adapt. Data: {dataSource}.
  </p>
</div>
<div class="chart-download margin--v-16">
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

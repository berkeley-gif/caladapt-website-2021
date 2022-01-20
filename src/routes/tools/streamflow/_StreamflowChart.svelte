<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import { timeFormat } from "d3-time-format";
  import { Download16, Share16 } from "carbon-icons-svelte";
  import { LineAreaChart } from "~/components/tools/Charts";
  import { LearnMoreButton } from "~/components/tools/Partials";

  export let data;
  export let dataByDate;
  export let formatFn;
  export let units;
  export let label;
  export let dataSource;
  export let isFetching;
  export let description;

  const dispatch = createEventDispatcher();

  const formatMonth = timeFormat("%b");

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
    domainMin: 0,
    niceMax: 10,
    tickFormat: formatFn,
    units,
  }}"
  xAxis="{{
    key: 'date',
    label: '',
    domainMin: new Date(1999, 9, 1),
    domainMax: new Date(2000, 8, 1),
    tickFormat: formatMonth,
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
        content: description,
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

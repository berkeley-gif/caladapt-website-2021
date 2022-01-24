<script>
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import { timeFormat } from "d3-time-format";
  import { Download16, Share16 } from "carbon-icons-svelte";
  import { LineAreaChart } from "~/components/tools/Charts";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { DEFAULT_WATERYEAR } from "./_constants";

  export let data;
  export let dataByDate;
  export let formatFn;
  export let units;
  export let label;
  export let dataSource;
  export let isFetching;
  export let description;

  const dispatch = createEventDispatcher();
  const DEFAULT_WATERYEAR_STARTDATE = new Date(DEFAULT_WATERYEAR - 1, 9, 1);
  const DEFAULT_WATERYEAR_ENDDATE = new Date(DEFAULT_WATERYEAR, 8, 1);

  let xAxis;

  $: if (label.includes("Monthly")) {
    xAxis = {
      key: "date",
      label: "",
      domainMin: DEFAULT_WATERYEAR_STARTDATE,
      domainMax: DEFAULT_WATERYEAR_ENDDATE,
      tickFormat: timeFormat("%b"),
    };
  } else {
    xAxis = {
      key: "date",
      label: "",
      tickFormat: timeFormat("%Y"),
    };
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
  xAxis="{xAxis}"
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

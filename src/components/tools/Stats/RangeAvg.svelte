<script>
  import { extent, mean, merge } from "d3-array";
  import { Button } from "carbon-components-svelte";
  import { Information16, Calendar16 } from "carbon-icons-svelte";
  import StatOptions from "./StatOptions.svelte";
  import StatAbout from "./StatAbout.svelte";

  export let units;
  export let data;
  export let groupList;
  export let periodList;
  export let groupId;
  export let periodId;
  export let models;
  export let format = (d) => d;

  let group = groupId
    ? groupList.find(({ id }) => id === groupId)
    : groupList[0];
  let period = periodId
    ? periodList.find(({ id }) => id === periodId)
    : periodList[0];
  let metrics = [];
  let updateMetrics = false;
  let showOptions = false;
  let showAbout = false;

  let AboutModal;
  let OptionsModal;

  async function loadAbout() {
    showAbout = true;
    AboutModal = (await import("./StatAbout.svelte")).default;
  }

  async function loadOptions() {
    showOptions = true;
    OptionsModal = (await import("./StatOptions.svelte")).default;
  }

  function subsetByYears({ start, end }) {
    return function (d) {
      return (
        d.date >= new Date(Date.UTC(start, 0, 1)) &&
        d.date <= new Date(Date.UTC(end, 11, 31))
      );
    };
  }

  function calculateAverage(values) {
    if (Array.isArray(values) && values.length) {
      return format(mean(values, (d) => d.value));
    }
    return "-";
  }

  function calculateRange(values) {
    if (Array.isArray(values) && values.length) {
      const minmax = extent(values, (d) => d.value);
      return `${format(minmax[0])}–${format(minmax[1])}`;
    }
    return "-";
  }

  function calculateMetrics() {
    updateMetrics = false;
    console.log("calculate metrics");
    const filterByPeriod = data.filter(subsetByYears(period));
    const years = period.end - period.start + 1;
    const values = merge(filterByPeriod.map(({ values }) => values));
    let filterBySeries;
    if (group.id.includes("model")) {
      filterBySeries = values.filter(({ id }) => models.includes(id));
      return [
        {
          id: "average",
          label: `${years} YEAR AVG`,
          value: calculateAverage(filterBySeries),
        },
        {
          id: "range",
          label: `${years} YEAR RANGE`,
          value: calculateRange(filterBySeries),
        },
      ];
    }
    filterBySeries = values.filter(
      ({ id }) => !models.includes(id) && !id.includes("range")
    );
    return [
      {
        id: "average",
        label: `${years} YEAR AVG`,
        value: calculateAverage(filterBySeries),
      },
    ];
  }

  function updateOptions({ detail }) {
    showOptions = false;
    const { groupId, periodId, start, end } = detail;
    console.log("update options", groupId, periodId, start, end);
    group = groupList.find(({ id }) => id === groupId);
    if (periodId === "custom") {
      period = {
        id: "custom",
        label: `${start}-${end}`,
        start,
        end,
      };
    } else {
      period = periodList.find(({ id }) => id === periodId);
    }
    updateMetrics = true;
  }

  $: dataExtent = data ? extent(data, (d) => d.date.getUTCFullYear()) : [];
  $: updateMetrics = data ? true : false;
  $: if (updateMetrics) {
    metrics = calculateMetrics();
  }
</script>

<style lang="scss">
  .stat {
    position: relative;
  }

  .stat-data {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .stat-data-item {
    margin: 0.75rem 0;
  }

  .stat-title {
    display: block;
    line-height: 1.29;
    font-weight: 600;
    font-size: 1rem;
  }

  .stat-text {
    font-size: 0.75rem;
    color: var(--gray-70);
    text-transform: uppercase;
  }

  .stat-value {
    font-size: 1.5rem;
    line-height: 1;
  }

  .stat-units {
    font-size: 0.75rem;
    color: var(--gray-70);
  }

  :global(.stat .bx--btn) {
    padding-left: 0;
  }
</style>

<div class="stat">
  <!-- title -->
  <div class="stat-header">
    <span class="stat-text">{group.label}</span>
    <span class="stat-title">{period.label}</span>
  </div>

  <!-- change period -->
  <Button
    icon="{Calendar16}"
    kind="ghost"
    size="small"
    on:click="{loadOptions}"
  >
    Change
  </Button>

  <!-- metrics -->
  <div class="stat-data">
    {#each metrics as item (item.id)}
      <div class="stat-data-item">
        <div class="stat-text">{item.label}</div>
        <div class="stat-value">
          {item.value}
          <sup><span class="stat-units">{units}</span></sup>
        </div>
      </div>
    {/each}
  </div>

  <!-- learn more -->
  <Button
    icon="{Information16}"
    kind="ghost"
    size="small"
    on:click="{loadAbout}"
  >
    Learn More
  </Button>
</div>

<svelte:component
  this="{OptionsModal}"
  bind:open="{showOptions}"
  group="{group}"
  period="{period}"
  groupList="{groupList}"
  periodList="{periodList}"
  dataExtent="{dataExtent}"
  on:change="{updateOptions}"
  on:cancel="{() => (showOptions = false)}"
/>

<svelte:component
  this="{AboutModal}"
  bind:open="{showAbout}"
  group="{group}"
  period="{period}"
  models="{models}"
/>

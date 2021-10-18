<script>
  import { tick } from "svelte";
  import { extent, mean, merge } from "d3-array";
  import { Button, SkeletonText, Modal } from "carbon-components-svelte";
  import { Information16, Calendar16 } from "carbon-icons-svelte";
  import ChangeGroupPeriod from "./ChangeGroupPeriod.svelte";

  export let units;
  export let data;
  export let groupList;
  export let periodList;
  export let format = (d) => d;

  let group = groupList[0];
  let period = periodList[0];
  let showChangeGroupPeriod = false;
  let showInfo = false;

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
      return mean(values, (d) => d.value);
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

  async function calculateMetrics() {
    await tick();
    console.log("calculate metrics");
    const filterByPeriod = data.filter(subsetByYears(period));
    console.log("filterByPeriod", filterByPeriod);
    const values = merge(filterByPeriod.map(({ values }) => values));
    let filterBySeries;
    if (group.id === "livneh") {
      filterBySeries = values.filter(({ id }) => id === "livneh");
      console.log("1 filterBySeries", filterBySeries);
      return [
        {
          id: "average",
          label: `${years} YEAR AVG`,
          value: calculateAverage(filterBySeries),
        },
      ];
    }
    filterBySeries = values.filter(({ id }) => id !== "livneh");
    console.log("2 filterBySeries", filterBySeries);
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

  function update({ detail }) {
    showChangeGroupPeriod = false;
    const { groupId, periodId } = detail;
    console.log("update group period", groupId, periodId);
    group = groupList.find(({ id }) => id === groupId);
    period = periodList.find(({ id }) => id === periodId);
    console.log("update", group, period);
  }

  $: dataExtent = data ? extent(data, (d) => d.date.getUTCFullYear()) : [];
  $: metrics = data ? calculateMetrics() : [];
  $: console.log("metrics", metrics);
  $: years = period.end - period.start + 1;
  $: note = `The average is calculated using values between ${period.start}
    and ${period.end} from the ${group.label} data.`;
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

  .stat-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-note {
    font-size: 0.875rem;
    color: #0f62fe;
    display: flex;
    align-items: center;
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
    on:click="{() => (showChangeGroupPeriod = true)}"
  >
    Change Period
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
    on:click="{() => (showInfo = true)}"
  >
    Learn More
  </Button>
</div>

<ChangeGroupPeriod
  open="{showChangeGroupPeriod}"
  groupList="{groupList}"
  periodList="{periodList}"
  dataExtent="{dataExtent}"
  on:change="{update}"
  on:cancel="{() => (showChangeGroupPeriod = false)}"
/>

<Modal
  id="stats-about"
  size="sm"
  passiveModal
  bind:open="{showInfo}"
  modalHeading="Summary Statistics"
  on:open
  on:close="{() => (showInfo = false)}"
>
  <div>
    {note}
  </div>
</Modal>

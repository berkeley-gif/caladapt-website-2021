<script>
  import { SkeletonText } from "carbon-components-svelte";
  import { extent, mean, merge } from "d3-array";
  import StatBlock from "./StatBlock.svelte";

  // Array of data values grouped by date
  // Each date has an array of values containing 1 or more timeseries
  export let data;

  // List of groups of series
  // e.g. modeled historical, modeled projections, observed historical
  export let groupList;

  // List of groups of periods
  // e.g. baseline, mid-century, end-century
  export let periodList;

  // Optional, id of default group to initialize StatPanel
  // defaults to first item in groupList
  export let groupId;

  // Optional, id of default period to initialize StatPanel
  // defaults to first item in periodList
  export let periodId;

  // List of selected models
  export let models;

  export let format = (d) => d;
  export let units;

  let metrics = [];

  function subsetByYears(start, end) {
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
    // Empty state
    return "-";
  }

  function calculateRange(values) {
    if (Array.isArray(values) && values.length) {
      const minmax = extent(values, (d) => d.value);
      return `${format(minmax[0])}–${format(minmax[1])}`;
    }
    // Empty state
    return "-";
  }

  function calculateMetrics({ group, period }) {
    const { start, end } = period;
    const periodLength = end - start + 1;
    // Filter data for selected period
    // e.g. baseline, mid-century, end-century or a custom period
    const dataByPeriod = data.filter(subsetByYears(start, end));
    const values = merge(dataByPeriod.map(({ values }) => values));
    // Filter data for selected period by selected group
    // e.g. modeled historical, modeled projections, observed historical
    let dataByGroup;
    // For modeled historical/projections, check if the value id is a model
    if (group.id.includes("model")) {
      dataByGroup = values.filter(({ id }) => models.includes(id));
      return [
        {
          id: "average",
          label: `${periodLength} YEAR AVG`,
          value: calculateAverage(dataByGroup),
        },
        {
          id: "range",
          label: `${periodLength} YEAR RANGE`,
          value: calculateRange(dataByGroup),
        },
      ];
    } else {
      // For observed  historical, check if value id is not a model name
      // and value id is not for the envelope. For now this value id = "livneh"
      dataByGroup = values.filter(
        ({ id }) => !models.includes(id) && !id.includes("range")
      );
    }
    return [
      {
        id: "average",
        label: `${periodLength} YEAR AVG`,
        value: calculateAverage(dataByGroup),
      },
    ];
  }

  function update({ detail }) {
    const { group, period } = detail;
    // Recalculate metrics any time group or period selection changes
    metrics = calculateMetrics({ group, period });
  }
</script>

<!-- Show stat panel for array with values and empty array -->
{#if Array.isArray(data)}
  <StatBlock
    on:update="{update}"
    units="{units}"
    data="{data}"
    groupList="{groupList}"
    periodList="{periodList}"
    groupId="{groupId}"
    periodId="{periodId}"
    models="{models}"
    metrics="{metrics}"
  />
{:else}
  <div>
    <SkeletonText heading />
    <SkeletonText paragraph lines="{4}" />
  </div>
{/if}

<script>
  import { SkeletonText } from "carbon-components-svelte";
  import { extent, mean, merge } from "d3-array";
  import StatBlock from "./StatBlock.svelte";

  /** Array of data values grouped by date, e.g.
  {
    date:  Date Sat Dec 31 1949 16:00:00 GMT-0800 (Pacific Standard Time),
    values: [
      { id: "livneh", label: "Observed", value: 74.6},
      { id: "CanESM2", label: "CanESM2 (Average)", value: 75.2},
      { id: "CNRM-CM5", label: "CNRM-CM5 (Cool/Wet)", value: 73.3}
    ]
  }
  */
  export let data;

  /** List of 1 or more groups
   * e.g. modeled historical, modeled projections, observed historical */
  export let groupList;

  /** List of 1 or more periods
  e.g. baseline, mid-century, end-century */
  export let periodList;

  /** Id of default group to initialize StatPanel. This prop is optional. Defaults to first item in groupList */
  export let groupId;

  /** Id of default period to initialize StatPanel. This prop is optional. Defaults to first item in periodList */
  export let periodId;

  /** List of selected models */
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
    return "–";
  }

  function calculateRange(values) {
    if (Array.isArray(values) && values.length) {
      const minmax = extent(values, (d) => d.value);
      return `${format(minmax[0])}–${format(minmax[1])}`;
    }
    // Empty state
    return "–";
  }

  function calculateMetrics({ group, period }) {
    const { start, end } = period;
    const periodLength = end - start + 1;
    // Filter data for selected period
    // e.g. baseline, mid-century, end-century or a custom period
    const dataByPeriod = data.filter(subsetByYears(start, end));
    const values = merge(dataByPeriod.map(({ values }) => values));
    // Filter values for selected group
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
      // and value id is not for the envelope. For now this would be
      // the same as checking for id = "livneh"
      dataByGroup = values.filter(
        ({ id }) => !models.includes(id) && !id.includes("range")
      );
      // Range is not displayed for observed data
      return [
        {
          id: "average",
          label: `${periodLength} YEAR AVG`,
          value: calculateAverage(dataByGroup),
        },
      ];
    }
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

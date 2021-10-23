<script>
  import { extent, mean, merge } from "d3-array";
  import StatPanel from "./StatPanel.svelte";

  export let units;
  export let data;
  export let groupList;
  export let periodList;
  export let groupId;
  export let periodId;
  export let models;
  export let format = (d) => d;

  console.log("periodList", periodList);

  let metrics = [];

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

  function calculateMetrics({ group, period }) {
    console.log("California", group, period);
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

  function update({ detail }) {
    const { group, period } = detail;
    metrics = calculateMetrics({ group, period });
  }
</script>

<StatPanel
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

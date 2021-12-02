<script>
  import { SkeletonText } from "carbon-components-svelte";
  import { extent } from "d3-array";
  import {
    MONTHS_LIST,
    DEFAULT_STAT_GROUPS,
    DEFAULT_STAT_PERIODS,
  } from "~/routes/tools/_common/constants";
  import { isEmptyData } from "~/helpers/utilities";
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
  export let groupList = DEFAULT_STAT_GROUPS;

  /** List of 1 or more periods
  e.g. baseline, mid-century, end-century */
  export let periodList = DEFAULT_STAT_PERIODS;

  /** Id of default group to initialize StatPanel. This prop is optional. Defaults to first item in groupList */
  export let groupId = groupList[0].id;

  /** Id of default period to initialize StatPanel. This prop is optional. Defaults to first item in periodList */
  export let periodId = periodList[0].id;

  /** List of selected models */
  export let models;

  export let units;
  export let isFetching = false;

  let selectedGroup = groupList.find((d) => d.id === groupId);
  let selectedPeriod = periodList.find((d) => d.id === periodId);

  $: statsData = isEmptyData(data) ? [] : data;
  $: dateRange = extent(statsData, (d) => d.date.getUTCFullYear());
  $: metrics = calculateMetrics(statsData);

  function subsetByYears(start, end) {
    return function (d) {
      return (
        d.date >= new Date(Date.UTC(start, 0, 1)) &&
        d.date <= new Date(Date.UTC(end, 11, 31))
      );
    };
  }

  function getMonths(data) {
    if (Array.isArray(data) && data.length) {
      const months = new Set(data.map(({ date }) => date.getUTCMonth()));
      const sortedMonths = [...months].sort((a, b) => a - b);
      return {
        earliest: MONTHS_LIST.find(({ id }) => id === sortedMonths[0]).text,
        latest: MONTHS_LIST.find(
          ({ id }) => id === sortedMonths[sortedMonths.length - 1]
        ).text,
      };
    }
    // Empty state
    return {
      earliest: "–",
      latest: "–",
    };
  }

  function calculateMetrics(_data) {
    const { start, end } = selectedPeriod;
    const periodLength = end - start + 1;
    // Filter data for selected period
    // e.g. baseline, mid-century, end-century or a custom period
    const dataByPeriod = _data.filter(subsetByYears(start, end));
    // Filter values for selected group
    // e.g. modeled historical, modeled projections, observed historical
    const dataByGroup = dataByPeriod.map(({ date, values }) => {
      let valuesByGroup;
      if (selectedGroup.id.includes("model")) {
        valuesByGroup = values.filter(({ id }) => models.includes(id));
      } else {
        // For observed  historical, check if value id is not a model name
        // and value id is not for the envelope. For now this would be
        // the same as checking for id = "livneh"
        valuesByGroup = values.filter(
          ({ id }) => !models.includes(id) && !id.includes("range")
        );
      }
      return { date, values: valuesByGroup };
    });
    const { earliest, latest } = getMonths(dataByGroup);
    return [
      {
        id: "earliest",
        label: `Earliest in ${periodLength} YEARS`,
        value: earliest,
      },
      {
        id: "latest",
        label: `Latest in ${periodLength} YEARS`,
        value: latest,
      },
    ];
  }

  function update({ detail }) {
    const { group, period } = detail;
    selectedGroup = group;
    selectedPeriod = period;
    // Recalculate metrics any time group or period selection changes
    metrics = calculateMetrics(statsData);
  }
</script>

{#if isFetching}
  <div>
    <SkeletonText heading />
    <SkeletonText paragraph lines="{4}" />
  </div>
{:else}
  <StatBlock
    on:update="{update}"
    units="{units}"
    data="{data}"
    groupList="{groupList}"
    periodList="{periodList}"
    group="{selectedGroup}"
    period="{selectedPeriod}"
    models="{models}"
    metrics="{metrics}"
    dateRange="{dateRange}"
  />
{/if}

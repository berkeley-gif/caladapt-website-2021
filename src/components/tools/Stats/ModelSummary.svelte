<script>
  import { SkeletonText } from "carbon-components-svelte";
  import {
    DEFAULT_STAT_GROUPS,
    DEFAULT_STAT_PERIODS,
  } from "~/routes/tools/_common/constants";
  import StatBlock from "./StatBlock.svelte";

  /** Array of data values, e.g.
  {
    values: [
      { id: "livneh", label: "Observed", value: 74.6, date:  Date Sat Dec 31 1949 16:00:00 GMT-0800 (Pacific Standard Time)},
      { id: "CanESM2", label: "CanESM2 (Average)", value: 75.2, date:  Date Sat Dec 31 1949 16:00:00 GMT-0800 (Pacific Standard Time)},
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
  export let format = (d) => d;
  export let isFetching = false;

  let selectedGroup = groupList.find((d) => d.id === groupId);

  $: selectedPeriod = periodList.find((d) => d.id === periodId);
  $: statsData = data && data.length ? data : [];
  $: metrics = calculateMetrics(statsData);

  function calculateMetrics(_data) {
    return _data.map((series) => {
      const { id, label, value } = series;
      return {
        id,
        label,
        value: value ? format(value) : "-",
      };
    });
  }
</script>

{#if isFetching}
  <div>
    <SkeletonText heading />
    <SkeletonText paragraph lines="{4}" />
  </div>
{:else}
  <StatBlock
    units="{units}"
    groupList="{groupList}"
    periodList="{periodList}"
    group="{selectedGroup}"
    period="{selectedPeriod}"
    models="{models}"
    metrics="{metrics}"
    dateRange="{null}"
    changePeriod="{false}"
  />
{/if}

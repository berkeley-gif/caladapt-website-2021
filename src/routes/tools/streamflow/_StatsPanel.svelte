<script>
  import {
    DEFAULT_STAT_GROUPS,
    DEFAULT_STAT_PERIODS,
  } from "../_common/constants";
  import { DEFAULT_MONTHLY_STAT_GROUPS } from "./_constants";

  export let statsComponent;
  export let units;
  export let formatFn;
  export let models;
  export let statsData;
  export let isFetching;
  export let indicatorId;
  export let periodId;
</script>

<style lang="scss">
  .wide {
    grid-column-end: span 2;
  }
</style>

{#if indicatorId === "annual"}
  <ul class="stats">
    <li class="block">
      <svelte:component
        this="{statsComponent}"
        units="{units}"
        data="{statsData
          ? statsData.filter((d) => d.date.getUTCFullYear() < 2006)
          : null}"
        groupList="{DEFAULT_STAT_GROUPS.filter((d) => d.historical)}"
        periodList="{DEFAULT_STAT_PERIODS.filter((d) => d.historical)}"
        format="{formatFn}"
        models="{models}"
        isFetching="{isFetching}"
      />
    </li>
    <li class="block">
      <svelte:component
        this="{statsComponent}"
        units="{units}"
        data="{statsData
          ? statsData.filter((d) => d.date.getUTCFullYear() >= 2006)
          : null}"
        groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
        periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
        format="{formatFn}"
        models="{models}"
        isFetching="{isFetching}"
      />
    </li>
    <li class="block">
      <svelte:component
        this="{statsComponent}"
        units="{units}"
        data="{statsData
          ? statsData.filter((d) => d.date.getUTCFullYear() >= 2006)
          : null}"
        groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
        periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
        periodId="end-century"
        format="{formatFn}"
        models="{models}"
        isFetching="{isFetching}"
      />
    </li>
  </ul>
{:else}
  <ul class="stats">
    <li class="block">
      <svelte:component
        this="{statsComponent}"
        units="{units}"
        data="{statsData
          ? statsData.filter(({ label }) => label === 'Observed')
          : null}"
        groupList="{DEFAULT_MONTHLY_STAT_GROUPS.filter(
          ({ id }) => id === 'observed'
        )}"
        periodList="{DEFAULT_STAT_PERIODS}"
        periodId="{periodId}"
        format="{formatFn}"
        models="{models}"
        isFetching="{isFetching}"
      />
    </li>
    <li class="block wide">
      <svelte:component
        this="{statsComponent}"
        units="{units}"
        data="{statsData
          ? statsData.filter(({ label }) => label !== 'Observed')
          : null}"
        groupList="{DEFAULT_MONTHLY_STAT_GROUPS.filter(
          ({ id }) => id === 'modeled-projections'
        )}"
        periodList="{DEFAULT_STAT_PERIODS}"
        periodId="{periodId}"
        format="{formatFn}"
        models="{models}"
        isFetching="{isFetching}"
      />
    </li>
  </ul>
{/if}

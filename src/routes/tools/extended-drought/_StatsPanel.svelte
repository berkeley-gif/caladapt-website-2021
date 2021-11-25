<script>
  import {
    DEFAULT_STAT_GROUPS,
    OBSERVED_FILTER_YEAR,
  } from "../_common/constants";
  import { DEFAULT_STAT_PERIODS } from "./_constants";
  import { AvgRange } from "~/components/tools/Stats";

  export let units;
  export let data;
  export let formatFn;
  export let models;
  export let scenario;
</script>

<ul class="stats">
  <li class="block">
    <AvgRange
      units="{units}"
      data="{data
        ? data.filter((d) => d.date.getUTCFullYear() < OBSERVED_FILTER_YEAR)
        : null}"
      groupList="{DEFAULT_STAT_GROUPS.filter(({ id }) => id === 'observed')}"
      periodList="{DEFAULT_STAT_PERIODS.filter((d) => d.historical)}"
      format="{formatFn}"
      models="{models}"
    />
  </li>
  <li class="block">
    <AvgRange
      units="{units}"
      data="{data
        ? data.filter((d) => d.date.getUTCFullYear() >= OBSERVED_FILTER_YEAR)
        : null}"
      groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
      periodList="{DEFAULT_STAT_PERIODS.filter(({ id }) => id === scenario)}"
      format="{formatFn}"
      models="{models}"
    />
  </li>
</ul>

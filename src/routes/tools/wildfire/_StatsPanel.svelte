<script>
  import {
    DEFAULT_STAT_GROUPS,
    DEFAULT_STAT_PERIODS,
  } from "../_common/constants";
  import { AvgRange } from "~/components/tools/Stats";

  export let units;
  export let dataByDate;
  export let formatFn;
  export let models;
</script>

<ul class="stats">
  <li class="block">
    <AvgRange
      units="{units}"
      data="{dataByDate
        ? dataByDate.filter((d) => d.date.getUTCFullYear() < 2006)
        : null}"
      groupList="{DEFAULT_STAT_GROUPS.filter((d) => d.historical)}"
      periodList="{DEFAULT_STAT_PERIODS.filter((d) => d.historical)}"
      isHistorical="{true}"
      format="{formatFn}"
      models="{models}"
    />
  </li>
  <li class="block">
    <AvgRange
      units="{units}"
      data="{dataByDate
        ? dataByDate.filter((d) => d.date.getUTCFullYear() >= 2006)
        : null}"
      isHistorical="{true}"
      groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
      periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
      periodId="mid-century"
      format="{formatFn}"
      models="{models}"
    />
  </li>
  <li class="block">
    <AvgRange
      units="{units}"
      data="{dataByDate
        ? dataByDate.filter((d) => d.date.getUTCFullYear() >= 2006)
        : null}"
      isHistorical="{true}"
      groupList="{DEFAULT_STAT_GROUPS.filter((d) => !d.historical)}"
      periodList="{DEFAULT_STAT_PERIODS.filter((d) => !d.historical)}"
      periodId="end-century"
      format="{formatFn}"
      models="{models}"
    />
  </li>
</ul>

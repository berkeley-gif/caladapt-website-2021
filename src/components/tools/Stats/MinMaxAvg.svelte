<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { extent, mean, merge } from "d3-array";
  import { Button, SkeletonText, Tooltip } from "carbon-components-svelte";
  import SettingsAdjust16 from "carbon-icons-svelte/lib/SettingsAdjust16";
  import Settings from ".../../../static/img/icons/gear.svg";
  import ChangeTimePeriod from "./ChangeTimePeriod.svelte";

  export let title = "Observed Data";
  export let subtitle = "Baseline (1961-1990)";
  export let units = "inches";
  export let note = "";
  export let data;
  export let historicalOnly = false;
  export let start = 1961;
  export let end = 1990;
  export let format = (d) => d;

  const dispatch = createEventDispatcher();
  let ready = false;
  let showSettings = false;
  let stats = null;

  function subsetByYearRange(range) {
    return function (d) {
      return (
        d.date >= new Date(range[0], 0, 1) &&
        d.date <= new Date(range[1], 11, 31)
      );
    };
  }

  function updateStats(e) {
    const { period, range } = e.detail;
    subtitle = `${period} (${range[0]}-${range[1]})`;
    showSettings = false;
    stats = calculateStats(data, range);
  }

  function calculateStats(_data, range) {
    if (_data.length === 0) {
      return [
        { label: "MIN", value: "-" },
        { label: "AVG", value: "-" },
        { label: "MAX", value: "-" },
      ];
    }
    const values = merge(_data.map((series) => series.values));
    const filteredData = values.filter(subsetByYearRange(range));
    const minmax = extent(filteredData, (d) => d.value);
    const avg = mean(filteredData, (d) => d.value);
    return [
      { label: "MIN", value: format(minmax[0]) },
      { label: "AVG", value: format(avg) },
      { label: "MAX", value: format(minmax[1]) },
    ];
  }

  $: if (data) {
    stats = calculateStats(data, [start, end]);
  } else {
    stats = null;
  }

  onMount(() => {
    ready = true;
    dispatch("ready");
  });
</script>

<style lang="scss">
  .stat-data {
    display: flex;
    justify-content: space-around;
    margin: 0.75rem 0;
  }

  .stat-title {
    font-size: 1rem;
    font-weight: bold;
  }

  .stat-subtitle {
    font-size: 0.9rem;
    display: flex;
    align-items: center;
  }

  .stat-data-label {
    font-size: 0.8rem;
    color: #51585e; // $gray-70
  }

  .stat-data-value {
    font-size: 1.5rem;
    line-height: 1.5;
  }

  .stat-data-units {
    font-size: 0.8rem;
  }

  .stat-note {
    margin-top: 1rem;
    font-style: italic;
    font-size: 0.75rem;
    color: #04797c; // $teal-60
    display: flex;
    align-items: center;
  }

  #stat-tooltip {
    font-style: normal;
  }

  :global(.settings.bx--btn--sm) {
    padding: calc(0.375rem - 3px);
  }

  :global(.settings #icon) {
    height: 1rem;
    width: 1rem;
  }
</style>

{#if ready && stats}
  <div class="stat">
    <!-- title -->
    <div class="stat-header">
      <div class="stat-title">{title}</div>
      <div class="stat-subtitle">
        {subtitle}
        <span>
          <Button
            class="settings"
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Change Time Period"
            size="small"
            kind="ghost"
            on:click="{() => (showSettings = true)}"
          >
            {@html Settings}
          </Button>
        </span>
      </div>
    </div>
    <!-- values -->
    <div class="stat-data">
      {#each stats as item}
        <div>
          <div class="stat-data-label">{item.label}</div>
          <div class="stat-data-value">{item.value}</div>
          <div class="stat-data-units">{units}</div>
        </div>
      {/each}
    </div>
    <!-- note -->
    {#if note}
      <div class="stat-note">
        {note}.
        <Tooltip tooltipBodyId="stat-tooltip">
          <div id="stat-tooltip">
            <p>
              The minimum, average and maximum values are calculated using data
              values from all selected models for the selected time period.
            </p>
            <p>
              List of selected models can be changed in the Settings Panel under
              Models. Select preset or custom time periods in the Stats Panel.
            </p>
          </div>
        </Tooltip>
      </div>
    {/if}
  </div>
{:else}
  <div class="stat">
    <SkeletonText heading />
    <SkeletonText paragraph lines="{4}" />
  </div>
{/if}

<ChangeTimePeriod
  open="{showSettings}"
  historicalOnly="{historicalOnly}"
  on:change="{updateStats}"
/>

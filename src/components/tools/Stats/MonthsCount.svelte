<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { extent, mean, merge, groups, rollup } from 'd3-array';
  import { timeFormat, timeParse } from 'd3-time-format';
  import {
    Tooltip,
    Button,
    SkeletonText,
  } from 'carbon-components-svelte';
  import SettingsAdjust16 from 'carbon-icons-svelte/lib/SettingsAdjust16';
  import Settings from '.../../../static/img/icons/gear.svg';
  import ChangeTimePeriod from './ChangeTimePeriod.svelte';

  export let title = 'Observed Data';
  export let subtitle = 'Baseline (1961-1990)';
  export let note = '';
  export let data;
  export let historicalOnly = false;
  export let start = 1961;
  export let end = 1990;

  const dispatch = createEventDispatcher();
  //const dateFormat = timeFormat('%b %d');
  const dateFormat = timeFormat('%B');
  let ready = false;
  let showSettings = false;
  let stats = null;

  function subsetByYearRange(range) {
    return function(d) {
      return (d.date >= new Date(range[0], 0, 1) && d.date <= new Date(range[1], 11, 31));
    }
  }

  function calculateGroupAvg(v) {
    // Map all dates to same year. Does not matter which year. 
    const group = v.map(d => new Date(2010, d.getMonth(), d.getDate()));
    return new Date(mean(group));
  }

  function getWeekOfMonth(d) {
    const weekNumYear = +timeFormat('%U')(d);
    const weekNumMonthStart = +timeFormat('%U')(new Date(d.getFullYear(), d.getMonth(), 1))
    return weekNumYear - weekNumMonthStart + 1
  }

  function updateStats(e) {
    const {period, range} = e.detail;
    subtitle = `${period} (${range[0]}-${range[1]})`;
    showSettings = false;
    stats = calculateStats(data, range);
  }

  function calculateStats(_data, range) {
    if (_data.length === 0) {
      return [
        { label: 'Earliest', value: '_' },
        { label: 'Latest', value: '_' },
      ];
    }

    const values = merge(_data.map(series => series.values));
    const filteredData = values
      .filter(subsetByYearRange(range))
      .map(d => d.date);

    const groupByMonth = rollup(
      filteredData,
      v => calculateGroupAvg(v),
      d => parseInt(d.getMonth()),
    );
    console.log(title, groupByMonth);
    const months = Array.from(groupByMonth.keys()).sort();
    const earliest = groupByMonth.get(months[0]);
    const latest = groupByMonth.get(months[months.length - 1]);

    return [
      { label: 'Earliest', value: dateFormat(earliest) },
      { label: 'Latest', value: dateFormat(latest) },
    ];
  }

  $: if (data) {
    stats = calculateStats(data, [start, end]);
  } else {
    stats = null;
  }

  onMount(() => {
    ready = true;
    dispatch('ready');
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
    color: #51585e; //$gray-70
  }

  .stat-data-value {
    font-size: 1.5rem;
    line-height: 1.5;
  }

  .stat-note {
    margin-top: 1rem;
    font-style: italic;
    font-size: 0.75rem;
    color: #04797c; // $teal-60
    display: flex;
    align-items: center;
    line-height: 1;
  }

  #stat-tooltip {
    font-style: italic;
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
            on:click={() => showSettings=true}>
            { @html Settings }
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
        </div>
      {/each}
    </div>
    <!-- note -->
    {#if note}
    <div class="stat-note">
      <span>{note}.</span>
      <Tooltip tooltipBodyId="stat-tooltip">
        <div id="stat-tooltip">
          <p>To calculate the earliest/latest months we group extreme heat days/warm nights from all selected models by month.</p>
          <p>List of selected models can be changed in the Settings Panel under Models. Select preset or custom time periods in the Stats Panel.</p>
        </div>
      </Tooltip>
    </div>
    {/if}
  </div>
{:else}
  <div class="stat">
    <SkeletonText heading />
    <SkeletonText paragraph lines={4} />
  </div>
{/if}

<ChangeTimePeriod open={showSettings} {historicalOnly} on:change={updateStats} />

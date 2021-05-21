<script>
  import { createEventDispatcher } from 'svelte';
  import { extent, mean, merge } from 'd3-array';
  import {
    Button,
    SkeletonText,
    Modal,
  } from 'carbon-components-svelte';
  import { SettingsAdjust16, Information16 } from 'carbon-icons-svelte';
  import ChangeTimePeriod from './ChangeTimePeriod2.svelte';

  export let units = 'inches';
  export let data;
  export let series = 'historical';
  export let period = 'baseline';
  export let format = (d) => d;

  const periodList = [
    {
      id: 'baseline',
      label: 'Baseline (1961-1990)',
      start: 1961,
      end: 1990,
      historical: true,
    },
    {
      id: 'mid-century',
      label: 'Mid-Century (2035-2064)',
      start: 2035,
      end: 2064,
      historical: false,
    },
    {
      id: 'end-century',
      label: 'End-Century (2070-2099)',
      start: 2070,
      end: 2099,
      historical: false,
    },
  ];

  const seriesList = [
    {
      id: 'observed',
      label: 'Observed Historical',
      historical: true,
    },
    {
      id: 'historical',
      label: 'Modeled Historical',
      historical: true,
    },
    {
      id: 'future',
      label: 'Future Projections',
      historical: false,
    }
  ];

  const dispatch = createEventDispatcher();
  let isHistorical = series === 'historical' || series === 'observed';

  let selectedSeries = seriesList.find(d => d.id === series);
  let selectedPeriod = periodList.find(d => d.id === period);

  let showSettings = false;
  let showInfo = false;
  let stats = null;
  let showRange = true;
  let modelCount;
  let note = 'Learn More';

  function subsetByYearRange(range) {
    return function(d) {
      return (d.date >= new Date(range[0], 0, 1) && d.date <= new Date(range[1], 11, 31));
    }
  }

  function updateStats(e) {
    const { seriesId, periodId, range } = e.detail;
    selectedSeries = seriesList.find(d => d.id === seriesId);
    if (periodId === 'custom') {
      selectedPeriod = {
        id: 'custom',
        label: `${range[0]}-${range[1]}`,
        start: range[0],
        end: range[1],
      }
    } else {
      selectedPeriod = periodList.find(d => d.id === periodId);
    }
    showSettings = false;
    let dataForSeries;
    if (seriesId === 'observed') {
      dataForSeries = data.filter(d => d.key === 'observed');
      modelCount = 0;
      showRange = false;
    } else {
      dataForSeries = data.filter(d => d.key !== 'observed');
      modelCount = dataForSeries.length;
      showRange = true;
    }
    console.log('dataForSeries', showRange, dataForSeries);
    stats = calculateStats(dataForSeries, range);
  }

  function calculateStats(_data, range) {
    const yearCount = range[1] - range[0] + 1;
    const content = [];
    if (!_data || _data.length === 0) {
      content.push({ label: `${yearCount} YEAR AVG`, value: '–' });
      if (showRange) {
        content.push({ label: `${yearCount} YEAR RANGE`, value: '–' });
      }
      return content;
    }
    const values = merge(_data.map(series => series.values));
    const filteredValues = values.filter(subsetByYearRange(range));
    const avg = mean(filteredValues, d => d.value);
    content.push({ label: `${yearCount} YEAR AVG`, value: format(avg) });
    if (showRange) {
      const minmax = extent(filteredValues, d => d.value);
      content.push({
        label: `${yearCount} YEAR RANGE`,
        value: `${format(minmax[0])}–${format(minmax[1])}`
      });
    }
    return content;
  }

  $: if (data) {
    stats = calculateStats(data, [selectedPeriod.start, selectedPeriod.end]);
  } else {
    stats = null;
  }
</script>

<style lang="scss">
  .stat-data {
    display: flex;
    justify-content: space-around;
    margin: 0.75rem 0;
  }

  .stat {
    position: relative;
  }

  .stat-header {
    margin-bottom: 1rem;

    span {
      display: block;
      line-height: 1.29;
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 2px;
    }
  }

  .stat-data-label {
    font-size: 0.75rem;
    color: #51585e;
  }

  .stat-data-value {
    font-size: 1.5rem;
    line-height: 1.5;
  }

  .stat-data-units {
    font-size: 0.8rem;
  }

  .stat-controls {
    display:flex;
    justify-content:space-between;
    align-items:center;
  }

  .stat-note {
    font-size: 0.875rem;
    color: #0f62fe;
    display: flex;
    align-items: center;
  }
</style>

{#if stats}
  <div class="stat">
    <!-- title -->
    <div class="stat-header">
      <span>{selectedSeries.label}</span>
      <span>{selectedPeriod.label}</span>      
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
    <!-- controls -->
    <div class="stat-controls">
      <div class="stat-note">
        <Button
          icon={Information16}
          kind="ghost"
          size="sm"
          style="padding-left:0;"
          on:click={() => showInfo = true}>
          {note}
        </Button>
      </div>
      <Button
        icon={SettingsAdjust16}
        size="small"
        on:click={() => showSettings = true}>
        Change
      </Button> 
    </div> 
  </div>
{:else}
  <div class="stat">
    <SkeletonText heading />
    <SkeletonText paragraph lines={4} />
  </div>
{/if}

<ChangeTimePeriod
  open={showSettings}
  {isHistorical}
  seriesList={seriesList.filter(d => d.historical === isHistorical)}
  periodList={periodList.filter(d => d.historical === isHistorical)}
  seriesId={selectedSeries.id}
  periodId={selectedPeriod.id}
  on:change={updateStats}
  on:cancel={() => showSettings = false} />

<Modal id="definition" size="sm" passiveModal bind:open={showInfo} modalHeading="Summary Statistics" on:open on:close={() => showInfo = false}>
  <div>
    {#if (selectedSeries.id === 'observed')}
      <p>
        The average is calculated using data values between {selectedPeriod.start} and {selectedPeriod.end} from the Observed Historical timeseries.
      </p>
    {:else}
      <p>
        The range and average are calculated using data values between {selectedPeriod.start} and {selectedPeriod.end} from the {modelCount} models shown in the chart below.
      </p>
    {/if}
  </div>
</Modal>

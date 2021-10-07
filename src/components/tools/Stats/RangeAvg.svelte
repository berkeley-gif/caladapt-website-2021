<script>
  import { extent, mean, merge } from "d3-array";
  import { Button, SkeletonText, Modal } from "carbon-components-svelte";
  import { Information16, Calendar16 } from "carbon-icons-svelte";
  import ChangeTimePeriod from "./ChangeTimePeriod.svelte";

  export let units = "inches";
  export let data;
  export let series = "historical";
  export let period = "baseline";
  export let format = (d) => d;

  const periodList = [
    {
      id: "baseline",
      label: "Baseline (1961-1990)",
      start: 1961,
      end: 1990,
      historical: true,
    },
    {
      id: "mid-century",
      label: "Mid-Century (2035-2064)",
      start: 2035,
      end: 2064,
      historical: false,
    },
    {
      id: "end-century",
      label: "End-Century (2070-2099)",
      start: 2070,
      end: 2099,
      historical: false,
    },
  ];

  const seriesList = [
    {
      id: "observed",
      label: "Observed Historical",
      historical: true,
    },
    {
      id: "historical",
      label: "Modeled Historical",
      historical: true,
    },
    {
      id: "future",
      label: "Future Projections",
      historical: false,
    },
  ];

  let isHistorical = series === "historical" || series === "observed";

  let selectedSeries = seriesList.find((d) => d.id === series);
  let selectedPeriod = periodList.find((d) => d.id === period);

  let showSettings = false;
  let showInfo = false;
  let stats = null;
  let showRange = true;
  let note = "Learn More";
  let modelCount = 0;

  $: if (data && !isHistorical) {
    modelCount = data.filter((d) => d.key !== "observed").length;
  }

  function subsetByYearRange(range) {
    return function (d) {
      return (
        d.date >= new Date(range[0], 0, 1) &&
        d.date <= new Date(range[1], 11, 31)
      );
    };
  }

  function updateStats(e) {
    const { seriesId, periodId, range } = e.detail;
    selectedSeries = seriesList.find((d) => d.id === seriesId);
    if (periodId === "custom") {
      selectedPeriod = {
        id: "custom",
        label: `${range[0]}-${range[1]}`,
        start: range[0],
        end: range[1],
      };
    } else {
      selectedPeriod = periodList.find((d) => d.id === periodId);
    }
    showSettings = false;
    let filteredData;
    if (seriesId === "observed") {
      filteredData = data.filter((d) => d.key === "observed");
      showRange = false;
    } else {
      filteredData = data.filter((d) => d.key !== "observed");
      showRange = true;
    }
    stats = calculateStats(filteredData, range);
  }

  function calculateStats(_data, range) {
    const yearCount = range[1] - range[0] + 1;
    const content = [];
    if (!_data || _data.length === 0) {
      content.push({ label: `${yearCount} YEAR AVG`, value: "–" });
      if (showRange) {
        content.push({ label: `${yearCount} YEAR RANGE`, value: "–" });
      }
      return content;
    }
    const values = merge(_data.map((series) => series.values));
    const filteredValues = values.filter(subsetByYearRange(range));
    const avg = mean(filteredValues, (d) => d.value);
    content.push({ label: `${yearCount} YEAR AVG`, value: format(avg) });
    if (showRange) {
      const minmax = extent(filteredValues, (d) => d.value);
      content.push({
        label: `${yearCount} YEAR RANGE`,
        value: `${format(minmax[0])}–${format(minmax[1])}`,
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
  .stat {
    position: relative;
  }

  .stat-data {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .stat-data-item {
    margin: 0.75rem 0;
  }

  .stat-title {
    display: block;
    line-height: 1.29;
    font-weight: 600;
    font-size: 1rem;
  }

  .stat-text {
    font-size: 0.75rem;
    color: var(--gray-70);
    text-transform: uppercase;
  }

  .stat-value {
    font-size: 1.5rem;
    line-height: 1;
  }

  .stat-units {
    font-size: 0.75rem;
    color: var(--gray-70);
  }

  .stat-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-note {
    font-size: 0.875rem;
    color: #0f62fe;
    display: flex;
    align-items: center;
  }

  :global(.stat .bx--btn) {
    padding-left: 0;
  }
</style>

{#if stats}
  <div class="stat">
    <!-- title -->
    <div class="stat-header">
      <span class="stat-text">{selectedSeries.label}</span>
      <span class="stat-title">{selectedPeriod.label}</span>
      <Button
        icon="{Calendar16}"
        kind="ghost"
        size="small"
        on:click="{() => (showSettings = true)}"
      >
        Change Period
      </Button>
    </div>
    <!-- values -->
    <div class="stat-data">
      {#each stats as item}
        <div class="stat-data-item">
          <div class="stat-text">{item.label}</div>
          <div class="stat-value">
            {item.value}
            <sup><span class="stat-units">{units}</span></sup>
          </div>
        </div>
      {/each}
    </div>
    <!-- controls -->
    <div class="stat-controls">
      <div class="stat-note">
        <Button
          icon="{Information16}"
          kind="ghost"
          size="small"
          on:click="{() => (showInfo = true)}"
        >
          {note}
        </Button>
      </div>
    </div>
  </div>
{:else}
  <div class="stat">
    <SkeletonText heading />
    <SkeletonText paragraph lines="{4}" />
  </div>
{/if}

<ChangeTimePeriod
  open="{showSettings}"
  isHistorical="{isHistorical}"
  seriesList="{seriesList.filter((d) => d.historical === isHistorical)}"
  periodList="{periodList.filter((d) => d.historical === isHistorical)}"
  seriesId="{selectedSeries.id}"
  periodId="{selectedPeriod.id}"
  on:change="{updateStats}"
  on:cancel="{() => (showSettings = false)}"
/>

<Modal
  id="definition"
  size="sm"
  passiveModal
  bind:open="{showInfo}"
  modalHeading="Summary Statistics"
  on:open
  on:close="{() => (showInfo = false)}"
>
  <div>
    {#if isHistorical}
      <p>
        The average is calculated using data values between {selectedPeriod.start}
        and {selectedPeriod.end} from the {selectedSeries.label} timeseries.
      </p>
    {:else}
      <p>
        The range and average are calculated using data values between {selectedPeriod.start}
        and {selectedPeriod.end} from the {modelCount} models shown in the chart
        below.
      </p>
    {/if}
  </div>
</Modal>

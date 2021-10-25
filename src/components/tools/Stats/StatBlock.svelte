<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { extent } from "d3-array";
  import { Button } from "carbon-components-svelte";
  import { Information16, Calendar16 } from "carbon-icons-svelte";

  export let metrics;
  export let data;
  export let groupList;
  export let periodList;
  export let groupId;
  export let periodId;
  export let models;
  export let units;

  const dispatch = createEventDispatcher();

  let dateRange; // extent of data, used for selecting custom period
  let group; // current group
  let period; // current period

  let showOptions = false;
  let showAbout = false;
  let AboutModal;
  let OptionsModal;

  // Set options to display current group & period
  $: if (Array.isArray(data)) {
    setOptions();
  }

  // Update options when user changes group/period
  function updateOptions({ detail }) {
    showOptions = false;
    group = detail.group;
    period = detail.period;
    dispatch("update", detail);
  }

  function setOptions() {
    if (data.length) {
      dateRange = extent(data, (d) => d.date.getUTCFullYear());
    } else {
      dateRange = [];
    }
    group = groupId ? groupList.find(({ id }) => id === groupId) : groupList[0];
    period = periodId
      ? periodList.find(({ id }) => id === periodId)
      : periodList[0];
  }

  async function loadAbout() {
    showAbout = true;
    AboutModal = (await import("./StatAbout.svelte")).default;
  }

  async function loadOptions() {
    showOptions = true;
    OptionsModal = (await import("./StatOptions.svelte")).default;
  }

  onMount(() => {
    dispatch("update", { group, period });
  });
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

  :global(.stat .bx--btn) {
    padding-left: 0;
  }
</style>

<div class="stat">
  <!-- title -->
  <div class="stat-header">
    <span class="stat-text">{group.label}</span>
    <span class="stat-title">{period.label}</span>
  </div>

  <!-- change period -->
  <Button
    icon="{Calendar16}"
    kind="ghost"
    size="small"
    on:click="{loadOptions}"
  >
    Change Period
  </Button>

  <!-- metrics -->
  <div class="stat-data">
    {#each metrics as item (item.id)}
      <div class="stat-data-item">
        <div class="stat-text">{item.label}</div>
        <div class="stat-value">
          {item.value}
          <sup><span class="stat-units">{units}</span></sup>
        </div>
      </div>
    {/each}
  </div>

  <!-- learn more -->
  <Button
    icon="{Information16}"
    kind="ghost"
    size="small"
    on:click="{loadAbout}"
  >
    Learn More
  </Button>
</div>

<!-- modal showing available stat options -->
<svelte:component
  this="{OptionsModal}"
  bind:open="{showOptions}"
  group="{group}"
  period="{period}"
  groupList="{groupList}"
  periodList="{periodList}"
  dateRange="{dateRange}"
  on:change="{updateOptions}"
  on:cancel="{() => (showOptions = false)}"
/>

<!-- modal showing information about stats -->
<svelte:component
  this="{AboutModal}"
  bind:open="{showAbout}"
  group="{group}"
  period="{period}"
  models="{models}"
/>

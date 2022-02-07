<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { Button } from "carbon-components-svelte";
  import { Information16, Calendar16 } from "carbon-icons-svelte";

  export let metrics;
  export let dateRange;
  export let groupList;
  export let periodList;
  export let group;
  export let period;
  export let models;
  export let units;
  export let changePeriod = true;

  const dispatch = createEventDispatcher();

  let showOptions = false;
  let showAbout = false;
  let AboutModal;
  let OptionsModal;

  // Update options when user changes group/period
  function updateOptions({ detail }) {
    showOptions = false;
    dispatch("update", detail);
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
  {#if changePeriod}
    <Button
      icon="{Calendar16}"
      kind="ghost"
      size="small"
      on:click="{loadOptions}"
    >
      Change Period
    </Button>
  {/if}

  <!-- metrics -->
  <div class="stat-data">
    {#each metrics as item (item.id)}
      <div class="stat-data-item">
        <div class="stat-text">{@html item.label}</div>
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

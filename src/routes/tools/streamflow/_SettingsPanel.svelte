<script>
  import { createEventDispatcher } from "svelte";

  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    MONTHS_LIST,
  } from "../_common/constants";
  import {
    LEARN_MORE_INDICATOR,
    LEARN_MORE_SELECT_MONTH,
    LEARN_MORE_SELECT_PERIOD,
    SELECT_STATION_DESCRIPTION,
    PERIOD_LIST,
  } from "./_constants";

  import {
    RadioBtnGroup,
    SelectScenario,
    SelectModels,
    SelectMonth,
    Select,
  } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";

  import { locationStore, scenarioStore, modelsStore } from "../_common/stores";
  import {
    indicatorList,
    indicatorStore,
    selectedMonthsStore,
    selectedPeriodStore,
  } from "./_store";

  const dispatch = createEventDispatcher();
  const { location } = locationStore;

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function showChangeLocation() {
    dispatch("showLoadLocation");
  }

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
  }

  function changeIndicator(e) {
    indicatorStore.set(e.detail);
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
  }

  function changeSelectedMonths(e) {
    selectedMonthsStore.set(e.detail);
  }

  function changeSelectedPeriod(e) {
    selectedPeriodStore.set(e.detail);
  }
</script>

<!-- Chart Settings -->
<div class="block">
  <span class="bx--label">Select Station</span>
  <StaticMap
    location="{$location}"
    height="{250}"
    on:click="{() => showChangeLocation()}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: SELECT_STATION_DESCRIPTION,
        header: 'Select Station',
      })}"
  />
</div>

<div class="block">
  <RadioBtnGroup
    title="Select Indicator"
    selected="{$indicatorStore}"
    items="{indicatorList}"
    on:change="{changeIndicator}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: LEARN_MORE_INDICATOR,
      })}"
  />
</div>

<div class="block">
  {#if $indicatorStore === "annual"}
    <SelectMonth
      multi="{true}"
      items="{MONTHS_LIST}"
      selectedId="{$selectedMonthsStore}"
      on:change="{changeSelectedMonths}"
    />
    <LearnMoreButton
      on:click="{() =>
        showLearnMore({
          content: LEARN_MORE_SELECT_MONTH,
        })}"
    />
  {:else}
    <Select
      title="Select Period"
      selectedId="{$selectedPeriodStore}"
      items="{PERIOD_LIST}"
      on:change="{changeSelectedPeriod}"
    />
    <LearnMoreButton
      on:click="{() =>
        showLearnMore({
          content: LEARN_MORE_SELECT_PERIOD,
        })}"
    />
  {/if}
</div>

<div class="block">
  <SelectScenario
    selectedId="{$scenarioStore}"
    items="{DEFAULT_SCENARIOS}"
    on:change="{changeScenario}"
  />
  <LearnMoreButton
    on:click="{() => showLearnMore({ slugs: ['emissions-scenario'] })}"
  />
</div>

<div class="block">
  <SelectModels
    selectedIds="{$modelsStore}"
    items="{PRIORITY_10_MODELS}"
    on:change="{changeModels}"
  />
  <LearnMoreButton
    on:click="{() => showLearnMore({ slugs: ['global-climate-model'] })}"
  />
</div>

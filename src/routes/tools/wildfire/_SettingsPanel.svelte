<script>
  import { createEventDispatcher } from "svelte";

  import {
    PRIORITY_4_MODELS,
    DEFAULT_SCENARIOS,
    SELECT_LOCATION_DESCRIPTION,
  } from "../_common/constants";
  import {
    LEARN_MORE_SELECT_MONTH,
    LEARN_MORE_YEARLY_PERIOD,
    TIME_PERIODS,
    MONTHS_LIST_ONE_INDEXED,
    CLIMATE_VARIABLES,
  } from "./_constants";

  import {
    SelectMonth,
    SelectScenario,
    SelectModels,
    Select,
    RadioBtnGroup,
  } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";

  import { scenarioStore, locationStore, modelsStore } from "../_common/stores";
  import {
    climvarStore,
    periodStore,
    monthStore,
    modelSingleStore,
  } from "./_store";

  // props
  export let activeTab = 0;

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

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
  }

  function changeModelSingle(e) {
    modelSingleStore.set(e.detail);
  }

  function changeSelectedMonth(e) {
    monthStore.set(e.detail.id);
  }

  function changeDuration(e) {
    periodStore.set(e.detail);
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail);
  }
</script>

{#if activeTab === 0}
  <!-- Map Settings -->
  <div class="block">
    <RadioBtnGroup
      items="{CLIMATE_VARIABLES}"
      selected="{$climvarStore}"
      title="{'Select Climate Variable'}"
      on:change="{changeClimvar}"
    />
    <LearnMoreButton on:click="{() => showLearnMore({ content: 'TODO' })}" />
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
    <RadioBtnGroup
      items="{TIME_PERIODS}"
      selected="{$periodStore}"
      title="{'Select Period'}"
      on:change="{changeDuration}"
    />
    <LearnMoreButton
      on:click="{() => showLearnMore({ content: LEARN_MORE_YEARLY_PERIOD })}"
    />
  </div>

  {#if $periodStore === "month"}
    <div class="block">
      <SelectMonth
        items="{MONTHS_LIST_ONE_INDEXED}"
        selectedId="{$monthStore}"
        on:change="{changeSelectedMonth}"
      />
      <LearnMoreButton
        on:click="{() => showLearnMore({ content: LEARN_MORE_SELECT_MONTH })}"
      />
    </div>
  {/if}

  <div class="block">
    <Select
      title="Select Model"
      items="{PRIORITY_4_MODELS}"
      selectedId="{$modelSingleStore}"
      on:change="{changeModelSingle}"
    />
    <LearnMoreButton
      on:click="{() => showLearnMore({ slugs: ['global-climate-model'] })}"
    />
  </div>
{:else}
  <!-- Chart Settings -->
  <div class="block">
    <span class="bx--label">Select Location</span>
    <StaticMap
      location="{$location}"
      width="{350}"
      height="{350}"
      on:click="{() => showChangeLocation()}"
    />
    <div class="center-row">
      <LearnMoreButton
        on:click="{() =>
          showLearnMore({
            content: SELECT_LOCATION_DESCRIPTION,
            header: 'Select Location',
          })}"
      />
    </div>
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
    <SelectMonth
      items="{MONTHS_LIST_ONE_INDEXED}"
      selectedId="{$monthStore}"
      on:change="{changeSelectedMonth}"
    />
    <LearnMoreButton
      on:click="{() => showLearnMore({ content: LEARN_MORE_SELECT_MONTH })}"
    />
  </div>

  <div class="block">
    <SelectModels
      selectedIds="{$modelsStore}"
      items="{PRIORITY_4_MODELS}"
      on:change="{changeModels}"
    />
    <LearnMoreButton
      on:click="{() =>
        showLearnMore({
          slugs: ['global-climate-model'],
        })}"
    />
  </div>
{/if}

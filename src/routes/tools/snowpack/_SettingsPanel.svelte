<script>
  import { createEventDispatcher } from "svelte";

  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    SELECT_LOCATION_DESCRIPTION,
    MONTHS_LIST,
  } from "../_common/constants";
  import { LEARN_MORE_SELECT_MONTH } from "./_constants";

  import {
    SelectMonth,
    SelectScenario,
    SelectModels,
  } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";

  import { scenarioStore, locationStore, modelsStore } from "../_common/stores";
  import { monthStore } from "./_store";

  // props
  export let activeTab = 0;

  const dispatchShowLearnMore = createEventDispatcher();
  const dispatchShowLoadLocation = createEventDispatcher();

  const { location } = locationStore;

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatchShowLearnMore("showLearnMore", { slugs, content, header });
  }

  function showChangeLocation() {
    dispatchShowLoadLocation("showLoadLocation");
  }

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
  }

  function changeSelectedMonth(e) {
    monthStore.set(e.detail.id);
  }
</script>

{#if activeTab === 0}
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
      items="{MONTHS_LIST}"
      selectedId="{$monthStore}"
      on:change="{changeSelectedMonth}"
    />
    <LearnMoreButton
      on:click="{() => showLearnMore({ content: LEARN_MORE_SELECT_MONTH })}"
    />
  </div>
{:else}
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
      items="{MONTHS_LIST}"
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
      items="{PRIORITY_10_MODELS}"
      on:change="{changeModels}"
    />
    <LearnMoreButton
      on:click="{() =>
        showLearnMore({
          slugs: ['cooling-degree-day', 'heating-degree-day'],
        })}"
    />
  </div>
{/if}

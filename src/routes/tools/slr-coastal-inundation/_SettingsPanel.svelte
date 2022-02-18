<script>
  import { createEventDispatcher } from "svelte";

  import {
    floodScenarioStore,
    timeFrameStore,
    dataLayersStore,
  } from "./_store";

  import { TIME_PERIODS, FLOOD_SCENARIOS } from "./_constants";

  import { LearnMoreButton } from "~/components/tools/Partials";
  import { RadioBtnGroup, SelectLayers } from "~/components/tools/Settings";

  export let learnMoreContent;

  const { floodScenario, mapLayers, timePeriod } = learnMoreContent;
  const dispatch = createEventDispatcher();

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function changeFloodScenario({ detail }) {
    floodScenarioStore.set(detail);
  }

  function changeTimeFrame({ detail }) {
    timeFrameStore.set(detail);
  }

  function changeDataLayers({ detail: { checked, id } }) {
    dataLayersStore.setChecked({ checked, id });
  }
</script>

<div class="block">
  <SelectLayers
    title="Select Map Data Layers"
    items="{[...$dataLayersStore]}"
    on:change="{changeDataLayers}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: mapLayers,
        header: 'Select Data Layers',
      })}"
  />
</div>

<div class="block">
  <RadioBtnGroup
    title="Select Time Period"
    items="{TIME_PERIODS}"
    selected="{$timeFrameStore}"
    on:change="{changeTimeFrame}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: timePeriod,
        header: 'Select Time Period',
      })}"
  />
</div>

<div class="block">
  <RadioBtnGroup
    title="Select Flood Scenario"
    items="{FLOOD_SCENARIOS}"
    selected="{$floodScenarioStore}"
    on:change="{changeFloodScenario}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: floodScenario,
        header: 'Select Flood Scenario',
      })}"
  />
</div>

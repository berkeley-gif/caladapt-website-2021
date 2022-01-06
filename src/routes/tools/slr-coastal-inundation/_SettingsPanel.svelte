<script>
  import { createEventDispatcher } from "svelte";

  import { locationStore } from "../_common/stores";
  import {
    floodScenarioStore,
    timeFrameStore,
    dataLayersStore,
    dataLayersAugmentedStore,
  } from "./_store";

  import { TIME_PERIODS, FLOOD_SCENARIOS } from "./_constants";

  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";
  import { RadioBtnGroup, SelectLayers } from "~/components/tools/Settings";

  const dispatch = createEventDispatcher();
  const { location } = locationStore;

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function showChangeLocation() {
    dispatch("showLoadLocation");
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
  <span class="bx--label">Select Location</span>
  <StaticMap
    location="{$location}"
    height="{250}"
    on:click="{() => showChangeLocation()}"
  />
  <div class="center-row">
    <LearnMoreButton
      on:click="{() =>
        showLearnMore({
          content: 'To do...',
          header: 'Select Location',
        })}"
    />
  </div>
</div>

<div class="block">
  <SelectLayers
    title="Select Map Data Layers"
    items="{[...$dataLayersAugmentedStore]}"
    on:change="{changeDataLayers}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: 'To do...',
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
        content: 'To do...',
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
        content: 'To do...',
        header: 'Select Flood Scenario',
      })}"
  />
</div>

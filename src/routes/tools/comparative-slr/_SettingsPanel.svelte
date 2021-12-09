<script>
  import { createEventDispatcher } from "svelte";

  import { locationStore } from "../_common/stores";
  import {
    floodScenarioStore,
    timeFrameStore,
    dataLayersStore,
  } from "./_store";

  import { TIME_PERIODS, FLOOD_SCENARIOS, DATA_LAYERS } from "./_constants";

  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";
  import { RadioBtnGroup, SelectLayers } from "~/components/tools/Settings";

  const dispatch = createEventDispatcher();
  const { location } = locationStore;

  const layerOptions = DATA_LAYERS.map((d) => ({
    ...d,
    disabled: false,
    checked: false,
  }));

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function showChangeLocation() {
    dispatch("showLoadLocation");
  }

  function changeScenario({ detail }) {
    floodScenarioStore.set(detail);
  }

  function changeTimeFrame({ detail }) {
    timeFrameStore.set(detail);
  }

  function changeDataLayers({ detail }) {
    dataLayersStore.set(detail);
  }
</script>

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
          content: 'To do...',
          header: 'Select Location',
        })}"
    />
  </div>
</div>

<div class="block">
  <RadioBtnGroup
    title="Select Time Period"
    items="{TIME_PERIODS}"
    selected="{$timeFrameStore}"
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
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: 'To do...',
        header: 'Select Flood Scenario',
      })}"
  />
</div>

<div class="block">
  <span class="bx--label">Select Data Layers</span>
  <SelectLayers items="{layerOptions}" />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: 'To do...',
        header: 'Select Data Layers',
      })}"
  />
</div>

<script>
  import { createEventDispatcher } from "svelte";

  import { locationStore } from "../_common/stores";
  import {
    floodScenarioStore,
    timeFrameStore,
    dataLayersStore,
  } from "./_store";

  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";

  const dispatch = createEventDispatcher();
  const { location } = locationStore;

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
  <span class="bx--label">Select Time Frame</span>
</div>

<div class="block">
  <span class="bx--label">Select Flood Scenario</span>
</div>

<div class="block">
  <span class="bx--label">Select Data Layers</span>
</div>

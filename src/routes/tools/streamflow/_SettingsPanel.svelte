<script>
  import { createEventDispatcher } from "svelte";
  import { NumberInput } from "carbon-components-svelte";

  import { PRIORITY_10_MODELS, DEFAULT_SCENARIOS } from "../_common/constants";
  import {
    INDICATOR_DESCRIPTION,
    SELECT_STATION_DESCRIPTION,
  } from "./_constants";

  import {
    SelectClimvar,
    SelectScenario,
    SelectModels,
  } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";

  import { locationStore, scenarioStore, modelsStore } from "../_common/stores";
  import { indicatorList, indicatorStore } from "./_store";

  const dispatch = createEventDispatcher();
  const { location } = locationStore;
  const { indicator } = indicatorStore;

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
    indicatorStore.set(e.detail.id);
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
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
  <SelectClimvar
    title="Select Indicator"
    selectedId="{$indicatorStore}"
    items="{indicatorList}"
    on:change="{changeIndicator}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: INDICATOR_DESCRIPTION,
      })}"
  />
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

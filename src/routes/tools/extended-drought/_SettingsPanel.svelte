<script>
  import { createEventDispatcher } from "svelte";

  import { SELECT_LOCATION_DESCRIPTION } from "../_common/constants";
  import { TIME_DURATIONS } from "./_constants";

  import {
    SelectClimvar,
    SelectScenario,
    RadioBtnGroup,
  } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";

  import { locationStore } from "../_common/stores";
  import {
    scenarioList,
    scenarioStore,
    climvarList,
    climvarStore,
    durationStore,
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

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
  }

  function changeDuration(e) {
    durationStore.set(e.detail);
  }
</script>

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
  <SelectClimvar
    selectedId="{$climvarStore}"
    items="{climvarList}"
    on:change="{changeClimvar}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        slugs: [
          'annual-average-tasmax',
          'annual-average-tasmin',
          'annual-average-pr',
        ],
      })}"
  />
</div>

<div class="block">
  <SelectScenario
    selectedId="{$scenarioStore}"
    items="{scenarioList}"
    on:change="{changeScenario}"
  />
  <LearnMoreButton
    on:click="{() => showLearnMore({ slugs: ['emissions-scenario'] })}"
  />
</div>

<div class="block">
  <RadioBtnGroup
    selected="{$durationStore}"
    items="{TIME_DURATIONS}"
    title="Select Duration"
    on:change="{changeDuration}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        slugs: ['extreme-heat-day', 'warm-night'],
      })}"
  />
</div>

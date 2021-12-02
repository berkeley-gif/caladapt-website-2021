<script>
  import { createEventDispatcher } from "svelte";

  import { SELECT_LOCATION_DESCRIPTION } from "../_common/constants";
  import { TIME_PERIODS, LEARN_MORE_PERIODS } from "./_constants";

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
    periodStore,
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

  function changePeriod(e) {
    periodStore.set(e.detail);
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
          'daily-maximum-temp',
          'daily-minimum-temp',
          'daily-pr',
          'tair',
          'evapotranspiration',
          'snow-water-equivalent',
          'baseflow',
          'runoff',
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
    on:click="{() => showLearnMore({ slugs: ['drought-scenario'] })}"
  />
</div>

<div class="block">
  <RadioBtnGroup
    selected="{$periodStore}"
    items="{TIME_PERIODS}"
    title="Select Period"
    on:change="{changePeriod}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: LEARN_MORE_PERIODS,
      })}"
  />
</div>

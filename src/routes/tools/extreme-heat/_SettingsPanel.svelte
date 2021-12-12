<script>
  import { createEventDispatcher } from "svelte";
  import { NumberInput } from "carbon-components-svelte";

  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    SELECT_LOCATION_DESCRIPTION,
  } from "../_common/constants";
  import { INDICATOR_DESCRIPTION } from "./_constants";

  import {
    SelectClimvar,
    SelectScenario,
    RadioBtnGroup,
    SelectModels,
    SelectThreshold,
  } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";

  import { locationStore, scenarioStore, modelsStore } from "../_common/stores";
  import {
    climvarList,
    climvarStore,
    indicatorList,
    indicatorStore,
    durationStore,
    thresholdStore,
    thresholdListStore,
  } from "./_store";

  const dispatch = createEventDispatcher();
  const { location } = locationStore;
  const { indicator } = indicatorStore;
  const { climvar } = climvarStore;

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
    climvarStore.set(e.detail);
  }

  function changeIndicator(e) {
    indicatorStore.set(e.detail.id);
  }

  function changeDuration(e) {
    durationStore.set(e.detail);
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
  }

  function changeThreshold(e) {
    thresholdStore.set(e.detail);
  }

  function addThreshold(e) {
    thresholdListStore.add(e.detail);
  }
</script>

<!-- Chart Settings -->
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
          content: SELECT_LOCATION_DESCRIPTION,
          header: 'Select Location',
        })}"
    />
  </div>
</div>

<div class="block">
  <RadioBtnGroup
    selected="{$climvarStore}"
    items="{climvarList}"
    title="Select Climate Variable"
    on:change="{changeClimvar}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        slugs: ['extreme-heat-day', 'warm-night'],
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

{#if $indicator.id === "waves"}
  <div class="block">
    <NumberInput
      label="Change Heat Wave Duration"
      min="{2}"
      max="{7}"
      value="{$durationStore}"
      on:change="{changeDuration}"
    />
    <LearnMoreButton
      on:click="{() => showLearnMore({ slugs: ['heat-wave-event'] })}"
    />
  </div>
{/if}

<div class="block">
  <SelectThreshold
    items="{$thresholdListStore}"
    selected="{$thresholdStore}"
    units="{$climvar.units.imperial}"
    helperText="Add a new threshold value or select from list"
    on:change="{changeThreshold}"
    on:add="{addThreshold}"
  />
  <LearnMoreButton
    on:click="{() => showLearnMore({ slugs: ['extreme-heat-threshold'] })}"
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

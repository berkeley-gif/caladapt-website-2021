<script>
  import { createEventDispatcher } from "svelte";

  import {
    PRIORITY_10_MODELS,
    DEFAULT_SCENARIOS,
    SELECT_LOCATION_DESCRIPTION,
  } from "../_common/constants";
  import {
    THRESHOLD_TYPES,
    RETURN_PERIODS,
    POLYGON_AGGREGATE_FUNCTIONS,
    MIN_DURATION_DAYS,
    MAX_DURATION_DAYS,
  } from "./_constants";

  import {
    SelectClimvar,
    SelectScenario,
    RadioBtnGroup,
    SelectModels,
    Select,
    SelectThresholdNumeric,
  } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { LocationMap } from "~/components/tools/Location";

  import { locationStore, scenarioStore, modelsStore } from "../_common/stores";
  import {
    indicatorList,
    indicatorStore,
    durationStore,
    thresholdStore,
    thresholdTypeStore,
    returnPeriodStore,
    aggregateFnStore,
  } from "./_store";

  export let learnMoreContent;

  const {
    durationInfo,
    indicatorInfo,
    periodInfo,
    thresholdTypeInfo,
    aggregationInfo,
  } = learnMoreContent;
  const dispatch = createEventDispatcher();
  const { location, boundary } = locationStore;
  const { indicator } = indicatorStore;

  $: isPolygonBoundary = $boundary.id !== "locagrid";

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

  function changeDuration(e) {
    durationStore.set(+e.detail);
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds);
  }

  function changeThreshold(e) {
    thresholdStore.set(e.detail);
  }

  function changeThresholdType(e) {
    thresholdTypeStore.set(e.detail.id);
  }

  /**
   * The Return Period Select component is displayed only for the Intensity Indicator.
   * The component is re-mounted after users browser other indicators and come back to Intensity.
   * Parsing the e.detail value as integer ensures that the Return Period last selected by the user
   * is displayed correctly on re-mount
   **/
  function changeReturnPeriod(e) {
    returnPeriodStore.set(parseInt(e.detail, 10));
  }

  function changeAggregateFn(e) {
    aggregateFnStore.set(e.detail);
  }
</script>

<!-- Chart Settings -->
<div class="block">
  <span class="bx--label">Select Location</span>
  <LocationMap location="{$location}" on:click="{showChangeLocation}" />
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
    title="Select Indicator"
    selectedId="{$indicatorStore}"
    items="{indicatorList}"
    on:change="{changeIndicator}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: indicatorInfo,
      })}"
  />
</div>

{#if $indicator.id === "intensity"}
  <div class="block">
    <Select
      title="Select Return Period"
      selectedId="{$returnPeriodStore}"
      items="{RETURN_PERIODS.map((d) => ({ id: d, text: `${d} years` }))}"
      on:change="{changeReturnPeriod}"
    />
    <LearnMoreButton
      on:click="{() =>
        showLearnMore({
          content: periodInfo,
        })}"
    />
  </div>
{/if}

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
  <SelectThresholdNumeric
    title="Change Event Duration"
    value="{$durationStore}"
    minValue="{MIN_DURATION_DAYS}"
    maxValue="{MAX_DURATION_DAYS}"
    delay="{1200}"
    on:change="{changeDuration}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: durationInfo,
      })}"
  />
</div>

<div class="block">
  <SelectClimvar
    title="Select Threshold Type"
    selectedId="{$thresholdTypeStore}"
    items="{THRESHOLD_TYPES}"
    on:change="{changeThresholdType}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: thresholdTypeInfo,
      })}"
  />
</div>

<div class="block">
  <RadioBtnGroup
    selected="{$aggregateFnStore}"
    items="{POLYGON_AGGREGATE_FUNCTIONS}"
    title="Select Spatial Aggregation"
    disabled="{!isPolygonBoundary}"
    on:change="{changeAggregateFn}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: aggregationInfo,
      })}"
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

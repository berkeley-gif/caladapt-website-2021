<script>
  import { createEventDispatcher } from "svelte";
  import { NumberInput } from "carbon-components-svelte";

  import {
    SELECT_STATION_DESCRIPTION,
    THRESHOLD_DESCRIPTION,
    DOY_DESCRIPTION,
    EXTREMES_DESCRIPTION,
    EXTREMES,
    DEFAULT_CLIMVAR_EXTREMES,
  } from "./_constants";

  import {
    SelectClimvar,
    SelectDayOfYear,
    RadioBtnGroup,
  } from "~/components/tools/Settings";
  import { LearnMoreButton } from "~/components/tools/Partials";
  import { StaticMap } from "~/components/tools/Location";

  import {
    climvarList,
    climvarStore,
    locationStore,
    doyStore,
    thresholdStore,
    extremesStore,
    thresholdProps,
  } from "./_store";

  const dispatch = createEventDispatcher();
  const { location } = locationStore;

  let extremesList = EXTREMES;
  extremesSideEffect($climvarStore);

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function showChangeLocation() {
    dispatch("showLoadLocation");
  }

  function changeClimvarExtremes({ detail }) {
    const { id } = detail;
    changeClimvar(id);
    extremesSideEffect(id);
  }

  function changeClimvar(id) {
    climvarStore.set(id);
    console.log("climvar change");
  }

  function extremesSideEffect(id) {
    const { defaultValue, extremes } = DEFAULT_CLIMVAR_EXTREMES.find(
      ({ climvar }) => id === climvar
    );
    extremesStore.set(defaultValue);
    extremesList = getExtremeItems(extremes);
  }

  function getExtremeItems(ids) {
    return ids.map((d) => EXTREMES.find(({ id }) => d === id));
  }

  function changeExtremes(e) {
    extremesStore.set(e.detail);
    console.log("extremes change");
  }

  function changeDayOfYear(e) {
    doyStore.set(e.detail);
    console.log("doy change");
  }

  function changeThreshold(e) {
    thresholdStore.set(+e.detail);
    console.log("threshold change");
  }
</script>

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
    labelText="Select Climate Variable"
    selectedId="{$climvarStore}"
    items="{climvarList}"
    on:change="{changeClimvarExtremes}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        slugs: [
          'daily-maximum-temp',
          'daily-minimum-temp',
          'daily-maximum-wind-speed',
        ],
      })}"
  />
</div>
<div class="block">
  <RadioBtnGroup
    items="{extremesList}"
    selected="{$extremesStore}"
    title="{'Select Extremes Type'}"
    on:change="{changeExtremes}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: EXTREMES_DESCRIPTION,
        header: 'Type of Extremes',
      })}"
  />
</div>
<div class="block">
  <SelectDayOfYear
    title="Enter Day of Year"
    value="{$doyStore}"
    on:change="{changeDayOfYear}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: DOY_DESCRIPTION,
        header: 'Day of Year',
      })}"
  />
</div>
<div class="block">
  <NumberInput
    invalid="{$thresholdProps.invalid}"
    invalidText="{$thresholdProps.invalidText}"
    label="Enter Threshold"
    value="{$thresholdStore}"
    on:change="{changeThreshold}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        content: THRESHOLD_DESCRIPTION,
        header: 'Threshold',
      })}"
  />
</div>

<script>
  import { createEventDispatcher } from "svelte";
  import { NumberInput } from "carbon-components-svelte";

  import {
    SELECT_STATION_DESCRIPTION,
    THRESHOLD_DESCRIPTION,
    DOY_DESCRIPTION,
    EXTREMES_DESCRIPTION,
    EXTREMES,
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

  function showLearnMore({ slugs = [], content = "", header = "Glossary" }) {
    dispatch("showLearnMore", { slugs, content, header });
  }

  function showChangeLocation() {
    dispatch("showLoadLocation");
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
    if (e.detail.id === "tasmax") {
      extremesStore.set("high");
    } else if (e.detail.id === "tasmin") {
      extremesStore.set("low");
    } else {
      extremesStore.set("high");
    }
    console.log("climvar change");
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
    width="{350}"
    height="{350}"
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
    on:change="{changeClimvar}"
  />
  <LearnMoreButton
    on:click="{() =>
      showLearnMore({
        slugs: ['daily-maximum-temp', 'daily-minimum-temp', 'daily-wind-speed'],
      })}"
  />
</div>
<div class="block">
  <RadioBtnGroup
    items="{EXTREMES}"
    selected="{$extremesStore}"
    title="{'Choose Type of Extremes'}"
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

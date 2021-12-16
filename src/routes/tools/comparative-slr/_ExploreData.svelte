<script>
  import { Dashboard } from "~/components/tools/Partials";
  import { Loading } from "carbon-components-svelte";

  import { BOUNDARIES } from "./_constants";
  import { isFetchingStore, locationStore } from "../_common/stores";
  import {
    timeFrameStore,
    floodScenarioStore,
    dataLayersStore,
  } from "./_store";
  import { getCSSProp } from "~/helpers/utilities";

  import { Legend, StyleControl } from "~/components/tools/Map";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import Title from "./_Title.svelte";
  import { Map } from "./_ComparativeSLRMap/";

  const { location, boundary } = locationStore;
  const { tfTileLabel, timeFrame } = timeFrameStore;
  const { floodScenario } = floodScenarioStore;

  // async component imports
  let ChangeLocation;
  let LearnMoreModal;

  let showLearnMore = false;
  let showChangeLocation = false;

  let learnMoreProps = {};

  let mapStyle;
  let legendRamp;

  if (typeof window !== "undefined" && !legendRamp) {
    legendRamp = [
      getCSSProp(document.documentElement, "--rs-green"),
      getCSSProp(document.documentElement, "--rs-blue"),
      getCSSProp(document.documentElement, "--rs-teal"),
    ];
  }

  $: dataUnavailableMsg = getUnavailableMsgText(
    $dataLayersStore.filter((d) => d.disabled)
  );

  function getUnavailableMsgText(layers) {
    if (layers.length) {
      return `${layers
        .map((d) => d.label)
        .join(" and ")} data unavailable for the
        ${
          $floodScenario.label
        } flood scenario in the San Francisco Bay region.`;
    }
    return "";
  }

  async function loadLearnMore({
    slugs = [],
    content = "",
    header = "Glossary",
  }) {
    learnMoreProps = { slugs, content, header };
    showLearnMore = true;
    LearnMoreModal = (
      await import(
        "~/components/tools/Partials/LearnMore/LearnMoreModal.svelte"
      )
    ).default;
  }

  async function loadLocation() {
    showChangeLocation = true;
    ChangeLocation = (
      await import("~/components/tools/Partials/ChangeLocationStation.svelte")
    ).default;
  }

  function changeLocation(e) {
    locationStore.updateBoundary(e.detail.boundaryId);
    locationStore.updateLocation(e.detail.location);
  }

  function handleStyleChange({ detail }) {
    mapStyle = detail;
  }
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard useTabs="{true}" activeTab="{0}">
  <div slot="tab_content_map_title" class="block title">
    <Title
      location="{$location.title}"
      loadLocation="{loadLocation}"
      timeFrame="{$timeFrame.label}"
      floodScenario="{$floodScenario.label}"
      dataLayers="{$dataLayersStore}"
      dataUnavailableMsg="{dataUnavailableMsg}"
    />
  </div>

  <div slot="tab_content_slippy_map_controls" class="block">
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <Legend
        title="Map Data Layers"
        values="{['CoSMoS', 'CalFlod3D-TFS', 'CoSMoS & CalFlod3D-TFS']}"
        ramp="{legendRamp}"
        width="{'12.5rem'}"
        --position="relative"
        --right="0"
        --bottom="0"
        --padding="0"
        --border-style="none"
      />
      <StyleControl
        selected="{mapStyle && mapStyle.split('/').pop()}"
        on:change="{handleStyleChange}"
        --position="relative"
        --bottom="0"
        --right="0"
        --border-style="none"
      />
    </div>
  </div>

  <div
    slot="tab_content_slippy_map"
    class="bx--aspect-ratio bx--aspect-ratio--16x9 graphic block"
  >
    <Map
      timeFrame="{$tfTileLabel}"
      scenario="{$floodScenarioStore}"
      dataLayersStore="{dataLayersStore}"
      bbox="{$location.bbox && $location.bbox}"
      mapStyle="{mapStyle}"
    />
  </div>

  <div slot="settings" class="settings">
    <SettingsPanel
      on:showLearnMore="{(e) => loadLearnMore(e.detail)}"
      on:showLoadLocation="{() => loadLocation()}"
    />
  </div>
</Dashboard>

<svelte:component
  this="{ChangeLocation}"
  bind:open="{showChangeLocation}"
  location="{$location}"
  boundary="{$boundary}"
  boundaryList="{BOUNDARIES}"
  addStateBoundary="{false}"
  enableUpload="{false}"
  on:change="{changeLocation}"
/>

<svelte:component
  this="{LearnMoreModal}"
  bind:open="{showLearnMore}"
  {...learnMoreProps}
/>

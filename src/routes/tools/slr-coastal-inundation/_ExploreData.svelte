<script>
  import { Dashboard } from "~/components/tools/Partials";
  import { Loading } from "carbon-components-svelte";

  import { BOUNDARIES } from "./_constants";
  import { isFetchingStore, locationStore } from "../_common/stores";
  import {
    timeFrameStore,
    floodScenarioStore,
    dataLayersStore,
    mapBBoxStore,
    dataLayersAugmentedStore,
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

  function changeLocation({ detail: { boundaryId, location } }) {
    locationStore.updateBoundary(boundaryId);
    locationStore.updateLocation(location);
  }

  function handleStyleChange({ detail }) {
    mapStyle = detail;
  }

  function handleMapMoveend({ detail }) {
    mapBBoxStore.set(detail);
  }
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard useMap="{true}">
  <div slot="map_title" class="block title">
    <Title
      location="{$location.title}"
      loadLocation="{loadLocation}"
      timeFrame="{$timeFrame.label}"
      floodScenario="{$floodScenario.label}"
      dataLayers="{$dataLayersStore}"
      dataUnavailableMsg="{dataUnavailableMsg}"
    />
  </div>

  <div
    slot="slippy_map_controls"
    class="block"
    style="background: var(--gray-20);"
  >
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <Legend
        title="Map Data Layers"
        values="{['CoSMoS', 'CalFlod3D-TFS', 'CoSMoS & CalFlod3D-TFS']}"
        ramp="{legendRamp}"
        width="{'auto'}"
        columns="{3}"
        --position="relative"
        --right="0"
        --bottom="0"
        --padding="0"
        --border-style="none"
        --background="var(--gray-20)"
      />
      <StyleControl
        selected="{mapStyle && mapStyle.split('/').pop()}"
        on:change="{handleStyleChange}"
        --position="relative"
        --bottom="0"
        --right="0"
        --border-style="none"
        --background="var(--gray-20)"
      />
    </div>
  </div>

  <div
    slot="slippy_map"
    class="bx--aspect-ratio bx--aspect-ratio--16x9 graphic block"
  >
    <Map
      timeFrame="{$tfTileLabel}"
      scenario="{$floodScenarioStore}"
      dataLayersAugmented="{$dataLayersAugmentedStore}"
      bbox="{$location.bbox && $location.bbox}"
      mapStyle="{mapStyle}"
      on:moveend="{handleMapMoveend}"
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

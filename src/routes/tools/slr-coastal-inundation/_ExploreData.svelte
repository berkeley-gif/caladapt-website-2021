<script>
  import { Dashboard } from "~/components/tools/Partials";
  import { Loading } from "carbon-components-svelte";

  import { isFetchingStore } from "../_common/stores";
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
  import { Map } from "./_Map";

  export let learnMoreContent;

  const { timeFrame } = timeFrameStore;
  const { floodScenario } = floodScenarioStore;

  // async component imports
  let LearnMoreModal;

  let showLearnMore = false;

  let learnMoreProps = {};

  let mapStyle = "dark-v10";
  let legendRamp;

  if (typeof window !== "undefined" && !legendRamp) {
    legendRamp = [
      getCSSProp(document.documentElement, "--rs-green"),
      getCSSProp(document.documentElement, "--rs-blue"),
      getCSSProp(document.documentElement, "--rs-teal"),
    ];
  }

  $: dataUnavailableMsg = getUnavailableMsgText(
    $dataLayersAugmentedStore.filter(
      (d) => !Array.isArray(d.tileUrls) || !d.tileUrls.length
    )
  );

  function getUnavailableMsgText(layers) {
    if (layers.length) {
      return `${layers
        .map((d) => d.label)
        .join(" and ")} data are unavailable for the current map view.`;
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

<Dashboard useTabs="{true}" activeTab="{0}">
  <div slot="tab_content_map_title" class="block title">
    <Title
      timeFrame="{$timeFrame.label}"
      floodScenario="{$floodScenario.label}"
      dataLayers="{$dataLayersStore}"
      dataUnavailableMsg="{dataUnavailableMsg}"
    />
  </div>

  <div
    slot="tab_content_slippy_map_controls"
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
        selected="{mapStyle}"
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
    slot="tab_content_slippy_map"
    class="bx--aspect-ratio bx--aspect-ratio--16x9 graphic block"
  >
    <Map
      dataLayersAugmented="{$dataLayersAugmentedStore}"
      mapStyle="{mapStyle}"
      on:moveend="{handleMapMoveend}"
    />
  </div>

  <div slot="settings" class="settings">
    <SettingsPanel
      learnMoreContent="{learnMoreContent}"
      on:showLearnMore="{(e) => loadLearnMore(e.detail)}"
    />
  </div>
</Dashboard>

<svelte:component
  this="{LearnMoreModal}"
  bind:open="{showLearnMore}"
  {...learnMoreProps}
/>

<script>
  import { Dashboard } from "~/components/tools/Partials";
  import { Loading, Button } from "carbon-components-svelte";
  import { Share16 } from "carbon-icons-svelte";

  import { isFetchingStore } from "../_common/stores";
  import {
    timeFrameStore,
    floodScenarioStore,
    dataLayersStore,
    mapViewStore,
    dataLayersAugmentedStore,
  } from "./_store";
  import { getCSSProp } from "~/helpers/utilities";
  import { makeBookmark } from "../_common/helpers";

  import { Legend, StyleControl } from "~/components/tools/Map";
  import SettingsPanel from "./_SettingsPanel.svelte";
  import Title from "./_Title.svelte";
  import { Map } from "./_Map";

  export let learnMoreContent;
  export let mapStyle;

  const { timeFrame } = timeFrameStore;
  const { floodScenario } = floodScenarioStore;

  // async component imports
  let LearnMoreModal;
  let ShareLink;

  let showLearnMore = false;
  let showShare = false;

  let learnMoreProps = {};
  let bookmark = "";

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

  async function loadShare() {
    showShare = true;
    ShareLink = (await import("~/components/tools/Partials/ShareLink.svelte"))
      .default;
  }

  function setBookmarkParams() {
    const { lat, lng, zoom } = $mapViewStore;
    const dataLayers =
      $dataLayersAugmentedStore
        .filter((d) => d.checked && !d.disabled)
        .map((d) => d.id)
        .join(",") || "none";
    bookmark = makeBookmark({
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      zoom: zoom.toFixed(4),
      dataLayers,
      mapStyle,
      timeFrame: $timeFrame.id,
      floodScenario: $floodScenario.id,
    });
  }

  async function handleShareBtnClick() {
    setBookmarkParams();
    await loadShare();
  }

  function handleStyleChange({ detail }) {
    mapStyle = detail;
  }
</script>

<style>
  .map-controls-container {
    display: flex;
    justify-content: space-between;
  }
  .share-btn-container {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
</style>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard useMap="{true}">
  <div slot="map_title" class="block title">
    <Title
      timeFrame="{$timeFrame.label}"
      floodScenario="{$floodScenario.label}"
      dataLayers="{$dataLayersStore}"
      dataUnavailableMsg="{dataUnavailableMsg}"
      isFetchingData="{$isFetchingStore}"
    />
  </div>

  <div
    slot="slippy_map_controls"
    class="block"
    style="background: var(--gray-20);"
  >
    <div class="map-controls-container">
      <Legend
        title="Map Data Layers"
        values="{['CoSMoS', 'CalFloD3D-TFS', 'CoSMoS & CalFloD3D-TFS']}"
        ramp="{legendRamp}"
        width="{'auto'}"
        columns="{0}"
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
      <div class="share-btn-container">
        <p class="bx--label">Share Map View</p>
        <Button size="small" icon="{Share16}" on:click="{handleShareBtnClick}"
          >Share</Button
        >
      </div>
    </div>
  </div>

  <div
    slot="slippy_map"
    class="bx--aspect-ratio bx--aspect-ratio--16x9 graphic block"
  >
    <Map
      dataLayersAugmented="{$dataLayersAugmentedStore}"
      mapStyle="{mapStyle}"
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

<svelte:component
  this="{ShareLink}"
  bind:open="{showShare}"
  state="{bookmark}"
/>

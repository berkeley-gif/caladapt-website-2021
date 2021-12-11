<script>
  import { Dashboard } from "~/components/tools/Partials";
  import { Loading } from "carbon-components-svelte";

  import { DEFAULT_BOUNDARIES } from "../_common/constants";
  import { isFetchingStore, locationStore } from "../_common/stores";
  import {
    timeFrameStore,
    floodScenarioStore,
    dataLayersStore,
  } from "./_store";

  import SettingsPanel from "./_SettingsPanel.svelte";
  import Title from "./_Title.svelte";
  import Map from "./_ComparativeSLRMap.svelte";

  const { location, boundary } = locationStore;
  const { tfTileLabel } = timeFrameStore;

  // async component imports
  let ChangeLocation;
  let LearnMoreModal;

  let showLearnMore = false;
  let showChangeLocation = false;

  let learnMoreProps = {};

  let mapZoomLevel = 12;

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
    if (e.detail.boundaryId === "custom") {
      locationStore.updateBoundary("locagrid");
      locationStore.updateLocation(e.detail.location, true);
    } else {
      locationStore.updateBoundary(e.detail.boundaryId);
      locationStore.updateLocation(e.detail.location);
    }
  }
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard useTabs="{true}" activeTab="{0}">
  <div slot="tab_content_map_title" class="block title">
    <Title location="{$location.title}" loadLocation="{loadLocation}" />
  </div>

  <div
    slot="tab_content_slippy_map"
    class="bx--aspect-ratio bx--aspect-ratio--16x9 graphic block"
  >
    <Map
      timeFrame="{$tfTileLabel}"
      scenario="{$floodScenarioStore}"
      dataLayers="{$dataLayersStore}"
      center="{$location.center}"
      zoom="{mapZoomLevel}"
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
  boundaryList="{DEFAULT_BOUNDARIES}"
  addStateBoundary="{false}"
  enableUpload="{false}"
  on:change="{changeLocation}"
/>

<svelte:component
  this="{LearnMoreModal}"
  bind:open="{showLearnMore}"
  {...learnMoreProps}
/>

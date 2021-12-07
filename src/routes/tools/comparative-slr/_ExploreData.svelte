<script>
  import { Dashboard } from "~/components/tools/Partials";
  import { Loading } from "carbon-components-svelte";

  import { isFetchingStore } from "../_common/stores";
</script>

{#if $isFetchingStore}
  <Loading />
{/if}

<Dashboard useTabs="{true}" activeTab="{0}">
  <div slot="tab_content_map_title" class="block title">
    <h2>Title here</h2>
  </div>

  <div
    slot="tab_content_slippy_map"
    class="bx--aspect-ratio bx--aspect-ratio--16x9 graphic block"
  ></div>

  <div slot="tab_content_slippy_map_controls" class="graphic block"></div>

  <div slot="settings" class="settings"></div>
</Dashboard>

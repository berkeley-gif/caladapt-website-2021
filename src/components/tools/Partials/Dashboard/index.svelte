<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";

  import MapView from "./MapView.svelte";
  import ChartView from "./ChartView.svelte";

  export let useTabs = false;
  export let useMap = false;
  export let activeTab = 0;

  const activeTabDispatcher = createEventDispatcher();

  $: activeTab, dispatchActiveTab();

  $: console.log($$slots);

  onMount(() => {
    if (useTabs) dispatchActiveTab();
  });

  function dispatchActiveTab() {
    activeTabDispatcher("tabChange", activeTab);
  }
</script>

<style lang="scss">
  .dashboard {
    display: flex;
    max-width: 99rem;
    margin: 2rem auto;
    gap: 1rem;

    .content {
      width: 75%;
      padding-right: 0;
    }

    .sidebar {
      width: 25%;
      padding-left: 0;
    }
  }

  .is-sticky {
    top: -1px;
  }

  .bx--grid--tab-content {
    padding: 0;
  }

  // overrides for tab content area
  :global(.bx--tab-content) {
    padding: 0;
  }

  :global(.bx--tabs__nav-link) {
    font-size: 0.875rem;
  }

  div[slot="content"] {
    width: 100%;
  }
  // end overrides for tab content area

  @media (max-width: 1000px) {
    .dashboard {
      flex-direction: column;

      .content {
        width: 100%;
        padding-right: 1rem;
      }

      .sidebar {
        width: 100%;
        padding-left: 2rem;
      }
    }
  }

  @media (max-width: 672px) {
    .dashboard {
      .content {
        padding-right: 0;
      }

      .sidebar {
        padding-left: 1rem;
      }
    }
  }
</style>

<div class="dashboard">
  <div class="bx--grid content">
    {#if useTabs}
      <div class="bx--row">
        <div class="bx--col">
          <Tabs type="container" bind:selected="{activeTab}">
            <Tab label="Map" />
            <Tab label="Chart" />
            <div slot="content">
              <TabContent>
                <div
                  class="bx--grid bx--grid--full-width bx--grid--tab-content"
                >
                  <MapView useTabs="{true}">
                    <slot
                      slot="tab_content_map_title"
                      name="tab_content_map_title"
                    />
                    <slot
                      slot="tab_content_slippy_map"
                      name="tab_content_slippy_map"
                    />
                    <slot
                      slot="tab_content_slippy_map_controls"
                      name="tab_content_slippy_map_controls"
                    />
                  </MapView>
                </div>
              </TabContent>
              <TabContent>
                <div
                  class="bx--grid bx--grid--full-width bx--grid--tab-content"
                >
                  <ChartView useTabs="{true}">
                    <slot slot="tab_content_title" name="tab_content_title" />
                    <slot slot="tab_content_stats" name="tab_content_stats" />
                    <slot
                      slot="tab_content_graphic"
                      name="tab_content_graphic"
                    />
                  </ChartView>
                </div>
              </TabContent>
            </div>
          </Tabs>
        </div>
      </div>
    {:else if useMap}
      <MapView>
        <slot slot="title" name="title" />
        <slot slot="slippy_map" name="slippy_map" />
        <slot slot="slippy_map_controls" name="slippy_map_controls" />
      </MapView>
    {:else}
      <ChartView>
        <slot slot="title" name="title" />
        <slot slot="stats" name="stats" />
        <slot slot="graphic" name="graphic" />
      </ChartView>
    {/if}
  </div>

  <aside class="bx--grid sidebar">
    <div class="is-sticky">
      <div class="bx--row margin--v-16">
        <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
          <slot name="settings">settings with columns</slot>
        </div>
      </div>
    </div>
  </aside>
</div>

<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";

  import View from "./View.svelte";

  export let useTabs = false;
  export let useMap = false;
  export let activeTab = 0;

  const activeTabDispatcher = createEventDispatcher();

  $: activeTab, dispatchActiveTab();

  onMount(() => {
    if (useTabs) dispatchActiveTab();
  });

  function dispatchActiveTab() {
    activeTabDispatcher("tabChange", activeTab);
  }
</script>

<style lang="scss">
  @import "scss/site/mixins/media-queries";

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

  @include media("<=1000px") {
    .dashboard {
      flex-direction: column;

      .sidebar,
      .content {
        width: 100%;
      }

      .content {
        padding-right: 1rem;
      }

      .sidebar {
        padding-left: 2rem;
      }
    }
  }

  @include mobile-tablet {
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
      <!-- tabs layout for chart & map view -->
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
                  <View useTabs="{true}">
                    <slot slot="map_title" name="map_title" />
                    <slot slot="slippy_map" name="slippy_map" />
                    <slot
                      slot="slippy_map_controls"
                      name="slippy_map_controls"
                    />
                  </View>
                </div>
              </TabContent>
              <TabContent>
                <div
                  class="bx--grid bx--grid--full-width bx--grid--tab-content"
                >
                  <View useTabs="{true}">
                    <slot slot="chart_title" name="chart_title" />
                    <slot slot="stats" name="stats" />
                    <slot slot="graphic" name="graphic" />
                  </View>
                </div>
              </TabContent>
            </div>
          </Tabs>
        </div>
      </div>
    {:else if useMap}
      <!-- layout for map view only -->
      <View>
        <slot slot="map_title" name="map_title" />
        <slot slot="slippy_map" name="slippy_map" />
        <slot slot="slippy_map_controls" name="slippy_map_controls" />
      </View>
    {:else}
      <!-- default to layout for chart only -->
      <View>
        <slot slot="chart_title" name="chart_title" />
        <slot slot="stats" name="stats" />
        <slot slot="graphic" name="graphic" />
      </View>
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

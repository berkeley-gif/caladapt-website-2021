<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";

  export let useTabs = false;

  const activeTabDispatcher = createEventDispatcher();

  let activeTab = 0;

  $: activeTab, dispatchActiveTab();

  onMount(() => {
    if (useTabs) dispatchActiveTab();
  });

  function dispatchActiveTab() {
    activeTabDispatcher("tabChange", activeTab ? "chart" : "map");
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

  // overrides for tab content area
  :global(.bx--tab-content) {
    padding: 0;
  }

  :global(.bx--grid--full-width) {
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
                <div class="bx--grid bx--grid--full-width">
                  <div class="bx--row margin--v-16">
                    <div class="bx--col">
                      <slot name="tab_content_slippy_map"
                        >tab_content_slippy_map</slot
                      >
                    </div>
                  </div>
                </div>
              </TabContent>

              <TabContent>
                <div class="bx--grid bx--grid--full-width">
                  <div class="bx--row margin--v-16">
                    <div
                      class="bx--col-lg-4 bx--col-md-2 bx--col-sm-4 bx--aspect-ratio bx--aspect-ratio--1x1"
                    >
                      <slot name="tab_content_map">tab_content_map</slot>
                    </div>
                    <div class="bx--col-lg-12 bx--col-md-6 bx--col-sm-4">
                      <slot name="tab_content_title">tab_content_title</slot>
                    </div>
                  </div>

                  <div class="bx--row margin--v-16">
                    <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
                      <slot name="tab_content_stats">tab_content_stats</slot>
                    </div>
                  </div>

                  <div class="bx--row margin--v-16">
                    <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
                      <slot name="tab_content_graphic">tab_content_graphic</slot
                      >
                    </div>
                  </div>
                </div>
              </TabContent>
            </div>
          </Tabs>
        </div>
      </div>
    {:else}
      <div class="bx--row">
        <div class="bx--col">
          <slot name="title">title</slot>
        </div>
      </div>

      <div class="bx--row margin--v-16">
        <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
          <slot name="stats">stats</slot>
        </div>
      </div>

      <div class="bx--row margin--v-16">
        <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
          <slot name="graphic">graphic</slot>
        </div>
      </div>
    {/if}
  </div>

  <aside class="bx--grid settings">
    <div class="is-sticky">
      <div class="bx--row margin--v-16">
        <div class="bx--col-lg-16 bx--col-md-8 bx--col-sm-4">
          <slot name="settings">settings with columns</slot>
        </div>
      </div>
    </div>
  </aside>
</div>

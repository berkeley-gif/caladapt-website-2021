<script context="module">
  import { TOOL_SLUG } from "./_constants";
  export async function preload() {
    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const tool = toolsList.find((d) => d.slug === TOOL_SLUG);

    const { categories, indicators } = await (
      await this.fetch("tools/local-climate-change-snapshot.json")
    ).json();

    return {
      tool,
      categories,
      indicators,
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { stores as sapperStores } from "@sapper/app";

  // Helpers
  import { logException } from "~/helpers/logging";
  import { getInitialConfig, setInitialLocation } from "../_common/helpers";
  import { INITIAL_CONFIG } from "../_common/constants";
  import { getQueryParams, getProjections, getObserved } from "./_data";

  // Components
  import ExploreData from "./_ExploreData.svelte";
  import { NotificationDisplay, notifier } from "~/components/notifications";

  // Stores & constants
  import {
    unitsStore,
    locationStore,
    isFetchingStore,
    dataStore,
  } from "../_common/stores";
  import {
    categoryListStore,
    indicatorListStore,
    indicatorStore,
  } from "./_store";
  import {
    DEFAULT_INITIAL_CONFIG,
    DEFAULT_POLYGON_AGGREGATE_FUNCTION,
  } from "./_constants";

  export let tool;
  export let categories;
  export let indicators;

  // Derived stores
  const { page } = sapperStores();
  const { location, boundary } = locationStore;

  let appReady = false;
  let debug = process.env.NODE_ENV !== "production";

  $: if (debug) {
    console.groupCollapsed("STORE UPDATES");
    console.table($locationStore);
    console.table($indicatorStore);
    console.groupEnd();
  }

  async function update() {
    if (!appReady) return;
    try {
      const config = {
        indicatorId: $indicatorStore.id,
      };
      // Get params object for querying the Cal-Adapt API
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
        stat: DEFAULT_POLYGON_AGGREGATE_FUNCTION,
      });

      isFetchingStore.set(true);
      const observed = await getObserved(config, params, method);
      const projections = await getProjections(config, params, method);
      dataStore.set([...observed, ...projections]);
      console.log("data", $dataStore);
    } catch (error) {
      console.error("updateData", error);
      logException(error);
      notifier.error("Error", error, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp() {
    const { query } = $page;
    // Get initial configuration (from default or from url)
    const { lat, lng, boundary, indicator, imperial } = getInitialConfig(
      query,
      DEFAULT_INITIAL_CONFIG
    );
    // Set intial values for stores
    categoryListStore.set(categories);
    indicatorListStore.set(indicators);
    indicatorStore.set(indicators.find((d) => d.id === indicator));
    unitsStore.set({ imperial });
    const loc = await setInitialLocation(+lng, +lat, boundary);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundary);
    return;
  }

  onMount(async () => {
    try {
      await initApp();
      appReady = true;
      if (debug) console.log("app ready");
      await update();
    } catch (error) {
      console.error("init error", error);
      logException(error);
      notifier.error(
        "Unable to Load Tool",
        "Sorry! Something's probably wrong at our end. Try refereshing your browser. If you still see an error please contact us at support@cal-adapt.org.",
        2000
      );
    } finally {
      window.scrollTo(0, 0);
    }
  });
</script>

<svelte:head>
  <title>{tool.title}</title>
</svelte:head>

<div id="explore-data">
  {#if appReady}
    <ExploreData />
  {:else}
    <Loading />
  {/if}
</div>

<div class="spacing--v-96"></div>

<NotificationDisplay />

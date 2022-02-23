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
  } from "../_common/stores";
  import {
    categoryListStore,
    indicatorListStore,
    indicatorStore,
    dataStore,
    snapshotProjectionsStore,
    snapshotObservedStore,
  } from "./_store";
  import {
    DEFAULT_INITIAL_CONFIG,
    DEFAULT_POLYGON_AGGREGATE_FUNCTION,
    INDICATORS_WITH_VALUES_AS_RATES,
    DEFAULT_SNAPSHOT_SLUG_EXP,
    DEFAULT_SWE_MONTH,
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

  $: console.log("snapshot projections", $snapshotProjectionsStore);
  $: console.log("snapshot baseline", $snapshotObservedStore);

  async function update() {
    if (!appReady) return;
    try {
      const config = {
        indicatorId: $indicatorStore.id,
        isAnnualRate: INDICATORS_WITH_VALUES_AS_RATES.includes(
          $indicatorStore.id
        ),
      };
      // Get params object for querying the Cal-Adapt API
      // extra months param required for April SWE indicator
      const months = $indicatorStore.id === "swe" ? DEFAULT_SWE_MONTH : null;
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
        stat: DEFAULT_POLYGON_AGGREGATE_FUNCTION,
        ...(months && { months }),
      });
      isFetchingStore.set(true);
      const observed = await getObserved(config, params, method);
      const projections = await getProjections(config, params, method);
      dataStore.setObserved(observed);
      dataStore.setProjections(projections);
      const projections30y = await getProjections(
        config,
        params,
        method,
        DEFAULT_SNAPSHOT_SLUG_EXP
      );
      dataStore.setProjections30y(projections30y);
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

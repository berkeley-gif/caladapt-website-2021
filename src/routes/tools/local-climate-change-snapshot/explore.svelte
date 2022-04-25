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
  import {
    getInitialConfig,
    setInitialLocation,
  } from "~/routes/tools/_common/helpers";
  import { isValidNumber } from "./_helpers";
  import { getQueryParams, getProjections, getObserved } from "./_data";

  // Components
  import { Header } from "./_common";
  import ExploreData from "./_explore/ExploreData.svelte";
  import { NotificationDisplay, notifier } from "~/components/notifications";

  // Stores & constants
  import {
    unitsStore,
    locationStore,
    isFetchingStore,
  } from "~/routes/tools/_common/stores";
  import {
    categoryListStore,
    indicatorListStore,
    indicatorStore,
    dataStore,
  } from "./_store";
  import {
    DEFAULT_INITIAL_CONFIG,
    DEFAULT_POLYGON_AGGREGATE_FUNCTION,
    AREABURNED_POLYGON_AGGREGATE_FUNCTION,
    INDICATORS_WITH_VALUES_AS_RATES,
    INDICATORS_WITH_NO_ENSEMBLES,
    DEFAULT_PROJECTIONS_SLUG_EXP,
    DEFAULT_SNAPSHOT_SLUG_EXP,
    AREABURNED_TIMESERIES_SLUG_EXP,
    DEFAULT_SWE_MONTH,
    VALID_BOUNDARY_TYPES,
  } from "./_constants";
  import { DEFAULT_LOCATION } from "../_common/constants";

  export let tool;
  export let categories;
  export let indicators;

  // Derived stores
  const { page } = sapperStores();
  const { location, boundary } = locationStore;
  const { chartDataStore, snapshotDataStore } = dataStore;

  let appReady = false;
  let debug = process.env.NODE_ENV !== "production";

  $: if (debug) {
    console.groupCollapsed("STORE UPDATES");
    console.table($locationStore);
    console.table($indicatorStore);
    console.groupEnd();
  }

  $: console.log("data", $dataStore);
  $: console.log("chart data", $chartDataStore);
  $: console.log("snapshot data", $snapshotDataStore);

  function handleHeaderBtnClick(event) {
    if (event.target.dataset.action === "change-location") {
      // Note: using this method of page navigation as there appears to be a bug
      // when using Sapper's goto method which doesn't correctly update the DOM.
      window.location.pathname = "/tools/local-climate-change-snapshot/";
    } else {
      // TODO: handle generating PDF from the DOM
    }
  }

  async function update() {
    if (!appReady) return;
    try {
      const config = {
        indicatorId: $indicatorStore.id,
        isAnnualRate: INDICATORS_WITH_VALUES_AS_RATES.includes(
          $indicatorStore.id
        ),
      };

      /**
       * Get params object for querying the Cal-Adapt API
       */
      // Use extra `months`` param for April SWE indicator only
      const months = $indicatorStore.id === "swe" ? DEFAULT_SWE_MONTH : null;
      // Use a different `stats`` param for Area Burned (Wildfire) data
      const stat =
        $indicatorStore.id === "fire"
          ? AREABURNED_POLYGON_AGGREGATE_FUNCTION
          : DEFAULT_POLYGON_AGGREGATE_FUNCTION;
      // Get params
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
        stat,
        ...(months && { months }),
      });

      isFetchingStore.set(true);

      /**
       * Regex strings are used to search the Cal-Adapt API and get a list
       * of endpoints to fetch data from.
       */
      // For all indicators except `fire` use the default Regex string
      // For `fire` the regex returns endpoints for models. There is no ensemble avg, min, max
      const projectionsSearchStr = INDICATORS_WITH_NO_ENSEMBLES.includes(
        $indicatorStore.id
      )
        ? AREABURNED_TIMESERIES_SLUG_EXP
        : DEFAULT_PROJECTIONS_SLUG_EXP;

      // For all indicators except `fire` use the default snapshot Regex string
      // For `fire` there is no regex.
      const snapshotSearchStr = INDICATORS_WITH_NO_ENSEMBLES.includes(
        $indicatorStore.id
      )
        ? null
        : DEFAULT_SNAPSHOT_SLUG_EXP;

      /**
       * Fetch data and set data store
       */
      const observed = await getObserved({ config, params, method });
      const projections = await getProjections({
        config,
        params,
        method,
        searchStr: projectionsSearchStr,
      });
      const projections30y = await getProjections({
        config,
        params,
        method,
        searchStr: snapshotSearchStr,
      });
      dataStore.setEnsembleFlag(
        !INDICATORS_WITH_NO_ENSEMBLES.includes($indicatorStore.id)
      );
      dataStore.setObserved(observed);
      dataStore.setProjections(projections);
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
    const {
      lat,
      lng,
      boundary: boundaryType,
      indicator,
      imperial,
    } = getInitialConfig(query, DEFAULT_INITIAL_CONFIG);
    // Set intial values for stores

    if (!$location || !$boundary) {
      await setLocationStoreOnLoad(+lat, +lng, boundaryType);
    }
    categoryListStore.set(categories);
    indicatorListStore.set(indicators);
    indicatorStore.set(indicators.find((d) => d.id === indicator));
    unitsStore.set({ imperial });
  }

  async function setLocationStoreOnLoad(lat, lng, boundaryType) {
    let loc = DEFAULT_LOCATION;
    if (
      isValidNumber(lat) &&
      isValidNumber(lng) &&
      VALID_BOUNDARY_TYPES.has(boundaryType)
    ) {
      try {
        loc = await setInitialLocation(lng, lat, boundaryType);
      } catch (error) {
        console.warn(error);
      }
    }
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryType);
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

<div id="lccs-explore">
  <Header
    on:click="{handleHeaderBtnClick}"
    iconPaths="{tool.icons}"
    pageName="explore"
    location="{$location}"
  />

  <div id="explore-data">
    {#if appReady}
      <ExploreData />
    {:else}
      <Loading />
    {/if}
  </div>

  <div class="spacing--v-96"></div>

  <NotificationDisplay />
</div>

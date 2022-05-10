<script context="module">
  import resourcesList from "content/resources/data";
  import { TOOL_SLUG } from "./_constants";

  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  export async function preload() {
    // Get tools metadata
    const toolsList = (await (await this.fetch("tools.json")).json()).tools;

    // Filter metadata for current tool
    const tool = toolsList.find(({ slug }) => slug === TOOL_SLUG);
    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));

    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    // Get help categories
    const help = await (await this.fetch("help.json")).json();
    const helpItems = help.filter(({ slug }) =>
      ["get-started", "faqs"].includes(slug)
    );

    const { aboutContent } = await (
      await this.fetch("tools/degree-days.json")
    ).json();

    return {
      tool,
      relatedTools,
      externalResources,
      helpItems,
      aboutContent,
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";
  import { stores as sapperStores } from "@sapper/app";

  // Helpers
  import { logException } from "~/helpers/logging";
  import {
    DEFAULT_CLIMATE_INDICATOR,
    DEFAULT_FREQUENCY_CODE,
    DEFAULT_SELECTED_MONTHS,
    DEFAULT_THRESHOLD_DEGREES,
  } from "./_constants";
  import { INITIAL_CONFIG } from "../_common/constants";
  import { getInitialConfig, setInitialLocation } from "../_common/helpers";

  // Components
  import ExploreData from "./_ExploreData.svelte";
  import {
    Header,
    About,
    Resources,
    Help,
    ToolNavigation,
  } from "~/components/tools/Partials";
  import { NotificationDisplay, notifier } from "~/components/notifications";

  // Store
  import {
    scenarioStore,
    modelsStore,
    unitsStore,
    locationStore,
    dataStore,
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import {
    climvarStore,
    indicatorsStore,
    thresholdStore,
    frequencyStore,
    selectedMonthsStore,
  } from "./_store";
  import { getObserved, getModels, getQueryParams } from "./_data";

  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;
  export let aboutContent;

  // Derived stores
  const { page } = sapperStores();
  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  // Local props
  let appReady = false;

  // Monitor sections as they enter & leave viewport
  let currentView;
  const handleEntry = (e) => {
    const { inView, entry } = e.detail;
    if (inView) {
      currentView = entry.target.id;
    }
  };

  // Reactive props
  $: datasets = tool.datasets;
  $: resources = [...externalResources, ...relatedTools];
  $: extraParams = { freq: $frequencyStore, thresh: $thresholdStore };
  $: $climvar,
    $scenario,
    $modelsStore,
    $location,
    $indicatorsStore,
    $thresholdStore,
    $frequencyStore,
    $selectedMonthsStore,
    update();

  async function update() {
    if (!appReady || !$modelsStore.length) return;
    try {
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
        indicatorId: $indicatorsStore,
        monthIds:
          $frequencyStore === "M" ? new Set($selectedMonthsStore) : null,
      };
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
      });

      isFetchingStore.set(true);

      const observed = await getObserved(
        config,
        { ...params, ...extraParams },
        method
      );
      const modelsData = await getModels(
        config,
        { ...params, ...extraParams },
        method
      );

      dataStore.set([...observed, ...modelsData]);
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
    // Default configuration
    const config = {
      ...INITIAL_CONFIG,
      indicator: DEFAULT_CLIMATE_INDICATOR,
      frequency: DEFAULT_FREQUENCY_CODE,
      months: DEFAULT_SELECTED_MONTHS,
      threshold: DEFAULT_THRESHOLD_DEGREES,
    };
    // Get initial configuration (from default or from url)
    const {
      lat,
      lng,
      fid,
      boundary,
      indicator,
      scenario,
      climvar,
      models,
      months,
      imperial,
      threshold,
      frequency,
    } = getInitialConfig(query, config);
    // Set intial values for stores
    climvarStore.set(climvar);
    indicatorsStore.set(indicator);
    scenarioStore.set(scenario);
    modelsStore.set(models);
    unitsStore.set({ imperial });
    thresholdStore.set(threshold);
    frequencyStore.set(frequency);
    selectedMonthsStore.set(months);
    const { location, boundaryType } = await setInitialLocation(
      +lng,
      +lat,
      boundary,
      +fid
    );
    locationStore.updateLocation(location);
    locationStore.updateBoundary(boundaryType);
    return;
  }

  onMount(() => {
    initApp()
      .then(() => {
        appReady = true;
      })
      .catch((error) => {
        console.error("init error", error);
        logException(error);
        notifier.error(
          "Unable to Load Tool",
          "Sorry! Something's probably wrong at our end. Try refereshing your browser. If you still see an error please contact us at support@cal-adapt.org.",
          2000
        );
      });
    window.scrollTo(0, 0);
  });
</script>

<svelte:head>
  <title>{tool.title}</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<Header
  title="{tool.title}"
  description="Explore projected changes in Heating Degree Days and Cooling 
    Degree Days which are a common proxy for energy needed to heat and cool 
    buildings, respectively."
  iconPaths="{tool.icons}"
/>

<ToolNavigation href="{`/tools/${tool.slug}`}" />

<div id="explore-data" use:inview="{{}}" on:enter="{handleEntry}">
  {#if appReady}
    <ExploreData />
  {:else}
    <Loading />
  {/if}
</div>

<div class="bx--grid">
  <div id="about" use:inview="{{}}" on:enter="{handleEntry}">
    <About
      datasets="{datasets}"
      on:datasetLoaded="{(e) => datasetStore.set(e.detail)}"
    >
      <div slot="description">
        {@html aboutContent}
      </div>
    </About>
  </div>

  <div id="resources" use:inview="{{}}" on:enter="{handleEntry}">
    <Resources resources="{resources}" />
  </div>

  <div id="help" use:inview="{{}}" on:enter="{handleEntry}">
    <Help items="{helpItems}" />
  </div>
</div>

<div class="spacing--v-96"></div>

<NotificationDisplay />

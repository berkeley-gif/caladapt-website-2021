<script context="module">
  import { TOOL_SLUG } from "./_constants";
  import resourcesList from "content/resources/data";

  export async function preload({ query }) {
    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const tool = toolsList.find((d) => d.slug === TOOL_SLUG);
    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));
    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    // Get help categories
    const help = await this.fetch("help.json")
      .then((r) => r.json())
      .then((json) => {
        return json;
      });
    const helpItems = help.filter((d) =>
      ["get-started", "faqs"].includes(d.slug)
    );

    const { aboutContent } = await (
      await this.fetch("tools/snowpack.json")
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

  import { logException } from "~/helpers/logging";
  import {
    DEFAULT_CENTER,
    DEFAULT_CLIMVAR,
    DEFAULT_SELECTED_DURATION,
    DEFAULT_SELECTED_MONTH,
    DEFAULT_SELECTED_YEAR,
    DEFAULT_SELECTED_MODEL_SINGLE,
    DEFAULT_FEATURE_ID,
  } from "./_constants";
  import { INITIAL_CONFIG } from "../_common/constants";
  import { getInitialConfig, setInitialLocation } from "../_common/helpers";

  import {
    About,
    Header,
    Help,
    Resources,
    ToolNavigation,
  } from "~/components/tools/Partials";
  import { NotificationDisplay, notifier } from "~/components/notifications";

  import ExploreData from "./_ExploreData.svelte";

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
    durationStore,
    modelSingleStore,
    monthStore,
    yearStore,
  } from "./_store";

  import { getObserved, getModels, getEnsemble, getQueryParams } from "./_data";

  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;
  export let aboutContent;

  const { page } = sapperStores();
  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  let appReady = false;
  let debug = process.env.NODE_ENV !== "production";

  // Monitor sections as they enter & leave viewport
  let currentView;
  const handleEntry = (e) => {
    const { inView, entry } = e.detail;
    if (inView) {
      currentView = entry.target.id;
    }
  };

  $: datasets = tool.datasets;
  $: resources = [...externalResources, ...relatedTools];
  $: $climvar, $scenario, $modelsStore, $locationStore, $monthStore, update();

  $: if (debug) {
    console.groupCollapsed("STORE UPDATES");
    console.table($dataStore);
    console.table($locationStore);
    console.table($modelsStore);
    console.groupEnd();
  }

  async function update() {
    if (!appReady || !$modelsStore.length) return;
    try {
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
      };

      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
      });
      params.months = $monthStore;

      isFetchingStore.set(true);

      const envelope = await getEnsemble(config, params, method);
      const observed = await getObserved(config, params, method);
      const models = await getModels(config, params, method);

      dataStore.set([...envelope, ...observed, ...models]);
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
      month: DEFAULT_SELECTED_MONTH,
      year: DEFAULT_SELECTED_YEAR,
      duration: DEFAULT_SELECTED_DURATION,
      modelSingle: DEFAULT_SELECTED_MODEL_SINGLE,
      climvar: DEFAULT_CLIMVAR,
      lng: DEFAULT_CENTER[0],
      lat: DEFAULT_CENTER[1],
      fid: DEFAULT_FEATURE_ID,
    };
    // Get initial configuration (from default or from url)
    const {
      lat,
      lng,
      boundary,
      fid,
      scenario,
      climvar,
      models,
      month,
      year,
      modelSingle,
      duration,
      imperial,
    } = getInitialConfig(query, config);
    // Set intial values for stores
    climvarStore.set(climvar);
    scenarioStore.set(scenario);
    modelsStore.set(models);
    unitsStore.set({ imperial });
    monthStore.set(+month);
    yearStore.set(year);
    modelSingleStore.set(modelSingle);
    durationStore.set(+duration);
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
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<Header
  iconPaths="{tool.icons}"
  title="{tool.title}"
  description="Explore projected changes in monthly Snow Water Equivalent, 
  a common measurement of snowpack for California."
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

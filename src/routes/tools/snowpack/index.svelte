<script context="module">
  import {
    DEFAULT_CENTER,
    DEFAULT_CLIMVAR,
    DEFAULT_SELECTED_DURATION,
    DEFAULT_SELECTED_MONTH,
    DEFAULT_SELECTED_YEAR,
    DEFAULT_SELECTED_MODEL_SINGLE,
    TOOL_SLUG,
  } from "./_constants";
  import { INITIAL_CONFIG } from "../_common/constants";
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

    // Set intitial config for tool
    let initialConfig;

    if (Object.keys(query).length) {
      // TODO: validate bookmark
      const {
        boundary,
        climvar,
        scenario,
        models,
        modelSingle,
        lat,
        lng,
        month,
        year,
        duration,
      } = query;
      initialConfig = {
        boundaryId: boundary,
        scenarioId: scenario,
        climvarId: climvar,
        modelIds: models.split(","),
        lat: +lat,
        lng: +lng,
        month: +month,
        year: +year,
        modelSingle,
        duration: +duration,
      };
    } else {
      initialConfig = {
        ...INITIAL_CONFIG,
        month: DEFAULT_SELECTED_MONTH,
        year: DEFAULT_SELECTED_YEAR,
        duration: DEFAULT_SELECTED_DURATION,
        modelSingle: DEFAULT_SELECTED_MODEL_SINGLE,
        climvarId: DEFAULT_CLIMVAR,
        lng: DEFAULT_CENTER[0],
        lat: DEFAULT_CENTER[1],
      };
    }

    return {
      initialConfig,
      tool,
      relatedTools,
      externalResources,
      helpItems,
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";

  import { getFeature, reverseGeocode } from "~/helpers/geocode";

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

  export let initialConfig;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

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
      dataStore.set(null);

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
      notifier.error("Error", error, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp({
    lat,
    lng,
    boundaryId,
    scenarioId,
    climvarId,
    modelIds,
    month,
    year,
    modelSingle,
    duration,
    imperial,
  }) {
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    monthStore.set(month);
    yearStore.set(year);
    modelSingleStore.set(modelSingle);
    durationStore.set(duration);
    const addresses = await reverseGeocode(`${lng}, ${lat}`);
    const nearest = addresses.features[0];
    const loc = await getFeature(nearest, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    return;
  }

  onMount(async () => {
    try {
      await initApp(initialConfig);
      appReady = true;
      if (debug) console.log("app ready");
      await update();
    } catch (error) {
      console.error("init error", error);
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
        <p>
          If heat-trapping emissions continue unabated, more precipitation will
          fall as rain instead of snow, and the snow that does fall will melt
          earlier, reducing the Sierra Nevada spring snowpack by as much as 70
          to 90 percent. How much snowpack will be lost depends in part on
          future precipitation patterns, the projections for which remain
          uncertain. However, even under wetter climate projections, the loss of
          snowpack would pose challenges to water managers, hamper hydropower
          generation, and nearly eliminate skiing and other snow-related
          recreational activities.
        </p>
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

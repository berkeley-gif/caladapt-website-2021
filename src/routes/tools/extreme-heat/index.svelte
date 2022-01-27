<script context="module">
  import resourcesList from "../../../../content/resources/data";
  import { TOOL_SLUG } from "./_constants";

  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
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
      await this.fetch("tools/extreme-heat.json")
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
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import {
    climvarStore,
    thresholdStore,
    thresholdListStore,
    dataStore,
  } from "./_store";
  import {
    getObserved,
    getModels,
    getQueryParams,
    get98pThreshold,
  } from "./_data";
  import { DEFAULT_THRESHOLDS } from "./_constants";

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
  $: threshParams = {
    location: $location,
    boundary: $boundary,
    climvar: $climvar,
  };
  $: extraParams = { thresh: $thresholdStore };
  $: $location, $climvar, updateDefaultThreshold();
  $: $scenario, $modelsStore, $thresholdStore, update();

  async function getDefaultThreshold({ location, boundary, climvar }) {
    const { params } = getQueryParams({
      location,
      boundary,
      imperial: true,
    });
    const thresh98p = await get98pThreshold(climvar, params);
    return thresh98p;
  }

  async function updateDefaultThreshold() {
    const { location, boundary, climvar } = threshParams;
    if (!location || !boundary) return;
    isFetchingStore.set(true);
    const thresh98p = await getDefaultThreshold({
      location,
      boundary,
      climvar,
    });
    thresholdListStore.reset(thresh98p, "98th Percentile");
    thresholdStore.set(thresh98p);
    isFetchingStore.set(false);
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
      dataStore.updateData([...observed, ...modelsData]);
    } catch (err) {
      console.log("update error", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp() {
    const { query } = $page;
    // Get initial configuration (from default or from url)
    const { lat, lng, boundary, scenario, climvar, models, imperial } =
      getInitialConfig(query);
    // Set intial values for stores
    climvarStore.set(climvar);
    scenarioStore.set(scenario);
    modelsStore.set(models);
    unitsStore.set({ imperial });
    const loc = await setInitialLocation(+lng, +lat, boundary);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundary);
    const thresh98p = await getDefaultThreshold({
      location: loc,
      boundary: { id: boundary },
      climvar: { id: climvar },
    });
    thresholdListStore.add(thresh98p, "98th Percentile");
    thresholdStore.set(thresh98p);
    // Populate list with additional frequently used values
    DEFAULT_THRESHOLDS.forEach((val) => {
      thresholdListStore.add(val);
    });
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
  iconPaths="{tool.icons}"
  title="{tool.title}"
  description="For most areas around the state, the climate models project a 
  significant rise in the number of days exceeding what is now considered 
  extremely hot for the given area. Explore how the frequency and timing of 
  extreme heat days and warm nights is expected to change under different 
  emission scenarios for your location."
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

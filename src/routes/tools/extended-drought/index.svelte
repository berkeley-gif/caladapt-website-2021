<script context="module">
  import {
    DEFAULT_SELECTED_SCENARIO,
    DEFAULT_SELECTED_PERIOD,
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
      const { boundary, climvar, scenario, lat, lng, period } = query;
      initialConfig = {
        boundaryId: boundary,
        scenarioId: scenario,
        climvarId: climvar,
        lat: +lat,
        lng: +lng,
        period,
      };
    } else {
      initialConfig = {
        ...INITIAL_CONFIG,
        scenarioId: DEFAULT_SELECTED_SCENARIO,
        period: DEFAULT_SELECTED_PERIOD,
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
    unitsStore,
    locationStore,
    datasetStore,
    isFetchingStore,
    dataStore,
  } from "../_common/stores";
  import { climvarStore, periodStore, scenarioStore } from "./_store";

  import { getObserved, getModels, getEnsemble, getQueryParams } from "./_data";
  import { DEFAULT_MODEL } from "./_constants";

  export let initialConfig;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { period } = periodStore;

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
  $: $climvar, $scenario, $locationStore, $periodStore, update();

  $: if (debug) {
    console.groupCollapsed("STORE UPDATES");
    console.table($dataStore);
    console.table($locationStore);
    console.groupEnd();
  }

  async function update() {
    if (!appReady) return;
    try {
      dataStore.set(null);

      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        periodId: $periodStore,
        modelIds: [DEFAULT_MODEL],
      };

      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
      });
      params.freq = $period.freq;

      isFetchingStore.set(true);
      const envelope = await getEnsemble(config, params, method);
      const observed = await getObserved(config, params, method);
      const models = await getModels(config, params, method);
      dataStore.set([...envelope, ...observed, ...models]);
    } catch (error) {
      console.error("updateData", error);
      dataStore.set([]);
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
    period,
    imperial,
  }) {
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    unitsStore.set({ imperial });
    periodStore.set(period);
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

<Header iconPaths="{tool.icons}" title="{tool.title}">
  <div slot="description">
    <p class="lead">
      Explore projections of temperature, precipitation and a set of VIC
      variables from two 30 year drought periods.
    </p>
  </div>
</Header>

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
          California has a highly variable climate and is susceptible to dry
          spells. Recent research suggests that extended drought occurrence
          (“mega-drought”) could become more pervasive in future decades. This
          tool explores data for two 20-year drought scenarios derived from LOCA
          downscaled meteorological and hydrological simulations: one for the
          earlier part of the 21st century, and one for the latter part
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

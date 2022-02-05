<script context="module">
  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  import resourcesList from "content/resources/data";
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
      await this.fetch("tools/streamflow.json")
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
  import { getStationById } from "~/helpers/geocode";
  import { logException } from "~/helpers/logging";
  import { INITIAL_CONFIG } from "../_common/constants";
  import { getInitialConfig } from "../_common/helpers";
  import {
    DEFAULT_STATION_ID,
    DEFAULT_CLIMATE_VARIABLE,
    DEFAULT_CLIMATE_INDICATOR,
  } from "./_constants";

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
    dataStore,
  } from "../_common/stores";
  import { climvarStore, indicatorStore } from "./_store";
  import { getObserved, getModels, getQueryParams } from "./_data";
  import { getBasinCenter } from "./_helpers";

  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;
  export let aboutContent;

  // Derived stores
  const { page } = sapperStores();
  const { location } = locationStore;
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

  /**
   * The streamflow data request is returned from the API as monthly timeseries spanning 151 years for
   * GCMS (1950-2100) and 95 years for Observed (1921-2005).
   * Both indicators (Total Annual for selected months) & (Monthly Average for selected period) are
   * calculated by filtering and aggregating the monthly timeseries in different ways. New data is fetched
   * from the API only if the user changes the location, scenario or list of models.
   **/
  $: $scenario, $modelsStore, $location, update();

  async function update() {
    if (!appReady) return;
    if ($modelsStore.length === 0) return;
    try {
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
        stationId: $location.properties.symbol,
      };
      const { params, method } = getQueryParams();
      isFetchingStore.set(true);
      const observed = await getObserved(config, params, method);
      const modelsData = await getModels(config, params, method);
      dataStore.set([...observed, ...modelsData]);
    } catch (err) {
      console.log("updateData", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp() {
    const { query } = $page;
    // Default configuration
    const config = {
      ...INITIAL_CONFIG,
      climvar: DEFAULT_CLIMATE_VARIABLE,
      indicator: DEFAULT_CLIMATE_INDICATOR,
      station: DEFAULT_STATION_ID,
    };
    const { station, scenario, indicator, climvar, models, imperial } =
      getInitialConfig(query, config);
    climvarStore.set(climvar);
    indicatorStore.set(indicator);
    scenarioStore.set(scenario);
    modelsStore.set(models);
    unitsStore.set({ imperial });
    // Set intial station
    const feature = await getStationById(station, "evtlocations");
    // Feature in API is a polygon (basin), but for purposes of this tool
    // we need to treat it as a station
    locationStore.updateLocation(getBasinCenter(feature));
    return;
  }

  onMount(() => {
    initApp()
      .then(() => {
        appReady = true;
        console.log("app ready");
      })
      .catch((error) => {
        console.log("init error", error);
        logException(error);
        dataStore.set([]);
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
  description="Explore projected changes in monthly streamflow at 11 locations in California."
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

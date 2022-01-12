<script context="module">
  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  import resourcesList from "../../../../content/resources/data";
  import {
    DEFAULT_STATION_ID,
    DEFAULT_CLIMATE_VARIABLE,
    TOOL_SLUG,
  } from "./_constants";

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
    if (Object.keys(query).length > 0) {
      // TODO: validate bookmark
      const { climvar, station, imperial } = query;
      initialConfig = {
        stationId: station,
        climvarId: climvar,
        imperial: imperial === "true" ? true : false,
      };
    } else {
      initialConfig = {
        scenarioId: "rcp45",
        climvarId: DEFAULT_CLIMATE_VARIABLE,
        modelIds: ["HadGEM2-ES", "CNRM-CM5", "CanESM2", "MIROC5"],
        stationId: DEFAULT_STATION_ID,
        imperial: true,
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
  import getCenter from "@turf/center";

  // Helpers
  import { getStationById } from "~/helpers/geocode";
  import { logException } from "~/helpers/logging";

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
  import { climvarStore } from "./_store";
  import { getObserved, getModels, getEnsemble, getQueryParams } from "./_data";

  export let initialConfig;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  // Derived stores
  const { location } = locationStore;
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
  $: $climvar, $scenario, $modelsStore, $location, update();

  async function update() {
    if (!appReady) return;
    if ($modelsStore.length === 0) return;
    try {
      /*      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
      };
      const isRate = $climvarStore === "pr" ? true : false;
      const { params, method } = getQueryParams({
        location: $location,
        imperial: true,
      });
      isFetchingStore.set(true);
      const envelope = await getEnsemble(config, params, method, isRate);
      const observed = await getObserved(config, params, method, isRate);
      const modelsData = await getModels(config, params, method, isRate);
      dataStore.set([...envelope, ...observed, ...modelsData]);*/
    } catch (err) {
      console.log("updateData", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp(config) {
    const { stationId, scenarioId, climvarId, modelIds, imperial } = config;
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    // Set intial station
    const station = await getStationById(stationId, "evtlocations", {
      srs: 4326,
    });
    console.log("station", station);
    const point = getCenter(station.geometry);
    const newStation = { ...station, geometry: point.geometry };
    console.log(newStation);
    locationStore.updateLocation(newStation);
    return;
  }

  onMount(() => {
    initApp(initialConfig)
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
        <p>
          As temperatures increase and snowpack diminishes, streamflows are also
          projected to shift in their timing. Of particular concern in
          California is the spring snowmelt, which feeds streamflow when it is
          needed most for irrigation and energy purposes. This tool enables the
          user to explore the timing and magnitude of streamflow in selected
          months of the water-year, which runs from October 1 to September 30
          (i.e., water year 2018 runs from October 1, 2017 to September 30,
          2018).
        </p>
        <p>
          Because California’s major watersheds have been altered by large-scale
          projects such as dams and diversions, which enable human management of
          water to meet needs related to agriculture, urban uses, energy, and
          ecology, it would be misleading to do a straight comparison of
          “observed” streamflows at a given point. This obstacle is overcome
          through calculation of natural or “unimpaired” flows, which are what
          would occur if flows were not subjected to storage in reservoirs or to
          diversions (e.g., irrigation, power generation, water supply).
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

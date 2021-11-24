<script context="module">
  import { DEFAULT_INITIAL_CONFIG, TOOL_SLUG } from "./_constants";
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
        simulation,
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
        simulation,
        imperial: false,
      };
    } else {
      initialConfig = DEFAULT_INITIAL_CONFIG;
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
  import { logStores } from "~/helpers/utilities";

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
    simulationStore,
    modelSingleStore,
    monthStore,
    pctndStore,
    stateBoundaryStore,
    yearStore,
  } from "./_store";

  import { getStateBoundary, getModels, getQueryParams } from "./_data";
  import { getAvgPctNoData } from "./_helpers";

  export let initialConfig;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  let appReady = false;

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
  $: $climvar,
    $scenario,
    $modelsStore,
    $locationStore,
    $monthStore,
    $simulationStore,
    update();

  $: if (process.env.NODE_ENV !== "production") {
    logStores(
      climvarStore,
      monthStore,
      pctndStore,
      simulationStore,
      locationStore,
      modelsStore,
      modelSingleStore,
      dataStore
    );
  }

  async function update() {
    if (!appReady || !$modelsStore.length) return;
    try {
      dataStore.set(null);

      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
        simulation: $simulationStore,
        monthNumber: $monthStore,
      };

      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        simulation: $simulationStore,
        monthNumber: $monthStore,
        imperial: $unitsStore.imperial,
        climvar: $climvarStore,
      });

      isFetchingStore.set(true);
      const models = await getModels(config, params, method);
      dataStore.set(models);
      pctndStore.set(getAvgPctNoData($dataStore));
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
    simulation,
    imperial,
  }) {
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    monthStore.set(month);
    yearStore.set(year);
    modelSingleStore.set(modelSingle);
    simulationStore.set(simulation);

    const addresses = await reverseGeocode(`${lng}, ${lat}`);
    const nearest = addresses.features[0];
    const loc = await getFeature(nearest, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);

    const stateBoundary = await getStateBoundary();
    if (stateBoundary && stateBoundary.geometry) {
      stateBoundaryStore.set(stateBoundary);
    } else {
      console.warn("stateBoundary geojson failed to load");
    }

    return;
  }

  onMount(async () => {
    try {
      await initApp(initialConfig);
      appReady = true;
      console.log("app ready");
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
  description="Explore wildfire scenario projections for area burned and 
    estimated decadal wildfire probabilities for California."
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
          The frequency, severity and impacts of wildfire are sensitive to
          climate change as well as many other factors, including development
          patterns, temperature increases, wind patterns, precipitation change
          and pest infestations. Therefore, it is more difficult to project
          exactly where and how fires will burn. Instead, climate models
          estimate increased risk to wildfires.
        </p>
        <p>
          The Annual or Monthly Average Area Burned can help inform at a high
          level if wildfire activity is likely to increase. However, this
          information is not complete - many regions across the state have no
          projections (such as regions outside combined fire state and federal
          protection responsibility areas), and more detailed analyses and
          projections are needed for local decision-making.
        </p>
        <p>
          These projections are most robust for the Sierra Nevada given model
          inputs. However, as we have seen in recent years, much of California
          can expect an increased risk of wildfire, with a wildfire season that
          starts earlier, runs longer, and features more extreme fire events.
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

<script context="module">
  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  import resourcesList from "../../../../content/resources/data";
  import { INITIAL_CONFIG } from "../_common/constants";
  export async function preload({ query }) {
    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const tool = toolsList.find((d) => d.slug === "annual-averages");
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
      const { boundary, climvar, scenario, models, lat, lng } = query;
      initialConfig = {
        boundaryId: boundary,
        scenarioId: scenario,
        climvarId: climvar,
        modelIds: models,
        lat: +lat,
        lng: +lng,
      };
    } else {
      initialConfig = {
        ...INITIAL_CONFIG,
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

  // Helpers
  import { getFeature, reverseGeocode } from "~/helpers/geocode";

  // Components
  import ExploreData from "./ExploreData.svelte";
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
  } from "../_common/stores";
  import { climvarStore } from "./_store";
  import { getObserved, getModels, getEnvelope, getQueryParams } from "./_data";

  export let initialConfig;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  // Derived stores
  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { models } = modelsStore;

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
  $: $climvar, $scenario, $models, $location, update();

  async function update() {
    if (!appReady) return;
    if ($models.length === 0) return;
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
      const envelope = await getEnvelope(config, params, method);
      const observed = await getObserved(config, params, method);
      const modelsData = await getModels(config, params, method);
      dataStore.set([...envelope, ...observed, ...modelsData]);
    } catch (err) {
      // TODO: notify user of error
      console.log("updateData", err);
      notifier.error("Error", err, 2000);
    }
  }

  async function initApp(config) {
    const { lat, lng, boundaryId, scenarioId, climvarId, modelIds, imperial } =
      config;
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    const addresses = await reverseGeocode(`${lng}, ${lat}`);
    const nearest = addresses.features[0];
    const loc = await getFeature(nearest, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    return;
  }

  onMount(() => {
    initApp(initialConfig)
      .then(() => {
        appReady = true;
        console.log("app ready");
        update();
      })
      .catch((error) => {
        console.log("init error", error);
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

<Header iconPaths="{tool.icons}" title="{tool.title}">
  <div slot="description">
    <p class="lead">
      Explore projected changes in annual average Maximum Temperature, Minimum
      Temperature and Precipitation through end of this century for California.
    </p>
  </div>
</Header>

<ToolNavigation href="{`/tools/${tool.slug}`}" />

<div id="explore" use:inview="{{}}" on:enter="{handleEntry}">
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
          Overall temperatures are projected to rise substantially throughout
          this century. These projections differ depending on the time of year
          and the type of measurement (highs vs. lows), all of which have
          different potential effects to the state's ecosystem health,
          agricultural production, water use and availability, and energy
          demand. On average, the projections show little change in total annual
          precipitation in California. Furthermore, among several models,
          precipitation projections do not show a consistent trend during the
          next century. The Mediterranean seasonal precipitation pattern is
          expected to continue, with most precipitation falling during winter
          from North Pacific storms. However, even modest changes would have a
          significant impact because California ecosystems are conditioned to
          historical precipitation levels and water resources are nearly fully
          utilized.
        </p>
        <p>
          With this tool you can explore projections of annually averaged
          maximum temperature, minimum temperature and precipitation. These
          climate projections have been downscaled from global climate models
          from the <a href="https://pcmdi.llnl.gov/mips/cmip5/" target="_blank"
            >CMIP5</a
          >
          archive, using the
          <a href="http://loca.ucsd.edu/what-is-loca/" target="_blank"
            >Localized Constructed Analogs</a
          > (LOCA) statistical technique developed by Scripps Institution Of Oceanography.
          LOCA is a statistical downscaling technique that uses past history to add
          improved fine-scale detail to global climate models.
        </p>
        <p>
          On average, the projections show little change in total annual
          precipitation in California. Furthermore, among several models,
          precipitation projections do not show a consistent trend during the
          next century. However, even modest changes would have a significant
          impact because California ecosystems are conditioned to historical
          precipitation levels and water resources are nearly fully utilized.
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

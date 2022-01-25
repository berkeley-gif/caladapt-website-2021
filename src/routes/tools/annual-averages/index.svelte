<script context="module">
  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  import resourcesList from "../../../../content/resources/data";

  export async function preload() {
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

    return {
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
  import { stores as sapperStores } from "@sapper/app";

  // Helpers
  import { getFeature, reverseGeocode } from "~/helpers/geocode";
  import { logException } from "~/helpers/logging";
  import { getInitialConfig } from "../_common/helpers";

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

  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

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
  $: $climvar, $scenario, $modelsStore, $location, update();

  async function update() {
    if (!appReady) return;
    if ($modelsStore.length === 0) return;
    try {
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
      };
      const isRate = $climvarStore === "pr" ? true : false;
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
      });
      isFetchingStore.set(true);
      const envelope = await getEnsemble(config, params, method, isRate);
      const observed = await getObserved(config, params, method, isRate);
      const modelsData = await getModels(config, params, method, isRate);
      dataStore.set([...envelope, ...observed, ...modelsData]);
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
    // Get initial configuration (from default or from url)
    const { lat, lng, boundary, scenario, climvar, models, imperial } =
      getInitialConfig(query);
    // Set intial values for stores
    climvarStore.set(climvar);
    scenarioStore.set(scenario);
    modelsStore.set(models);
    unitsStore.set({ imperial });
    const addresses = await reverseGeocode(`${lng}, ${lat}`);
    const nearest = addresses.features[0];
    const loc = await getFeature(nearest, boundary);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundary);
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
  description="Explore projected changes in annual average Maximum Temperature, 
    Minimum Temperature and Precipitation through end of this century for 
    California."
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

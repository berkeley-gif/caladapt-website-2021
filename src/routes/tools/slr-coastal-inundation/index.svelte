<script context="module">
  import { DEFAULT_INITIAL_CONFIG } from "./_constants";
  import resourcesList from "content/resources/data";

  export async function preload({ query, path }) {
    const slug = path.split("/")[2];
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    const tool = toolsList.find((d) => d.slug === slug);
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

    let initialConfig = {
      ...DEFAULT_INITIAL_CONFIG,
    };

    if (Object.keys(query).length) {
      initialConfig = {
        ...initialConfig,
        ...query,
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

  import { DL_Cosmos, DL_Calflod5m, DL_Calflod50m } from "./_constants";
  import { getRasterMetaData, toBBoxPolygon } from "./_data";

  import {
    locationStore,
    isFetchingStore,
    datasetStore,
    unitsStore,
  } from "../_common/stores";
  import {
    floodScenarioStore,
    timeFrameStore,
    dataLayersStore,
    mapBBoxStore,
    rasterMetaDataStore,
    dataLayersAugmentedStore,
  } from "./_store";

  export let initialConfig;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  let appReady = false;

  // Monitor sections as they enter & leave viewport
  let currentView;
  const handleEntry = (e) => {
    const { inView, entry } = e.detail;
    if (inView) {
      currentView = entry.target.id;
    }
  };

  const { location, boundary } = locationStore;
  const { [`dl_${DL_Calflod50m}`]: dl_Calflod50m } = dataLayersStore;
  const { bbox } = mapBBoxStore;
  const { tfTileLabel } = timeFrameStore;

  $: datasets = tool.datasets;
  $: resources = [...externalResources, ...relatedTools];

  // temporary handle enabling & disabling data layers
  $: if ($floodScenarioStore === "med") {
    dataLayersStore.update({
      id: DL_Calflod50m,
      checked: false,
      disabled: true,
    });
  }
  $: if ($floodScenarioStore !== "med" && $dl_Calflod50m.disabled) {
    dataLayersStore.update({
      id: DL_Calflod50m,
      disabled: false,
    });
  }

  $: update($bbox, $floodScenarioStore, $tfTileLabel);

  if (process.env.NODE_ENV !== "production") {
    logStores(
      floodScenarioStore,
      location,
      boundary,
      timeFrameStore,
      dataLayersStore,
      isFetchingStore,
      datasetStore,
      mapBBoxStore,
      rasterMetaDataStore,
      dataLayersAugmentedStore
    );
  }

  async function update(bbox, scenario, timeFrame) {
    if (!appReady || !bbox) return;
    const sources = [DL_Cosmos, DL_Calflod5m, DL_Calflod50m];
    const bboxGeojson = toBBoxPolygon(bbox);
    const bboxGeom = JSON.stringify(bboxGeojson.geometry);
    try {
      (
        await Promise.all(
          sources.map((source) =>
            getRasterMetaData(scenario, source, timeFrame, bboxGeom)
          )
        )
      ).forEach(({ results }, index) => {
        if (Array.isArray(results) && results.length) {
          // NOTE: calflod3d 50m won't update until slug names are changed
          rasterMetaDataStore.update(sources[index], results);
        } else {
          rasterMetaDataStore.update(sources[index], []);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function initApp({
    lat,
    lng,
    boundaryId,
    imperial,
    floodScenario,
    timeFrame,
  }) {
    floodScenarioStore.set(floodScenario);
    timeFrameStore.set(timeFrame);
    unitsStore.set({ imperial });
    const addresses = await reverseGeocode(`${lng}, ${lat}`);
    const nearest = addresses.features[0];
    const loc = await getFeature(nearest, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
  }

  onMount(async () => {
    try {
      await initApp(initialConfig);
      appReady = true;
      await update();
      console.log("app ready");
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
  description="Explore projected water levels associated with Sea Level Rise and
   a near 100-year storm scenario along the California coast and San Francisco
   Bay from two different models."
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
        <p>To do...</p>
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

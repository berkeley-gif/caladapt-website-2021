<script context="module">
  import resourcesList from "content/resources/data";

  export async function preload({ path }) {
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

    const { aboutContent, learnMoreContent } = await (
      await this.fetch("tools/slr-coastal-inundation.json")
    ).json();

    return {
      tool,
      relatedTools,
      externalResources,
      helpItems,
      aboutContent,
      learnMoreContent,
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";
  import { stores as sapperStores } from "@sapper/app";

  import { logStores } from "~/helpers/utilities";
  import { logException } from "~/helpers/logging";

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
  import { getRasterMetaData } from "./_data";

  import { isFetchingStore } from "../_common/stores";
  import {
    floodScenarioStore,
    timeFrameStore,
    mapViewStore,
    dataLayersStore,
    rasterMetaDataStore,
    dataLayersAugmentedStore,
  } from "./_store";
  import { getInitialConfig } from "./_helpers";

  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;
  export let aboutContent;
  export let learnMoreContent;

  let appReady = false;
  let baseMapStyle;

  // Monitor sections as they enter & leave viewport
  let currentView;
  const handleEntry = (e) => {
    const { inView, entry } = e.detail;
    if (inView) {
      currentView = entry.target.id;
    }
  };

  const { page } = sapperStores();
  const { bbox } = mapViewStore;
  const { tfTileLabel } = timeFrameStore;

  $: datasets = tool.datasets;
  $: resources = [...externalResources, ...relatedTools];
  $: update($bbox, $floodScenarioStore, $tfTileLabel);

  // log changes to stores when in development
  if (process.env.NODE_ENV !== "production") {
    logStores(
      isFetchingStore,
      floodScenarioStore,
      timeFrameStore,
      isFetchingStore,
      mapViewStore,
      dataLayersAugmentedStore
    );
  }

  async function update(bbox, scenario, timeFrame) {
    if (!appReady || !bbox) return;
    const sources = [DL_Cosmos, DL_Calflod5m, DL_Calflod50m];
    isFetchingStore.set(true);
    try {
      (
        await Promise.all(
          sources.map((source) =>
            getRasterMetaData(scenario, source, timeFrame, bbox)
          )
        )
      ).forEach(({ results }, index) => {
        if (Array.isArray(results) && results.length) {
          rasterMetaDataStore.update(sources[index], results);
        } else {
          rasterMetaDataStore.update(sources[index], []);
        }
      });
    } catch (error) {
      console.error(error);
      logException(error);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp() {
    const { query } = $page;
    const {
      lat,
      lng,
      zoom,
      mapStyle,
      dataLayers,
      floodScenario,
      timeFrame,
      bbox,
    } = getInitialConfig(query);
    baseMapStyle = mapStyle;
    floodScenarioStore.set(floodScenario);
    timeFrameStore.set(timeFrame);
    dataLayersStore.set(dataLayers);
    mapViewStore.set({ lat, lng, zoom, bbox });
  }

  onMount(async () => {
    try {
      await initApp();
      appReady = true;
      await update();
      console.log("app ready");
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
  description="Explore projected water levels associated with Sea Level Rise and
   a near 100-year storm scenario along the California coast and San Francisco
   Bay from two different models."
/>

<ToolNavigation href="{`/tools/${tool.slug}`}" />

<div id="explore-data" use:inview="{{}}" on:enter="{handleEntry}">
  {#if appReady}
    <ExploreData
      learnMoreContent="{learnMoreContent}"
      mapStyle="{baseMapStyle}"
    />
  {:else}
    <Loading />
  {/if}
</div>

<div class="bx--grid">
  <div id="about" use:inview="{{}}" on:enter="{handleEntry}">
    <About datasets="{datasets}">
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

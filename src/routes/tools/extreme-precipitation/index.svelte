<script context="module">
  import resourcesList from "../../../../content/resources/data";
  import { TOOL_SLUG } from "./_constants";

  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
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

    const { aboutContent, learnMoreContent, notificationText } = await (
      await this.fetch("tools/extreme-precipitation.json")
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
  import { format } from "d3-format";
  import { stores as sapperStores } from "@sapper/app";

  // Helpers
  import { logException } from "~/helpers/logging";
  import {
    DEFAULT_ROLLING_FUNCTION,
    DEFAULT_THRESHOLD_PRECISION,
    DEFAULT_THRESHOLD_TYPE,
    DEFAULT_INITIAL_CONFIG,
  } from "./_constants";
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
    thresholdTypeStore,
    durationStore,
    returnPeriodStore,
    dataStore,
    aggregateFnStore,
  } from "./_store";
  import {
    getObserved,
    getModels,
    getIntensityData,
    getQueryParams,
    getThreshold,
  } from "./_data";

  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;
  export let aboutContent;
  export let learnMoreContent;

  // Derived stores
  const { page } = sapperStores();
  const { location, boundary } = locationStore;
  const { scenario } = scenarioStore;
  const { intensity, events } = dataStore;

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

  const formatThresh = (value) =>
    +format(`.${DEFAULT_THRESHOLD_PRECISION}f`)(value);

  // Reactive props
  $: datasets = tool.datasets;
  $: resources = [...externalResources, ...relatedTools];

  // do not add param if event duration is 1
  $: duration = $durationStore === 1 ? null : $durationStore;

  // params for fetching peak over threshold data
  $: potParams = {
    // threshold value is same for all intervals
    intervals: $returnPeriodStore,
    ...(duration && { duration }),
  };

  // params for fetching events
  $: eventParams = {
    thresh: $thresholdStore,
    ...(duration && { window: duration }),
    rolling: DEFAULT_ROLLING_FUNCTION,
  };

  $: $returnPeriodStore, updateIntensity();
  $: $aggregateFnStore,
    $thresholdTypeStore,
    $location,
    $durationStore,
    updateThreshold();
  $: $modelsStore, $scenarioStore, $thresholdStore, update();

  async function updateThreshold() {
    if (!appReady) return;
    try {
      isFetchingStore.set(true);
      const { params } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
        stat: $aggregateFnStore,
      });
      const pct =
        $thresholdTypeStore === DEFAULT_THRESHOLD_TYPE
          ? null
          : $thresholdTypeStore;
      const thresh = await getThreshold({
        ...params,
        ...potParams,
        ...(pct && { pct }),
      });
      thresholdStore.set(formatThresh(thresh));
    } catch (err) {
      console.log("update threshold error", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function updateIntensity() {
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
        stat: $aggregateFnStore,
      });
      const pct =
        $thresholdTypeStore === DEFAULT_THRESHOLD_TYPE
          ? null
          : $thresholdTypeStore;
      isFetchingStore.set(true);
      const intensityData = await getIntensityData(
        config,
        { ...params, ...potParams, ...(pct && { pct }) },
        method
      );
      dataStore.setIntensity(intensityData);
    } catch (err) {
      console.log("update intensity error", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function update() {
    if (!appReady || !$modelsStore.length) return;
    try {
      await updateIntensity();
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
      };
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        stat: $aggregateFnStore,
      });
      isFetchingStore.set(true);
      const observed = await getObserved(
        config,
        { ...params, ...eventParams },
        method
      );
      const modelsData = await getModels(
        config,
        { ...params, ...eventParams },
        method
      );
      dataStore.setEvents([...observed, ...modelsData]);
    } catch (err) {
      console.log("update events error", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp() {
    const { query } = $page;
    // Get initial configuration (from default or from url)
    const {
      lat,
      lng,
      boundary,
      scenario,
      models,
      imperial,
      duration,
      threshType,
    } = getInitialConfig(query, DEFAULT_INITIAL_CONFIG);
    // Set intial values for stores
    scenarioStore.set(scenario);
    modelsStore.set(models);
    unitsStore.set({ imperial });
    durationStore.set(+duration);
    thresholdTypeStore.set(threshType);
    const loc = await setInitialLocation(+lng, +lat, boundary);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundary);
    const { params } = getQueryParams({
      location: loc,
      boundary: { id: boundary },
      imperial: true,
    });
    const intervals = $returnPeriodStore;
    const pct = threshType === DEFAULT_THRESHOLD_TYPE ? null : threshType;
    const durationNum = +duration === 1 ? null : +duration;
    const thresh = await getThreshold({
      ...params,
      intervals,
      ...(durationNum && { duration: durationNum }),
      ...(pct && { pct }),
    });
    thresholdStore.set(formatThresh(thresh));
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
  description="An extreme weather event is an occurrence that is significantly different from typical weather at a specific location and time of year. Extreme precipitation events can lead to flooding, mudslides and other damaging events. In a changing climate the intensity and frequency of such events will likely change across California. This tool visualizes how climate models predict extreme precipitation events will change over the 21st century. "
/>

<ToolNavigation href="{`/tools/${tool.slug}`}" />

<div id="explore-data" use:inview="{{}}" on:enter="{handleEntry}">
  {#if appReady}
    <ExploreData learnMoreContent="{learnMoreContent}" />
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

<script context="module">
  import resourcesList from "../../../../content/resources/data";
  import { INITIAL_CONFIG } from "../_common/constants";
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

    // Set intitial config for tool
    let initialConfig;

    if (Object.keys(query).length > 0) {
      // TODO: validate bookmark
      const { boundary, climvar, scenario, models, lat, lng } = query;
      initialConfig = {
        boundaryId: boundary,
        scenarioId: scenario,
        climvarId: climvar,
        modelIds: models.split(","),
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

  export let initialConfig;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  // Derived stores
  const { location, boundary } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;

  // Local props
  let initReady = false;
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
    if (!initReady || !appReady) return;
    if ($modelsStore.length === 0) return;
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

  async function initApp({
    lat,
    lng,
    boundaryId,
    scenarioId,
    climvarId,
    modelIds,
    imperial,
  }) {
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    const addresses = await reverseGeocode(`${lng}, ${lat}`);
    const nearest = addresses.features[0];
    const loc = await getFeature(nearest, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    const thresh98p = await getDefaultThreshold({
      location: loc,
      boundary: { id: boundaryId },
      climvar: { id: climvarId },
    });
    thresholdListStore.add(thresh98p, "98th Percentile");
    thresholdStore.set(thresh98p);
    // Populate list with additional frequently used values
    DEFAULT_THRESHOLDS.forEach((val) => {
      thresholdListStore.add(val);
    });
  }

  onMount(() => {
    initApp(initialConfig)
      .then(() => {
        initReady = true;
      })
      .catch((error) => {
        console.log("init error", error);
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
  {#if initReady}
    <ExploreData
      on:ready="{() => {
        appReady = true;
        update();
      }}"
    />
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
          With this tool you can explore how the frequency and timing of extreme
          heat days and warm nights is expected to change under different
          emission scenarios. This data is derived from daily climate
          projections which have been downscaled from global climate models from
          the <a
            href="https://esgf-node.llnl.gov/projects/cmip5/"
            target="_blank">CMIP5</a
          >
          archive, using the
          <a href="http://loca.ucsd.edu/what-is-loca/" target="_blank"
            >Localized Constructed Analogs</a
          > (LOCA) statistical technique developed by Scripps Institution Of Oceanography.
          LOCA is a statistical downscaling technique that uses past history to add
          improved fine-scale detail to global climate models.
        </p>
        <p>
          As the climate changes in California, one of the more serious threats
          to the public health of Californians will stem primarily from the
          higher frequency of extreme conditions, principally more frequent,
          more intense, and longer heat waves. An increase in heat waves may
          increase the risk of heat stroke and dehydration. Find out how you can
          become better prepared and more resilient to increasing temperature
          and extreme heat events at <a
            href="https://healthyplacesindex.org/wp-content/uploads/2018/02/2013_cph_preparing_california_for_extreme_eat.pdf"
            target="_blank">Preparing California for Extreme Heat</a
          >, a report put together by California Environmental Protection Agency
          (<a href="http://www.calepa.ca.gov/" target="_blank">CalEPA</a>) and
          the California Department of Public Health (<a
            href="http://www.cdph.ca.gov/"
            target="_blank">CDPH</a
          >).
        </p>
        <p class="h4">What is an extreme heat day?</p>
        <p>
          For purposes of this tool, an extreme heat day or warm night is
          defined as a day in a year when the daily maximum/minimum temperature
          exceeds the 98th historical percentile of daily maximum/minimum
          temperatures based on observed historical data from 1961–1990 between
          April and October. Users have the option of setting a different value
          for threshold temperature or reset back to the 98th percentile value.
        </p>

        <p class="h4">What is a warm night?</p>
        <p>
          For purposes of this tool, a warm night is defined as a day in April
          through October when the daily minimum temperature exceeds the 98th
          historical percentile of daily minimum temperatures based on observed
          data from 1961–1990. Users have the option of setting a different
          value for threshold temperature or reset back to the 98th percentile
          value.
        </p>

        <p class="h4">What is a heat wave?</p>
        <p>
          Heat waves are characterized as durations of sustained, extreme heat,
          although there is no universal definition of a heat wave. For purposes
          of this tool, a heat wave is defined as a duration of 4 consecutive
          extreme heat days or warm nights when the daily maximum/minimum
          temperature is above the extreme heat threshold. Each 4 day/night
          duration is counted, so that if extreme temperatures persist for 10
          consecutive days/nights, it counts as 2 Heat Waves. Users have the
          option of choosing a different value for number of consecutive
          days/nights.
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

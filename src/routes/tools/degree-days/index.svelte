<script context="module">
  import resourcesList from "content/resources/data";
  import { INITIAL_CONFIG } from "../_common/constants";
  import {
    DEFAULT_CLIMATE_INDICATOR,
    DEFAULT_FREQUENCY_CODE,
    DEFAULT_SELECTED_MONTHS,
    DEFAULT_THRESHOLD_DEGREES,
    TOOL_SLUG,
  } from "./_constants";

  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  export async function preload({ query }) {
    // Get tools metadata
    const toolsList = (await (await this.fetch("tools.json")).json()).tools;

    // Filter metadata for current tool
    const tool = toolsList.find(({ slug }) => slug === TOOL_SLUG);
    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));

    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    // Get help categories
    const help = await (await this.fetch("help.json")).json();
    const helpItems = help.filter(({ slug }) =>
      ["get-started", "faqs"].includes(slug)
    );

    // Set intitial config for tool
    let initialConfig;

    if (Object.keys(query).length) {
      // TODO: validate bookmark
      const {
        boundary,
        climvar,
        frequency,
        indicator,
        models,
        months,
        scenario,
        threshold,
        lat,
        lng,
      } = query;
      initialConfig = {
        boundaryId: boundary,
        scenarioId: scenario,
        climvarId: climvar,
        indicatorId: indicator,
        frequency,
        months: months
          ? months.split(",").map((d) => +d)
          : DEFAULT_SELECTED_MONTHS,
        threshold,
        modelIds: models.split(","),
        lat: +lat,
        lng: +lng,
      };
    } else {
      initialConfig = {
        ...INITIAL_CONFIG,
        indicatorId: DEFAULT_CLIMATE_INDICATOR,
        frequency: DEFAULT_FREQUENCY_CODE,
        months: DEFAULT_SELECTED_MONTHS,
        threshold: DEFAULT_THRESHOLD_DEGREES,
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
  import {
    climvarStore,
    indicatorsStore,
    thresholdStore,
    frequencyStore,
    selectedMonthsStore,
  } from "./_store";
  import { getObserved, getModels, getQueryParams } from "./_data";

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
  $: extraParams = { freq: $frequencyStore, thresh: $thresholdStore };
  $: $climvar,
    $scenario,
    $modelsStore,
    $location,
    $indicatorsStore,
    $thresholdStore,
    $frequencyStore,
    $selectedMonthsStore,
    update();

  async function update() {
    if (!appReady || !$modelsStore.length) return;
    try {
      dataStore.set(null);
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
        indicatorId: $indicatorsStore,
        monthIds:
          $frequencyStore === "M" ? new Set($selectedMonthsStore) : null,
      };
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
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

      dataStore.set([...observed, ...modelsData]);
    } catch (error) {
      isFetchingStore.set(false);
      console.error("updateData", error);
      notifier.error("Error", error, 2000);
    }
  }

  async function initApp({
    lat,
    lng,
    boundaryId,
    indicatorId,
    scenarioId,
    climvarId,
    modelIds,
    months,
    imperial,
    threshold,
    frequency,
  }) {
    climvarStore.set(climvarId);
    indicatorsStore.set(indicatorId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    thresholdStore.set(threshold);
    frequencyStore.set(frequency);
    selectedMonthsStore.set(months);
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
      })
      .catch((error) => {
        console.error("init error", error);
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
      Explore projected changes in Heating Degree Days and Cooling Degree Days,
      which are a common proxy for energy needed to heat and cool buildings,
      respectively.
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
          With this tool, you can explore how Cooling Degree Days (CDD) and
          Heating Degree Days (HDD), which are proxies for energy used to cool
          and heat buildings, are expected to change under different emissions
          scenarios and climate models. You can customize the metric for CDDs
          and HDDs by adjusting the baseline temperature as well as selecting
          the entire year or a specific portion of the year for inquiry.
        </p>
        <p>
          The underlying data are derived from daily climate projections that
          have been downscaled from global climate models from
          <a href="https://esgf-node.llnl.gov/projects/cmip5/" target="_blank"
            >CMIP5</a
          >
          archive, using the
          <a href="http://loca.ucsd.edu/what-is-loca/" target="_blank"
            >Localized Constructed</a
          >
          (LOCA) statistical technique developed by Scripps Institution Of Oceanography.
          LOCA is a statistical downscaling technique that uses past history to add
          improved fine-scale detail to global climate models.
        </p>
        <p>
          CDDs and HDDs are often used by utilities and other energy sector
          planners to understand energy demand for cooling and heating. As
          California’s climate changes, historical observed climate is becoming
          an increasingly poor proxy for future energy demand for cooling and
          heating. For example, an increase in the number and magnitude of hot
          days is expected to increase demand for air conditioning.
        </p>

        <h3>What is a Cooling Degree Day?</h3>
        <p>
          A cooling degree day (CDD) is the number of degrees by which a daily
          average temperature exceeds a reference temperature and may therefore
          require additional energy for space cooling.
        </p>
        <p>
          The reference temperature is typically 65 degrees Fahrenheit, although
          different utilities and planning entities sometimes use different
          reference temperatures. The reference temperature loosely represents
          an average daily temperature below which space cooling (e.g. air
          conditioning) is not needed.
        </p>
        <p>
          The average temperature is the average of the minimum and maximum
          daily temperatures. CDDs can be summed over the entire year or over a
          portion of the year (e.g. the month of July) as a rough indicator of
          cooling energy used over that period.
        </p>

        <h3>What is a Heating Degree Day?</h3>
        <p>
          A heating degree day (HDD) is the number of degrees by which a daily
          average temperature is below a reference temperature and may therefore
          require space heating.
        </p>
        <p>
          The reference temperature is typically 65 degrees Fahrenheit, although
          different utilities and planning entities sometimes use different
          reference temperatures. The reference temperature loosely represents
          an average daily temperature above which space heating is not needed.
        </p>
        <p>
          The average temperature is the average of the minimum and maximum
          daily temperatures. HDDs can be summed over the entire year or over a
          portion of the year (e.g. the month of January) as a rough indicator
          of heating energy over that period.
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

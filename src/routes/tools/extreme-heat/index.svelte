<script context="module">
  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  import resourcesList from "../../../../content/resources/data";
  export async function preload({ query }) {
    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const tool = toolsList.find((d) => d.slug === "extreme-heat");
    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));
    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    // Get glossary items
    const glossary = await this.fetch("help/glossary.json")
      .then((r) => r.json())
      .then((json) => {
        return json.data;
      });

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
      const { boundary, climvar, scenario, models, imperial, lat, lng } = query;
      initialConfig = {
        boundaryId: boundary,
        scenarioId: scenario,
        climvarId: climvar,
        modelIds: models,
        imperial: imperial === "true" ? true : false,
        lat: +lat,
        lng: +lng,
      };
    } else {
      initialConfig = {
        boundaryId: "locagrid",
        scenarioId: "rcp45",
        climvarId: "tasmax",
        modelIds: "HadGEM2-ES,CNRM-CM5,CanESM2,MIROC5",
        imperial: true,
        lat: 38.58,
        lng: -121.46,
        thresh: 103.9,
        period: 4,
      };
    }

    return {
      initialConfig,
      glossary,
      tool,
      relatedTools,
      externalResources,
      helpItems,
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { Modal, Loading } from "carbon-components-svelte";
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
  } from "../../../components/tools/Partials";
  import {
    NotificationDisplay,
    notifier,
  } from "../../../components/notifications";

  // Store
  import {
    climvarStore,
    scenarioStore,
    modelsStore,
    unitsStore,
    locationStore,
    dataStore,
    thresholdStore,
    thresholdListStore,
    periodStore,
    queryParams,
    datasetStore,
  } from "./_store";
  import { get98pThreshold, getObserved, getModels } from "./_data";

  export let initialConfig;
  export let glossary;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  // Derived stores
  const { location } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { models } = modelsStore;

  // Local props
  let showInfo = false;
  let definitionText;
  let definitionTitle;
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

  function updateDataset(e) {
    datasetStore.set(e.detail);
  }

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
      const { params, method } = $queryParams;
      params.thresh = $thresholdStore;
      const observed = await getObserved(config, params, method);
      const modelsData = await getModels(config, params, method);
      dataStore.set([observed, ...modelsData]);
    } catch (err) {
      // TODO: notify user of error
      console.log("updateData", err);
      notifier.error("Error", err, 2000);
    }
  }

  /*  function updateThreshold() {
    if (!appReady) return;
    console.log("function update threshold");
    appStatus = "working";
    dataStore.set(null);
    get98pThreshold($climvarStore, $queryParams).then((thresh98p) => {
      thresholdListStore.reset(thresh98p, "98th Percentile");
      thresholdStore.set(thresh98p);
      // This threshold change triggers update() function
    });
  }*/

  async function initApp(config) {
    const {
      lat,
      lng,
      boundaryId,
      scenarioId,
      climvarId,
      modelIds,
      imperial,
      thresh,
      period,
    } = config;
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    periodStore.set(period);
    const addresses = await reverseGeocode(`${lng}, ${lat}`);
    const nearest = addresses.features[0];
    const loc = await getFeature(nearest, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    const { params } = $queryParams;
    const thresh98p = await get98pThreshold(climvarId, params);
    console.log("thresh98p", thresh98p);
    thresholdListStore.add(thresh98p, "98th Percentile");
    thresholdStore.set(thresh98p);
    if (thresh && +thresh !== thresh98p) {
      thresholdListStore.add(+thresh);
      thresholdStore.set(+thresh);
    }
    return;
  }

  /*  async function initApp(config) {
    console.log("initApp", config);
    const {
      lat,
      lng,
      boundaryId,
      scenarioId,
      climvarId,
      thresh,
      modelIds,
      imperial,
      period,
    } = config;
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    periodStore.set(period);
    const loc = await getLocation(lng, lat, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    const thresh98p = await get98pThreshold(climvarId, $queryParams);
    thresholdListStore.add(thresh98p, "98th Percentile");
    thresholdStore.set(thresh98p);
    if (thresh && +thresh !== thresh98p) {
      thresholdListStore.add(+thresh);
      thresholdStore.set(+thresh);
    }
    // Create threshold list store
    return;
  }*/

  /*  $: $climvar, updateThreshold();
  $: $location, updateThreshold();
  $: $thresholdStore, update();
  $: $scenario, update();
  $: $models, update();*/

  // Populates an info modal when user clicks Learn More
  function showDefinition(e) {
    const { topics, title } = e.detail;
    const items = glossary.filter((d) => topics.includes(d.slug));
    definitionText = items
      .map((item) => {
        return `
        <div>
          <h5>${item.metadata.title}</h5>
          ${item.html}
        </div>
        `;
      })
      .join("<br/>");
    definitionTitle = title;
    showInfo = true;
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
  <title>Extreme Heat</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<Header iconPaths="{tool.icons}" title="{tool.title}">
  <div slot="description">
    <p class="lead">
      For most areas around the state, the climate models project a significant
      rise in the number of days exceeding what is now considered extremely hot
      for the given area. Explore how the frequency and timing of extreme heat
      days and warm nights is expected to change under different emission
      scenarios for your location.
    </p>
  </div>
</Header>

<ToolNavigation href="{`/tools/${tool.slug}`}" />

<div id="explore" use:inview="{{}}" on:enter="{handleEntry}">
  {#if appReady}
    <ExploreData on:define="{showDefinition}" />
  {:else}
    <Loading />
  {/if}
</div>

<div class="bx--grid">
  <div id="about" use:inview="{{}}" on:enter="{handleEntry}">
    <About datasets="{datasets}" on:datasetLoaded="{updateDataset}">
      <div slot="description">
        <p>
          With this tool you can explore how the frequency and timing of extreme
          heat days and warm nights is expected to change under different
          emission scenarios. This data is derived from daily climate
          projections which have been downscaled from global climate models from
          the <a
            href="http://cmip-pcmdi.llnl.gov/cmip5/data_portal.html"
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

        <p class="h4">What is warm night?</p>
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
          Heat waves are characterized as periods of sustained, extreme heat,
          although there is no universal definition of a heat wave. For purposes
          of this tool, a heat wave is defined as a period of 4 consecutive
          extreme heat days or warm nights when the daily maximum/minimum
          temperature is above the extreme heat threshold. Each 4 day/night
          period is counted, so that if extreme temperatures persist for 10
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

<Modal
  id="definition"
  size="sm"
  passiveModal
  bind:open="{showInfo}"
  modalHeading="{definitionTitle}"
  on:open
  on:close
>
  <div>{@html definitionText}</div>
</Modal>

<NotificationDisplay />

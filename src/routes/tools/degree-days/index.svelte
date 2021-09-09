<script context="module">
  import resourcesList from "content/resources/data";

  export async function preload({ query }) {
    const toolsList = (await (await this.fetch("tools.json")).json()).tools;
    const tool = toolsList.find((d) => d.slug === "degree-days");

    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));

    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    const glossary = (await (await this.fetch("help/glossary.json")).json())
      .data;

    const help = await (await this.fetch("help.json")).json();
    const helpItems = help.filter((d) =>
      ["get-started", "faqs"].includes(d.slug)
    );

    let initialConfig = {};

    if (Object.keys(query).length) {
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
        modelIds: "HadGEM2-ES,CNRM-CM5",
        imperial: true,
        lat: 38.58,
        lng: -121.46,
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
    climvarStore,
    scenarioStore,
    modelsStore,
    unitsStore,
    locationStore,
    dataStore,
    queryParams,
    datasetStore,
  } from "./_store";
  import { getObserved, getModels, getEnvelope } from "./_data";

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

  // Add tool specific content to glossary
  glossary = [
    ...glossary,
    {
      slug: "degree-days-chart",
      metadata: {
        title: "Cooling Degree Days Heating Degree Days",
      },
      html: `
        <div>
          <p>The colored lines on this visualization represent [TO DO]. The gray shaded region in the background represents the range of projections from all 32 downscaled GCMs. The historical observed data is represented by a gray line from 1950-2006.</p>
          <p>Click on any of the legend keys to highlight corresponding timeseries.</p>
        </div>
      `,
    },
  ];

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
      const envelope = await getEnvelope(config, params, method);
      const observed = await getObserved(config, params, method);
      const modelsData = await getModels(config, params, method);
      dataStore.set([envelope, observed, ...modelsData]);
    } catch (err) {
      // TODO: notify user of error
      console.log("updateData", err);
      notifier.error("Error", err, 2000);
    }
  }

  // Populates an info modal when user clicks Learn More
  function showDefinition(e) {
    const { topics, title } = e.detail;
    const items = glossary.filter((d) => topics.includes(d.slug));
    definitionText = items
      .map((item) => {
        return `
        <div>
          <p class="h5">${item.metadata.title}</p>
          ${item.html}
        </div>
        `;
      })
      .join("<br/>");
    definitionTitle = title;
    showInfo = true;
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

  $: {
    // console.log(initialConfig);
    // console.log(glossary);
    // console.log(tool);
    // console.log(relatedTools);
    // console.log(externalResources);
    // console.log(helpItems);
  }
</script>

<svelte:head>
  <title>{tool.title}</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

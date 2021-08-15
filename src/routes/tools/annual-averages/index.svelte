<script context="module">
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
    const tool = toolsList.find((d) => d.slug === "annual-averages");
    const related = toolsList.filter((d) => tool.related.includes(d.slug));

    // Get glossary items
    const glossary = await this.fetch("help/glossary.json")
      .then((r) => r.json())
      .then((json) => {
        return json.data;
      });

    // Set intitial config for tool
    let initialConfig;

    if (Object.keys(query).length > 0) {
      // TODO: validate bookmark
      let imperial;
      if (query.imperial && query.imperial === "false") {
        imperial = false;
      } else {
        imperial = true;
      }
      initialConfig = { ...query, imperial };
    } else {
      initialConfig = {
        boundaryId: "locagrid",
        scenarioId: "rcp45",
        climvarId: "tasmax",
        modelIds: "HadGEM2-ES,CNRM-CM5,CanESM2,MIROC5",
        imperial: true,
        lat: 38.58,
        lng: -121.46,
      };      
    }

    return { initialConfig, glossary, tool, related };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { Modal } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";

  // Helpers
  import { getFeature, reverseGeocode } from "../../../helpers/geocode";

  // Components
  import Header from "./Header.svelte";
  import ExploreData from "./ExploreData.svelte";
  import About from "./About.svelte";
  import Resources from "./Resources.svelte";
  import Help from "./Help.svelte";
  import { NotificationDisplay } from "../../../components/notifications";

  // Store
  import {
    climvarStore,
    scenarioStore,
    modelsStore,
    unitsStore,
    locationStore,
    dataStore,
    queryParams,
  } from "./_store";
  import { getObserved, getModels, getEnvelope } from "./_data";

  export let initialConfig;
  export let glossary;
  export let tool;
  export let related;

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
      slug: "annual-averages-chart",
      metadata: {
        title: "Annual Averages"
      },
      html: `
        <div>
          <p>The colored lines on this visualization represent a timeseries of annual average values from individual downscaled GCMs. The gray shaded region in the background represents the range of projections from all 32 downscaled GCMs. The historical observed data is represented by a gray line from 1950-2006.</p>
          <p>Click on any of the legend keys to highlight corresponding timeseries.</p>
        </div>
      `,
    },
  ];

  // Monitor sections as they enter & leave viewport
  let inviewEl = "select";
  const handleEntry = (e) => {
    const { entry } = e.detail;
    inviewEl = entry.target.id;
  };
  const entryOptions = {
    threshold: 0.5,
  };

  // Reactive props
  $: datasets = tool.datasets;
  $: resources = [...tool.resources, ...related];
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
      const { params, method } = $queryParams;
      const envelope = await getEnvelope(config, params, method);
      const observed = await getObserved(config, params, method);
      const modelsData = await getModels(config, params, method);
      dataStore.set([envelope, observed, ...modelsData]);

    } catch (err) {
      // TODO: notify user of error
      console.log("updateData", err);
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
          <h5>${item.metadata.title}</h5>
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
    const feature = addresses.features[0];
    const loc = await getFeature(feature, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    return;
  }

  onMount(() => {
    initApp(initialConfig)
      .then(() => {
        appReady = true;
        console.log('app ready');
        update();
      })
      .catch((error) => {
        console.log("init error", error);
      });
    window.scrollTo(0, 0);
  });
</script>

<svelte:head>
  <title>Annual Averages</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<div class="tool">
  <!-- Header -->
  <Header currentView="{inviewEl}" />

  <!-- Explore -->
  <div id="explore" class="section">
    <ExploreData on:define={showDefinition}/>
  </div>

  <div class="bx--grid">
    <!-- Help -->
    <div
      id="help"
      class="section"
      use:inview={entryOptions}
      on:enter={handleEntry}
    >
      <Help />
    </div>

    <!-- About -->
    <div
      id="about"
      class="section"
      use:inview={entryOptions}
      on:enter={handleEntry}
    >
      <About {datasets} />
    </div>

    <!-- Resources -->
    <div
      id="resources"
      class="section"
      use:inview={entryOptions}
      on:enter={handleEntry}
    >
      <Resources {resources} />
    </div>
  </div>
</div>

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

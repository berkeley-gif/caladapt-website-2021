<script context="module">
  export async function preload({ query }) {
    const glossary = await this.fetch(`help/glossary.json`)
      .then(r => r.json())
      .then(json => {
        return json.data;
      });
    if (Object.keys(query).length === 0) {
      return {
        initialConfig: {
          boundaryId: 'locagrid',
          scenarioId: 'rcp45',
          climvarId: 'tasmax',
          modelIds: 'HadGEM2-ES,CNRM-CM5,CanESM2,MIROC5',
          imperial: true,
          lat: 38.58,
          lng: -121.46,
        },
        glossary,
      };
    }
    // TODO: validate bookmark, move imperial parsing to validation code
    let imperial = true;
    if (imperial && imperial === 'false') {
      imperial = false;
    }
    return { initialConfig: {...query, imperial }, glossary };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { Modal, Button } from 'carbon-components-svelte';
  import { inview } from 'svelte-inview/dist/';
  import ChartLineData32 from 'carbon-icons-svelte/lib/ChartLineData32';
  
  // Helpers
  import { getLocation } from '../../../helpers/geocode';
  import { resources } from './_helpers';

  // Components
  import Header from './Header.svelte';
  import SelectLocation from './SelectLocation.svelte';
  import ExploreData from './ExploreData.svelte';
  import About from './About.svelte';
  import DataSources from './DataSources.svelte';
  import Resources from './Resources.svelte';
  import { NotificationDisplay } from '../../../components/notifications';

  // Store
  import {
    climvarStore,
    scenarioStore,
    modelsStore,
    unitsStore,
    locationStore,
    dataStore,
    queryParams,
  } from './_store';
  import { getObserved, getModels, getEnvelope } from './_data';

  export let initialConfig;
  export let glossary;

  // Derived stores
  const { location } = locationStore;
  const { data } = dataStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { models } = modelsStore;

  // Local props
  let showInfo = false;
  let definitionText;
  let definitionTitle;
  let dataLoaded = false;

  // Add chart explanation to glossary list
  glossary = [
    ...glossary,
    {
      slug: 'annual-averages-chart',
      metadata: {
      },
      html: `
        <div>
          <p>The colored lines on this visualization represent a timeseries of annual average values from individual downscaled GCMs. The gray shaded region in the background represents the range of projections from all 32 downscaled GCMs. The Observed data is represented by a gray line from 1950-2006.</p>
          <p>Click on the legend button to highlight corresponding timeseries.</p>
        </div>
      `
    }
  ];

  // Monitor sections as they enter & leave viewport
  let inviewEl = 'select';
  const handleEntry = (e) => {
    const { entry } = e.detail;
    inviewEl = entry.target.id;
  };
  const entryOptions = {
    threshold: 0.5,
  };

  // Reactive props
  $: $location, showLoader();
  $: $climvar, $scenario, $models, update();

  function hideLoader() {
    dataLoaded = true;
    update();
  }

  function showLoader() {
    dataLoaded = false;
    dataStore.set(null);
  }

  async function update() {
    if (!dataLoaded) return;
    dataStore.set(null);
    try {
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
      console.log('updateData', $data);  
    } catch(err) {
      console.log('updateData', err);
    }
  }

  // Populates an info modal when user clicks Learn More
  function showDefinition(e) {
    const { topics, title } = e.detail;
    const items = glossary.filter(d => topics.includes(d.slug));
    console.log('filter', items, glossary);
    definitionText = items.map((item) => {
      return `
        <div>
          <h5>${item.metadata.title}</h5>
          ${item.html}
        </div>
        `;
      })
      .join('<br/>');
    definitionTitle = title;
    showInfo = true;
  }

  async function initApp(config) {
    const {
      lat,
      lng,
      boundaryId,
      scenarioId,
      climvarId,
      modelIds,
      imperial,
    } = config;
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    const loc = await getLocation(lng, lat, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    return;
  }

  onMount(() => {
    initApp(initialConfig)
      .catch((error) => {
        console.log('init error', error);
      });
    window.scrollTo(0, 0);
  });
</script>

<svelte:head>
  <title>Annual Averages</title>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="tool">
  <!-- Header -->
  <Header currentView={inviewEl} />

  <!-- Select Location -->
  <div
    id="select"
    class="section"
    use:inview={entryOptions}
    on:enter={handleEntry}>
    <SelectLocation on:define={showDefinition} />
  </div>
  
  <!-- Explore -->
  <div
    id="explore"
    class="section"
    use:inview={entryOptions}
    on:enter={handleEntry}>
    {#if !dataLoaded}
      <div class="loading-overlay">
        <Button
          icon={ChartLineData32}
          class="load"
          on:click={hideLoader}>
          Explore the Data
        </Button>          
      </div> 
    {/if}
    <ExploreData on:define={showDefinition} />
  </div>

  <div class="bx--grid">
    <!-- About -->
    <div
      id="about"
      class="section"
      use:inview={entryOptions}
      on:enter={handleEntry}>
      <About />
    </div>

    <!-- Data Sources -->
    <div
      id="data"
      class="section"
      use:inview={entryOptions}
      on:enter={handleEntry}>
      <DataSources />
    </div>
    
    <!-- Resources -->
    <div
      id="resources"
      class="section"
      use:inview={entryOptions}
      on:enter={handleEntry}>
      <Resources {resources} />
    </div>
  </div>
</div>


<Modal
  id="definition"
  size="sm"
  passiveModal
  bind:open={showInfo}
  modalHeading={definitionTitle}
  on:open
  on:close>
    <div>{ @html definitionText }</div>
</Modal>

<NotificationDisplay />
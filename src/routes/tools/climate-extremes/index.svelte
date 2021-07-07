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
          stationId: 31,
          scenarioId: 'rcp45',
          climvarId: 'tasmax',
          //modelIds: 'HadGEM2-ES,CNRM-CM5,CanESM2,MIROC5',
          modelIds: 'HadGEM2-ES',
          imperial: true,
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
  import { timeParse} from 'd3-time-format';
  import { Modal, Tag } from 'carbon-components-svelte';
  import { inview } from 'svelte-inview/dist/';
  
  // Helpers
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
/*    locationStore,*/
    stationStore,
    dataStore,
    doyStore,
    queryParams,
    temperatureStore,
    observedStore,
  } from './_store';
  import { getData, getStations, getStationData } from './_data';

  export let initialConfig;
  export let glossary;

  // Derived stores
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { models } = modelsStore;

  // Local props
  let showInfo = false;
  let definitionText;
  let definitionTitle;
  let runUpdate = false;
  let stations;

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

  $: $stationStore, waitForUpdate();
  $: $climvar, $scenario, $models, update();

  function setRunUpdate() {
    runUpdate = true;
    update();
  }

  function waitForUpdate() {
    runUpdate = false;
    dataStore.set(null);
  }

  async function update() {
    if (!runUpdate) return;
    dataStore.set(null);
    try {
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
      };
      const { params, method } = $queryParams;
      const data = await getData(config, params, method);
      console.log('updateData', data);
      const historical = data.find(d => d.key === 'historical');
      const { begin, end } = historical.returnlevels[0];
      const stationData = await getStationData(config, params.g, begin, end);
      dataStore.set(data);
      observedStore.set(stationData);
    } catch(err) {
      console.log('updateData', err);
    }
  }

  function showDefinition(e) {
    const { topics, title } = e.detail;
    const items = glossary.filter(d => topics.includes(d.slug));
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
      stationId,
      scenarioId,
      climvarId,
      modelIds,
      imperial,
      doy,
    } = config;
    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    // Get a list of all stations
    stations = await getStations();
    // Set intial station
    const station = stations.features.find(d => d.id === stationId);
    stationStore.set(station);
    // Set today's date as default
    if (!doy) {
      doyStore.set(new Date());
    } else {
      doyStore.set(timeParse('%j')(+doy));
    }
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
  <title>Climate Extremes</title>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="tool">
  <!-- Header -->
  <Header currentView={inviewEl} />

  <div id="help" class="section">
    <div class="help-info">
      <p>To get started, first <strong>Select a Station</strong>. Next, scroll down to <strong>Explore Data</strong> for selected station.</p>
      <p>Get help:
        <Tag interactive>Watch a video on using the tool</Tag>
        <Tag interactive>Explore our guide on climate data</Tag>
        <Tag interactive>Search FAQs</Tag>
      </p>
    </div>
  </div>

  <!-- Select Location -->
  <div
    id="select"
    class="section"
    use:inview={entryOptions}
    on:enter={handleEntry}>
    {#if stations}
      <SelectLocation
        stationsList={stations.features}
        on:define={showDefinition} />
    {/if}
  </div>
  
  <!-- Explore -->
  <div
    id="explore"
    class="section">
    <ExploreData {runUpdate} on:update={setRunUpdate} on:define={showDefinition} />
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
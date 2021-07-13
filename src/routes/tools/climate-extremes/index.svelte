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
  import { Modal, Link } from 'carbon-components-svelte';
  import { Information32 } from 'carbon-icons-svelte';
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
    stationStore,
    dataStore,
    doyStore,
    queryParams,
    observationsStore,
    forecastStore,
  } from './_store';
  import { getData, getStations, getObservedData, getForecastData } from './_data';

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

  // Add tool specific content to glossary
  glossary = [
    ...glossary,
    {
      slug: 'return-period',
      metadata: {
        title: 'Return Period',
      },
      html: `
        <div>
          <p>The probability that an extreme weather event occurs is often expressed as a Return Period. A return period is the inverse of probability (generally expressed in %); it gives the estimated time interval between events of a similar size or intensity.</p>
          <p>For example, the estimated return period of an event might be 1 in 10 years. This does not mean the event will occur every 10 years, it indicates probability of ocurrence being 10/100, or 10% in any one year.</p>
          <p>For this tool, 30 years of data for the Baseline, Mid-Century and End-Century periods are used to calculate return periods. Due to the relatively short time frame, values extrapolated far into the tail should be understood to have more uncertainty than those calculated for earlier return periods.</p>
        </div>
      `
    },
    {
      slug: 'observations',
      metadata: {
        title: 'Frequency of Observations'
      },
      html: `
        <div>
          <p>This histogram indicates the frequency distribution of selected climate varibale and shows how often each different value occurs.</p>
        </div>
      `
    },
    {
      slug: 'forecast',
      metadata: {
        title: 'Near Term Forecast'
      },
      html: `
        <div>
          <p>The data values represent the 9-day weather forecast from the National Weather Serivice for selected date and current year.</p>
        </div>
      `
    },
    {
      slug: 'projections',
      metadata: {
        title: 'Return Level Estimates',
      },
      html: `
        <div>
          <p>The lines represent frequency curves that relate estimated values of selected climate variable to return periods (years) for historcal observed data and downscaled GCMs. The shaded areas represent 95% confidence intervals.</p>
          <p>Data is presented for Baseline, Mid-Century and End-Century periods. Click on the legend button to highlight corresponding timeseries.</p>
        </div>
      `
    },
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

  $: $stationStore, waitToUpdate();
  $: $climvar, $scenario, $models, $doyStore, update();

  function setRunUpdate() {
    runUpdate = true;
    update();
  }

  function waitToUpdate() {
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
      const projections = await getData(config, params, method);
      const observations = await getObservedData(config, params.g);
      const forecast = await getForecastData(config, params.g);
      dataStore.set(projections);
      observationsStore.set(observations);
      forecastStore.set(forecast);
    } catch(err) {
      // TODO: notify user of error
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
    stationStore.updateStation(station);
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
  <title>Extreme Weather</title>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="tool">
  <!-- Header -->
  <Header currentView={inviewEl} />

  <div id="help" class="section center-row">
    <Information32 />
    <div class="help-info">
      <p>To get started, first <strong>Select a Station</strong>. Next, scroll down to <strong>Explore Data</strong> for selected station.</p>
      <p>Get help:</p>
      <ul>
        <li>
          <a href="!#" target="_blank">Watch a video on using the tool</a>
        </li>
        <li>
          <a href="/help/get-started/" target="_blank">Explore our guide on climate data</a>
        </li>
        <li>
          <a href="/help/faqs/" target="_blank">Search FAQs</a>
        </li>
      </ul>
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
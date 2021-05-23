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
  import { Modal, Loading } from 'carbon-components-svelte';
  import { inview } from 'svelte-inview/dist/';
  
  // Helpers
  import { getLocation } from '../../../helpers/geocode';
  import { resources } from './_helpers';

  // Components
  import DataLoading from '../../../components/tools/Loading/DataLoading.svelte';
  import Header from './Header.svelte';
  import Explore from './Explore.svelte';
  import About from './About.svelte';
  import Data from './Data.svelte';
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

  // Modals
  let showInfo = false;
  let initReady = false;
  let mapReady = false;
  let appReady = false;
  let definitionText;
  let definitionTitle;
  let appStatus = 'idle';

  let inviewEl = 'explore';
  const handleEntry = (e) => {
    const { entry } = e.detail;
    inviewEl = entry.target.id;
  };
  const entryOptions = {
    threshold: 0.25,
  };

  $: if (initReady) {
    appReady = true;
    console.log('app ready');
    updateData();
  }

  $: $climvar, updateData();
  $: $location, updateData();
  $: $scenario, updateData();
  $: $models, updateData();

  async function updateData() {
    if (!appReady) return;
    appStatus = 'working';
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
      appStatus = 'idle';      
    } catch(err) {
      console.log('updateData', err);
      appStatus = 'idle';
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
    console.log('initApp', config);
    const { lat, lng, boundaryId, scenarioId, climvarId, modelIds, imperial } = config;
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
    window.scrollTo(0, 0);
    initApp(initialConfig)
      .then(() => {
        initReady = true;
        console.log('init ready');
      })
      .catch((error) => {
        console.log('init error', error);
      });
  })
</script>

<svelte:head>
  <title>Annual Averages</title>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<style type="scss">
  .section {
    margin: 4rem 2rem;
    min-height: 300px;
  }
</style>

<div class="tool">
  <!-- Header -->
  <Header currentView={inviewEl} />
  
  <!-- Explore -->
  <div
    id="explore"
    class="section"
    use:inview={entryOptions}
    on:enter={handleEntry}>
    {#if !appReady}
      <DataLoading />
    {:else}
      <Explore
        bind:appStatus
        on:define={showDefinition} />
    {/if}  
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
      <Data />
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


<Modal id="definition" size="sm" passiveModal bind:open={showInfo} modalHeading={definitionTitle} on:open on:close>
  <div>{ @html definitionText }</div>
</Modal>

{#if appStatus === 'working'}
  <Loading />
{/if}

<NotificationDisplay />
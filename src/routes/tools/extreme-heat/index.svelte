<script context="module">
  export async function preload({ query }) {
    const glossary = await this.fetch(`help/glossary.json`)
      .then(r => r.json())
      .then(json => {
        return json.data.find(d => d.slug === 'glossary');
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
          thresh: 103.9,
          period: 4,
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
  import { onMount, tick } from 'svelte';
  import { Modal, Loading } from 'carbon-components-svelte';
  
  // Helpers
  import { getLocation } from '../../../helpers/geocode';

  // Components
  import AppLoadingScreen from '../../../components/AppLoadingScreen';
  import Header from './Header.svelte';
  import Settings from './Settings.svelte';
  import Content from './Content.svelte';
  import { NotificationDisplay } from '../../../components/notifications';

  // Store
  import {
    climvarStore,
    scenarioStore,
    modelsStore,
    unitsStore,
    locationStore,
    dataStore,
    thresholdStore,
    periodStore,
    queryParams,
  } from './_store';
  import { get98pThreshold, getObserved, getModels } from './_data';

  export let initialConfig;
  export let glossary;

  // Derived stores
  const { location } = locationStore;
  const { climvar } = climvarStore;
  const { scenario } = scenarioStore;
  const { models } = modelsStore;
  const { threshold, thresholdClick } = thresholdStore;

  // Modals
  let showInfo = false;

  let sidebarCollapsed = false;

  let appReady = false;
  let initReady = false;
  let settingsReady = false;
  let contentReady = false;
  let definitionText;
  let definitionTitle;
  let appStatus = 'idle';

  async function initApp(config) {
    console.log('initApp', config);
    const { lat, lng, boundaryId, scenarioId, climvarId, thresh, modelIds, imperial, period } = config;

    climvarStore.set(climvarId);
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    periodStore.set(period);
    const loc = await getLocation(lng, lat, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    const thresh98p = await get98pThreshold(climvarId, $queryParams);
    thresholdStore.setDefault(thresh98p);
    if (thresh && (+thresh !== thresh98p)) {
      thresholdStore.updateCustom(+thresh);
    }
    return;
  }

  $: if (initReady && contentReady && settingsReady) {
    appReady = true;
    console.log('all ready');
    updateData();
  }

  $: $climvar, updateThreshAndData();
  $: $location, updateThreshAndData();
  $: if ($thresholdClick) {
    updateData();
  }
  $: $scenario, updateData();
  $: $models, updateData();

  async function updateThreshAndData() {
    if (!appReady) return;
    appStatus = 'working';
    await tick();
    console.log('updateThreshAndData', $queryParams);
    const thresh98p = await get98pThreshold($climvarStore, $queryParams);
    console.log('threshold', thresh98p);
    thresholdStore.setDefault(thresh98p);
    updateData();
  }

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
      const params = {
        thresh: $threshold,
        ...$queryParams,
      }
      const observed = await getObserved(config, params);
      const modelsData = await getModels(config, params);
      dataStore.set([observed, ...modelsData]);
      appStatus = 'idle';
    } catch (err) {
      console.log('updateData', err);
      appStatus = 'idle';
    }
  }

  function showDefinition(e) {
    const { topics, title } = e.detail;
    const items = glossary.items.filter(d => topics.includes(d.slug));
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

  onMount(() => {
    console.log('mount index');
    initApp(initialConfig)
      .then(() => {
        initReady = true;
        console.log('init is ready');
      })
      .catch((error) => {
        console.log('init error', error);
      })
  })
</script>


<svelte:head>
  <title>Extreme Heat</title>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

{#if !initReady}
  <div style="height:50rem;">
  <AppLoadingScreen />
  </div>
{:else}
  <div class="page-grid page-grid--tool">
    <!-- Header -->
    <div class="header">
      <Header />
    </div>
    <!-- Content -->
    <div class="content" class:sidebarCollapsed>
      <Content
        bind:appStatus
        bind:sidebarCollapsed
        on:ready={() => contentReady = true}
        on:define={showDefinition} />
    </div>
    <!-- Sidebar -->
    <aside class="sidebar" class:sidebarCollapsed>
      <div class="is-sticky">
        <Settings
          bind:appStatus
          bind:sidebarCollapsed
          on:ready={() => settingsReady = true}
          on:define={showDefinition} />      
      </div>
    </aside>
    <!-- Footer -->
    <div class="footer"></div>
  </div>
{/if}


<Modal id="definition" size="sm" passiveModal bind:open={showInfo} modalHeading={definitionTitle} on:open on:close>
  <div>{ @html definitionText }</div>
</Modal>

{#if appStatus === 'working'}
  <Loading />
{/if}

<NotificationDisplay />
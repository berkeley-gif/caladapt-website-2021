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
  import { onMount } from 'svelte';
  import { Modal, Loading } from 'carbon-components-svelte';
  
  // Helpers
  import { getLocation } from '../../../helpers/geocode';
  import { resources } from './_helpers';

  // Components
  import DataLoading from '../../../components/tools/Loading/DataLoading.svelte';
  import Header from './Header.svelte';
  import Settings from './Settings.svelte';
  import Content from './Content.svelte';
  import ToolFooter from '../../../partials/FooterTool';
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
    thresholdListStore,
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
    thresholdListStore.add(thresh98p, '98th Percentile');
    thresholdStore.set(thresh98p);
    if (thresh && (+thresh !== thresh98p)) {
      thresholdListStore.add(+thresh);
      thresholdStore.set(+thresh);
    }
    // Create threshold list store
    return;
  }

  $: if (initReady && contentReady && settingsReady) {
    appReady = true;
    console.log('all ready');
    update();
  }

  $: $climvar, updateThreshold();
  $: $location, updateThreshold();
  $: $thresholdStore, update();
  $: $scenario, update();
  $: $models, update();

  function update() {
    if (!appReady) return;
    console.log('function update');
    appStatus = 'working';
    dataStore.set(null);
    getData()
      .then((_data) => {
        dataStore.set(_data);
      })
      .catch((err) => {
        // handle error
        console.log('error', err);
        //throw new Error(err);
      })
      .finally(() => {
        appStatus = 'idle';
      });
  }

  function updateThreshold() {
    if (!appReady) return;
    console.log('function update threshold');
    appStatus = 'working';
    dataStore.set(null);
    get98pThreshold($climvarStore, $queryParams)
      .then((thresh98p) => {
        thresholdListStore.reset(thresh98p, '98th Percentile');
        thresholdStore.set(thresh98p);
        // This threshold change triggers update() function
      });
  }

  async function getData() {
    const config = {
      climvarId: $climvarStore,
      scenarioId: $scenarioStore,
      modelIds: $modelsStore,
    };
    const params = {
      thresh: $thresholdStore,
      ...$queryParams,
    }
    const observed = await getObserved(config, params);
    const modelsData = await getModels(config, params);
    return [observed, ...modelsData];
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

  onMount(() => {
    console.log('mount index');
    initApp(initialConfig)
      .then(() => {
        initReady = true;
      })
      .catch((error) => {
        console.log('init error', error);
      });
  })
</script>


<svelte:head>
  <title>Extreme Heat</title>
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

{#if !initReady}
  <div style="height:50rem;">
  <DataLoading />
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
          bind:sidebarCollapsed
          on:ready={() => settingsReady = true}
          on:define={showDefinition} />      
      </div>
    </aside>
    <!-- Footer -->
    <div class="footer">
      <ToolFooter {resources} />
    </div>
  </div>
{/if}


<Modal id="definition" size="sm" passiveModal bind:open={showInfo} modalHeading={definitionTitle} on:open on:close>
  <div>{ @html definitionText }</div>
</Modal>

{#if appStatus === 'working'}
  <Loading />
{/if}

<NotificationDisplay />
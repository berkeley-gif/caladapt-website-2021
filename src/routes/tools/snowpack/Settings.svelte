<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import {
    Button,
    Accordion,
    AccordionItem,
  } from 'carbon-components-svelte';
  import ArrowRight16 from 'carbon-icons-svelte/lib/ArrowRight16';
  import ArrowLeft16 from 'carbon-icons-svelte/lib/ArrowLeft16';
  import { fly } from 'svelte/transition';

  // Helpers
  import { modelList, scenarioList, monthsList } from './_helpers';

  // Components
  import {
    SelectScenario,
    SelectModels,
    SelectMonth,
    ShowDefinition,
   } from '../../../components/tools/Settings';

  // Store
  import {
    scenarioStore,
    modelsStore,
    monthStore,
  } from './_store';

  export let sidebarCollapsed;

  const dispatch = createEventDispatcher();

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
    console.log('scenario change');
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds.join(','));
    console.log('models change');
  }

  function changeMonth(e) {
    monthStore.set(e.detail.id);
    console.log('month change');
  }

  onMount(() => {
    dispatch('ready');
  })
</script>

<style lang="scss">
  :global(.bx--accordion__title) {
    font-size: 0.75rem;
    color: #51585e;
    text-transform: uppercase;
  }

  :global(.bx--accordion__title::before) {
    content: '';
    background: url(img/icons/gear.svg);
    display: inline-block;
    height: 1rem;
    width: 1rem;
    margin-right: 3px;
    vertical-align: -25%;
  }

  :global(.bx--accordion__content) {
    padding-right: 0.5rem;
    padding-top: 0.25rem;
  }

  :global(.bx--accordion__item--active .bx--accordion__content) {
    padding-top: 0.25rem;
  }
</style>

{#if sidebarCollapsed}
  <div class="sidebar-toggle">
    <Button
      tooltipPosition="left"
      tooltipAlignment="end"
      iconDescription="Show Settings Panel"
      icon={ArrowLeft16}
      kind="primary"
      size="sm"
      on:click={() => sidebarCollapsed = false}>
    </Button>
  </div>
{:else}
  <div class="settings" transition:fly={{x: 250, opacity: 1}}> 
    <div class="settings-header">
      <h5>Settings</h5>
      <Button
        tooltipPosition="left"
        tooltipAlignment="end"
        iconDescription="Hide Settings Panel"
        icon={ArrowRight16}
        kind="primary"
        on:click={() => sidebarCollapsed = true}>
      </Button>
    </div>
    <Accordion class="settings-list">
      <AccordionItem open title="Month">
        <SelectMonth
          selectedId={$monthStore}
          items={monthsList}
          on:change={changeMonth}
        />
        <ShowDefinition
          on:define
          topics={["snow-water-equivalent"]}
          title="Climate Variables" />
      </AccordionItem>
      <AccordionItem open title="Scenario">
        <SelectScenario
          selectedId={$scenarioStore}
          items={scenarioList}
          on:change={changeScenario}
        />
        <ShowDefinition
          on:define
          topics={["climate-scenarios"]}
          title="RCP Scenarios" />
      </AccordionItem>
      <AccordionItem title="Models">
        <SelectModels 
          selectedIds={$modelsStore}
          items={modelList}
          on:change={changeModels}
        />
        <ShowDefinition
          on:define
          topics={["gcms"]}
          title="Global Climate Models (GCMs)" />
      </AccordionItem>
    </Accordion>
  </div>
{/if}
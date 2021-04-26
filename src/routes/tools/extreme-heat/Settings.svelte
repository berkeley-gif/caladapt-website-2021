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
  import { climvarList, modelList, scenarioList } from './_helpers';

  // Components
  import {
    SelectScenario,
    SelectModels,
    SelectClimvar,
    SelectThreshold,
    SelectPeriod,
    ShowDefinition,
   } from '../../../components/tools/Settings';

  // Store
  import {
    climvarStore,
    scenarioStore,
    modelsStore,
    thresholdStore,
    periodStore,
    thresholdListStore,
  } from './_store';

  export let sidebarCollapsed;

  const { climvar } = climvarStore;

  const dispatch = createEventDispatcher();

  function changeScenario(e) {
    scenarioStore.set(e.detail.id);
    console.log('scenario change');
  }

  function changeModels(e) {
    modelsStore.set(e.detail.selectedIds.join(','));
    console.log('models change');
  }

  function changeClimvar(e) {
    climvarStore.set(e.detail.id);
    console.log('climvar change');
  }

  function changeThreshold(e) {
    thresholdStore.set(e.detail);
    console.log('threshold change');
  }

  function addThreshold(e) {
    thresholdListStore.add(e.detail);
    console.log('threshold add');
  }

  function changePeriod(e) {
    periodStore.set(e.detail);
    console.log('period change');
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
      <AccordionItem open title="Climate Variable">
        <SelectClimvar
          selectedId={$climvarStore}
          items={climvarList}
          on:change={changeClimvar}
        />
        <ShowDefinition
          on:define
          topics={["extreme-heat-day", "warm-night"]} />
      </AccordionItem>
      <AccordionItem open title="Scenario">
        <SelectScenario
          selectedId={$scenarioStore}
          items={scenarioList}
          on:change={changeScenario}
        />
        <ShowDefinition
          on:define
          topics={["climate-scenarios"]} />
      </AccordionItem>
      <AccordionItem open title="Threshold Temperature">
        <SelectThreshold
          items={$thresholdListStore}
          selected={$thresholdStore}
          units={$climvar.units.imperial}
          on:change={changeThreshold}
          on:add={addThreshold}
        />
        <ShowDefinition
          on:define
          topics={["extreme-heat-threshold"]} />
      </AccordionItem>
      <AccordionItem title="Heat Wave Length">
        <SelectPeriod
          value={4}
          min={2}
          max={7}
          helperText="Enter a number between 2-7"
          on:change={changePeriod}
        />
        <ShowDefinition
          on:define
          topics={["heat-wave-event"]} />
      </AccordionItem>
      <AccordionItem title="Models">
        <SelectModels 
          selectedIds={$modelsStore}
          items={modelList}
          on:change={changeModels}
        />
        <ShowDefinition
          on:define
          topics={["gcms"]} />
      </AccordionItem>
    </Accordion>
  </div>
{/if}
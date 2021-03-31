<script>
  // Node modules
  import { createEventDispatcher } from 'svelte';
  import { group } from 'd3-array';

  // Components
  import { Button, Checkbox } from 'carbon-components-svelte';

  // Helpers
  import layers from './../../../helpers/mapbox-layers';

  // Props
  //-------
  export let open = true;


  // Local variables
  //-----------------
  let dispatch = createEventDispatcher();

  const utilityLayers = layers
  .filter((d) => ['Electric Infrastructure', 'Natural Gas'].includes(d.metadata.group))
  .map((d) => {
    const layer = d;
    layer.name = d.metadata.title;
    return layer;
  });
  const utilities = Array.from(group(utilityLayers, (d) => d.metadata.group));

  // Environmental layers
  const environmental = layers
    .filter((d) => d.metadata.group === 'Environmental')
    .map((d) => {
      const layer = d;
      layer.name = d.metadata.title;
      return layer;
    });

  // Functions
  //------------
  function toggleUtility(show, id) {
    let layer;
    utilities.forEach(([key, values]) => {
      values.forEach(d => {
        if (d.id === id) {
          layer = d;
          return;
        }
      });
    });
    dispatch('toggleLayer', { layer, show }); 
  }

  function toggleEnvironmental(show, id) {
    let layer;
    environmental.forEach((d) => {
      if (d.id === id) {
        layer = d;
        return;
      }
    });
    dispatch('toggleLayer', { layer, show }); 
  }
</script>

<style>
  .map-ui {
    overflow-y: auto;
    z-index: 3;
  }

  .sidebar-heading {
    padding: 5px;
    background: #cad3d2;
  }

  .sidebar-heading h6 {
    margin-bottom: 0;
  }
                 
  .section {
    border-bottom: 1px solid #CCC;
    padding: 5px;
  }

  .section-heading {
    font-weight: 500;
    padding-bottom: 10px;
    font-size: 0.9rem;
  }

  .section-source {
    font-size: 0.75rem;
    font-style: italic;
    margin: 10px 0;
  }
</style>

<div class="map-ui">
  <div class="layers-ui">

    <div class="sidebar-heading">
      <Button
        style="padding: 0 5px;min-height: 0;"
        type="button"
        ariaLabel="Close"
        title="Close"
        class="close"
        on:click={() => {
          open = false;
          dispatch('close');
        }}>
        <span aria-hidden="true">&times;</span>
      </Button>
      <h6>Map Layers</h6>
    </div>

    <div class="section environmental">
      {#each environmental as opt, i}
        <Checkbox
          labelText={opt.metadata.title}
          id={`toggle-${opt.id}`}
          size="sm"
          on:check={({ detail }) => toggleEnvironmental(detail, opt.id)}
        />
      {/each}
    </div>

    <div class="section utilities">
      {#each utilities as [key, values]}
        <span class="section-heading">{key}</span>
        {#each values as opt, i}
          <Checkbox
            labelText={opt.metadata.title}
            id={`toggle-${opt.id}`}
            size="sm"
            on:check={({ detail }) => toggleUtility(detail, opt.id)}
          />
        {/each}
      {/each}
      <span class="section-source">
        Source: California Energy Commission's <a href="https://cecgis-caenergy.opendata.arcgis.com/" target="_blank">GIS Open Data</a>.
      </span>
    </div>

  </div>
</div>
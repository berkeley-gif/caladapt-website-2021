<script>
  // Node modules
  import { createEventDispatcher } from "svelte";

  // Components
  import { Button, Checkbox } from "carbon-components-svelte";

  // Helpers
  import layers from "./../../../helpers/mapbox-layers";

  // Props
  //-------
  export let open = true;

  // Local variables
  //-----------------
  let dispatch = createEventDispatcher();

  // Inlcudes Electric Infrastructure layers only
  // Natural gas layers no longer available online for public download
  const utilities = layers
    .filter((d) => d.metadata.group === "Electric Infrastructure")
    .map((d) => {
      const layer = d;
      layer.name = d.metadata.title;
      return layer;
    });

  // Environmental layers
  const environmental = layers
    .filter((d) => d.metadata.group === "Environmental")
    .map((d) => {
      const layer = d;
      layer.name = d.metadata.title;
      return layer;
    });

  // Functions
  //------------
  function toggleLayer(show, id) {
    let layer;
    layers.forEach((d) => {
      if (d.id === id) {
        layer = d;
        return;
      }
    });
    dispatch("toggleLayer", { layer, show });
  }
</script>

<style>
  .map-ui {
    overflow-y: auto;
    z-index: 3;
  }

  .header {
    padding: 10px 5px;
    background: #cad3d2;
  }

  .header span {
    margin: 0 0 0 5px;
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
  }

  .group {
    border-bottom: 1px solid #ccc;
    padding: 5px;
  }

  .group-title {
    font-weight: 600;
    padding-bottom: 5px;
    font-size: 0.9rem;
    display: block;
  }

  .group-source span {
    font-size: 0.8rem;
    display: block;
    margin: 5px 0;
    line-height: 1.2;
  }
</style>

<div class="map-ui">
  <div class="layers-ui">
    <div class="header">
      <Button
        style="padding: 0 5px;min-height: 0;"
        type="button"
        ariaLabel="Close"
        title="Close"
        class="close"
        on:click="{() => {
          open = false;
          dispatch('close');
        }}"
      >
        <span aria-hidden="true">&times;</span>
      </Button>
      <span>Map Layers</span>
    </div>
    <!-- Environmental Layers -->
    <div class="group environmental">
      {#each environmental as opt, i}
        <Checkbox
          labelText="{opt.metadata.title}"
          id="{`toggle-${opt.id}`}"
          size="sm"
          on:check="{({ detail }) => toggleLayer(detail, opt.id)}"
        />
      {/each}
    </div>
    <!-- Electric Infrastructure Layers -->
    <div class="group utilities">
      <span class="group-title">Electric Infrastructure</span>
      {#each utilities as opt, i}
        <Checkbox
          labelText="{opt.metadata.title}"
          id="{`toggle-${opt.id}`}"
          size="sm"
          on:check="{({ detail }) => toggleLayer(detail, opt.id)}"
        />
      {/each}
      <div class="group-source">
        Source: <a
          href="https://cecgis-caenergy.opendata.arcgis.com/"
          target="_blank">CEC GIS Open Data</a
        >
      </div>
    </div>
    <!-- Natural Gas Layers -->
    <div class="group utilities">
      <span class="group-title">Natural Gas</span>
      <div class="group-source">
        <span>
          View data for natural gas transmission & hazardous liuid pipelines,
          LNG plants and breakout tanks at <a
            href="https://pvnpms.phmsa.dot.gov/PublicViewer/"
            target="_blank">NPMS Public Map Viewer</a
          >
        </span>
        <span>
          For more information in accessing underlying data see <a
            href="https://www.npms.phmsa.dot.gov/DataMayAccess.aspx"
            target="_blank">What NPMS data may I access?</a
          >
        </span>
      </div>
    </div>
  </div>
</div>

<script>
  import { afterUpdate, createEventDispatcher } from "svelte";
  import { Button, Checkbox } from "carbon-components-svelte";
  import { Close20 } from "carbon-icons-svelte";
  import layers from "~/helpers/mapbox-layers";

  export let open = false;

  const dispatch = createEventDispatcher();
  let containerRef = null;

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

  afterUpdate(() => {
    // make the Sidebar contents invisible to assistive tech without
    // affecting its visual appearance.
    // see: https://github.com/WICG/inert
    if (open) {
      containerRef.inert = false;
    } else {
      containerRef.inert = true;
    }
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
  .sidebar-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid var(--gray-60);
    border-top: 1px solid var(--gray-60);
    border-bottom: 1px solid var(--gray-60);
  }

  header,
  .group {
    padding: 6px;
  }

  header,
  form > .group {
    border-bottom: 1px solid #ccc;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h2,
  h3 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
  }

  h2 {
    text-transform: uppercase;
  }

  h3 {
    margin-bottom: 6px;
  }

  p {
    margin: 12px 0;
    line-height: 1.2;
    font-size: 0.8rem;
  }
</style>

<div bind:this="{containerRef}" class="sidebar-container">
  <header>
    <h2>Map Layers</h2>
    <Button
      size="small"
      icon="{Close20}"
      iconDescription="Close the sidebar"
      on:click="{() => {
        open = false;
        dispatch('close');
      }}"
    />
  </header>

  <form>
    <!-- Environmental Layers -->
    <fieldset class="group environmental">
      <h3 class="group-title">Environmental</h3>
      {#each environmental as opt, i}
        <Checkbox
          labelText="{opt.metadata.title}"
          id="{`toggle-${opt.id}`}"
          size="sm"
          on:check="{({ detail }) => toggleLayer(detail, opt.id)}"
        />
      {/each}
    </fieldset>

    <!-- Electric Infrastructure Layers -->
    <fieldset class="group utilities">
      <h3 class="group-title">Electric Infrastructure</h3>
      {#each utilities as opt, i}
        <Checkbox
          labelText="{opt.metadata.title}"
          id="{`toggle-${opt.id}`}"
          size="sm"
          on:check="{({ detail }) => toggleLayer(detail, opt.id)}"
        />
      {/each}

      <p>
        <strong>Source:</strong>
        <a href="https://cecgis-caenergy.opendata.arcgis.com/" target="_blank"
          >CEC GIS Open Data</a
        >
      </p>
    </fieldset>
  </form>

  <!-- Natural Gas Layers -->
  <div class="group utilities">
    <h3 class="group-title">Natural Gas</h3>
    <p>
      View data for natural gas transmission & hazardous liuid pipelines, LNG
      plants and breakout tanks at <a
        href="https://pvnpms.phmsa.dot.gov/PublicViewer/"
        target="_blank">NPMS Public Map Viewer</a
      >
    </p>

    <p>
      For more information in accessing underlying data see <a
        href="https://www.npms.phmsa.dot.gov/DataMayAccess.aspx"
        target="_blank">What NPMS data may I access?</a
      >
    </p>
  </div>
</div>

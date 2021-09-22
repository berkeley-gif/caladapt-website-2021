<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { InlineLoading, InlineNotification } from "carbon-components-svelte";

  // Helpers
  import { getDataset } from "../../../helpers/utilities";

  // Props
  export let datasets;

  const dispatch = createEventDispatcher();
  let datasetList = [];

  async function fetchDatasets() {
    try {
      const results = await Promise.all(datasets.map((d) => getDataset(d)));
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  onMount(() => {
    if (!datasets) return null;
    fetchDatasets().then((results) => {
      datasetList = results;
      dispatch("datasetLoaded", results);
    });
  });
</script>

<style lang="scss">
  .description :global(p),
  p {
    font-size: 20px;
    margin-bottom: 1.75rem;
    max-width: 75ch;
  }

  :global(.source .source-logo) {
    width: 100%;
    margin-top: 2rem;
  }

  :global(.source .h5) {
    margin-top: 0;
  }

  :global(.source .source-text) {
    font-size: 18px;
  }

  :global(.source .source-list) {
    font-size: 18px;
    padding-left: 1.5rem;
    margin-bottom: 1.75rem;
  }
</style>

<!-- About -->
<div class="bx--row margin--v-32">
  <div class="bx--col-lg-12">
    <h2>About the Tool</h2>
    <div class="description">
      <slot name="description">
        <em>[Provide content describing the tool]</em>
      </slot>
    </div>
  </div>
</div>
<!-- Datasets -->
<div class="bx--row margin--v-32">
  <div class="bx--col-lg-12">
    <h2>Data Sources</h2>
    <p>
      The following list of datasets were used to create this tool. Download
      data visualized in the charts by clicking the Download Chart button. For
      more download options follow the links below.
    </p>
    <slot name="sources">
      {#if !datasets || !datasetList}
        <em>[Provide a list of datasets used for the tool]</em>
      {:else}
        {#await datasetList}
          <InlineLoading description="Loading list of datasets..." />
        {:then items}
          {#each items as item}
            <div class="bx--row source">
              <div class="bx--col-lg-2 bx--col-md-1 bx--col-sm-1">
                <img
                  src="/img/logos/{item.logo}"
                  class="source-logo"
                  alt="data provider logo"
                />
              </div>
              <div class="bx--col-lg-12 bx--col-md-7 bx--col-sm-3">
                <div class="h4">{item.title}</div>
                <div class="h5">{item.publisher}</div>
                <p class="source-text">{item.description}</p>
                <p class="source-text">Download dataset:</p>
                <ul class="source-list">
                  <li class="source-list-item">
                    <a href="/data/download/" target="_blank"
                      >Cal-Adapt Data Download Tool</a
                    >
                  </li>
                  {#each item.resources.filter((d) => d.format !== "reference") as ref}
                    <li class="source-list-item">
                      <a href="{ref.url}" target="_blank"
                        >{ref.name} ({ref.format})</a
                      >
                    </li>
                  {/each}
                </ul>
                <p class="source-text">References:</p>
                <ul class="source-list">
                  {#each item.resources.filter((d) => d.format === "reference") as ref}
                    <li class="source-list-item">
                      {ref.name} (<a href="{ref.url}" target="_blank">link</a>)
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          {/each}
          <slot name="extra-sources" />
        {:catch error}
          <InlineNotification
            lowContrast
            title="Error:"
            subtitle="Currently unable to load dataset descriptions."
          />
        {/await}
      {/if}
    </slot>
  </div>
</div>

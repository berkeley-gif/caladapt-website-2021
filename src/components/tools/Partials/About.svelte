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

<style>
  .source {
    margin-top: 1rem;
  }

  .source .source-logo {
    display: flex;
    padding-top: 1.5rem;
    align-items: start;
  }

  .source .source-logo img {
    width: 100px;
  }

  .source .source-text > * {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .source .source-text ul {
    padding-left: 1.5rem;
  }
</style>

<div class="bx--grid">
  <!-- About -->
  <div class="bx--row">
    <div class="bx--col-lg-12">
      <h2>About the Tool</h2>
      <slot name="description">
        <em>[Provide content describing the tool]</em>
      </slot>
    </div>
  </div>
  <!-- Datasets -->
  <div class="bx--row">
    <div class="bx--col-lg-12">
      <h3>Data Sources</h3>
      <slot name="sources">
        <p>
          The following list of datasets were used to create this tool. Download
          data visualized in the charts by clicking the Download Chart button.
          For more download options follow the links below.
        </p>
        {#if !datasets || !datasetList}
          <em>[Provide a list of datasets used for the tool]</em>
        {:else}
          {#await datasetList}
            <InlineLoading description="Loading list of datasets..." />
          {:then items}
            {#each items as item}
              <div class="bx--row source">
                <div class="bx--col-lg-2 source-logo">
                  <img src="/img/logos/{item.logo}" alt="data provider logo" />
                </div>
                <div class="bx--col-lg-12 source-text">
                  <h4>{item.title}</h4>
                  <h5>{item.publisher}</h5>
                  <p>{item.description}</p>
                  <p>Download dataset:</p>
                  <ul>
                    <li>
                      <a href="/data/download/{item.id}" target="_blank"
                        >Cal-Adapt Data Download tool</a
                      >
                    </li>
                    {#each item.resources.filter((d) => d.format !== "reference") as ref}
                      <li>
                        <a href="{ref.url}" target="_blank"
                          >{ref.name} ({ref.format})</a
                        >
                      </li>
                    {/each}
                  </ul>
                  <p>References:</p>
                  <ul>
                    {#each item.resources.filter((d) => d.format === "reference") as ref}
                      <li>
                        {ref.name}. <a href="{ref.url}" target="_blank">Link</a>
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
            {/each}
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
</div>

<script>
  import { onMount } from "svelte";
  import { InlineLoading, InlineNotification } from "carbon-components-svelte";
  import { Link16 } from "carbon-icons-svelte";

  // Helpers
  import { getDataset } from "../../../helpers/utilities";

  // Store
  import { datasetStore } from "./_store";

  export let datasets;

  async function fetchDatasets() {
    try {
      const results = await Promise.all(datasets.map((d) => getDataset(d)));
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  onMount(() => {
    fetchDatasets().then((results) => {
      datasetStore.set(results);
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

<div class="bx--row">
  <div class="bx--col-lg-12">
    <h2>About the Tool</h2>
    <p>
      Explore extreme temperatures for past weather, present day, and future
      climate projections.
    </p>
  </div>
</div>

<div class="bx--row">
  <div class="bx--col-lg-12">
    <h3>Data Sources</h3>
    <p>
      The following list of datasets were used to create this tool. Click on the
      Download Dataset buttons to download data in NetCDF, GeoTIFF or CSV
      formats. You can also download data visualized in Explore the Data section
      above in graphic and tabular formats by clicking on the Download Chart
      button.
    </p>
  </div>
</div>

{#await $datasetStore}
  <InlineLoading description="Loading datasets..." />
{:then items}
  {#each items as item}
    <div class="bx--row source">
      <div class="bx--col-lg-2 source-logo">
        <img src="/img/logos/{item.logo}" alt="data provider logo" />
      </div>
      <div class="bx--col-lg-10 source-text">
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
              <a href="{ref.url}" target="_blank">{ref.name} ({ref.format})</a>
            </li>
          {/each}
        </ul>
        <p>References:</p>
        <ul>
          {#each item.resources.filter((d) => d.format === "reference") as ref}
            <li>
              {ref.name} <a href="{ref.url}" target="_blank"><Link16 /></a>
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
    subtitle="An internal server error occurred while loading dataset descriptions."
  />
{/await}

<!-- Source -->
<div class="bx--row source">
  <div class="bx--col-lg-2 source-logo">
    <img
      style="width:80px;"
      src="/img/logos/gif_80x80.png"
      alt="data provider logo"
    />
  </div>
  <div class="bx--col-lg-10 source-text">
    <h4>Near Term Forecast</h4>
    <h5>National Weather Service</h5>
    <p>
      The National Weather Service (NWS) is an agency of the United States
      federal government that is tasked with providing weather forecasts,
      warnings of hazardous weather, and other weather-related products to
      organizations and the public for the purposes of protection, safety, and
      general information.
    </p>
    <p>Download dataset:</p>
    <ul>
      <li>
        <a href="#!" target="_blank">API</a>
      </li>
    </ul>
  </div>
</div>

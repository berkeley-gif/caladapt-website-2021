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
      Overall temperatures are projected to rise substantially throughout this
      century. These projections differ depending on the time of year and the
      type of measurement (highs vs. lows), all of which have different
      potential effects to the state's ecosystem health, agricultural
      production, water use and availability, and energy demand. On average, the
      projections show little change in total annual precipitation in
      California. Furthermore, among several models, precipitation projections
      do not show a consistent trend during the next century. The Mediterranean
      seasonal precipitation pattern is expected to continue, with most
      precipitation falling during winter from North Pacific storms. However,
      even modest changes would have a significant impact because California
      ecosystems are conditioned to historical precipitation levels and water
      resources are nearly fully utilized.
    </p>
    <p>
      With this tool you can explore projections of annually averaged maximum
      temperature, minimum temperature and precipitation. These climate
      projections have been downscaled from global climate models from the <a
        href="https://pcmdi.llnl.gov/mips/cmip5/"
        target="_blank">CMIP5</a
      >
      archive, using the
      <a href="http://loca.ucsd.edu/what-is-loca/" target="_blank"
        >Localized Constructed Analogs</a
      > (LOCA) statistical technique developed by Scripps Institution Of Oceanography.
      LOCA is a statistical downscaling technique that uses past history to add improved
      fine-scale detail to global climate models.
    </p>
    <p>
      On average, the projections show little change in total annual
      precipitation in California. Furthermore, among several models,
      precipitation projections do not show a consistent trend during the next
      century. However, even modest changes would have a significant impact
      because California ecosystems are conditioned to historical precipitation
      levels and water resources are nearly fully utilized.
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

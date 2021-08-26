<script>
</script>

<style>
  .banner {
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
      url(/img/banners/data.svg);
    background-position: center;
    background-size: cover;
    padding: var(--spacing-48) 0;
  }

  p.lead {
    max-width: 55ch;
  }
</style>

<svelte:head>
  <title>Data | Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<div class="bleed banner overlay">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <h1>Download Data</h1>
        <p class="lead">
          Discover and access climate data for California from the state's
          scientific and research community hosted on Cal-Adapt in the following
          ways.
        </p>
      </div>
    </div>
  </div>
</div>

<div class="bx--grid">
  <div class="bx--row">
    <div class="bx--col">
      <h2>Climate Tools</h2>
      <p>
        All Cal-Adapt climate tools have a “Download Chart” button that you may
        use to download all data and graphics displayed on screen. Any applied
        filters, selected date ranges, or other options and recalculations are
        applied to the exported data. For downloading complete and original time
        series data, use the Data Download Tool, Data Server, or API.
      </p>
      <p><a href="/tools/">Go to Climate Tools</a></p>
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col">
      <h2>Data Download Tool</h2>
      <p>
        Search by climate indicator, publisher or dataset name. Follow a series
        of steps to select a download format (GeoTIFF/CSV), spatial extent,
        emissions scenarios and climate models. Certain datasets have the option
        of downloading resampled data using different spatial and temporal
        aggregations.
      </p>
      <p><a href="/data/download/">Go to Data Download Tool</a></p>
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col">
      <h2>Cal-Adapt Data Server</h2>
      <p>
        All climate data provided by California’s scientific and research
        community is stored in their original formats on the Cal-Adapt Data
        Server. Gridded data are commonly formatted as NetCDF files, while
        station data is commonly formatted as CSV files. Some datasets (e.g. sea
        level rise flood extents) are available as GeoTIFF files. Datasets on
        the server are organized into directories by data provider/source.
        Navigate the directory structure and select files you want to download.
        Links to individual datasets are also included in the Data Download
        Tool.
      </p>
      <p>
        <a href="http://albers.cnr.berkeley.edu/data/"
          >Go to Cal-Adapt Data Server</a
        >
      </p>
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col">
      <h2>Cal-Adapt API</h2>
      <p>
        The Cal-Adapt REST API allows you to programmatically access climate
        data on Cal-Adapt. If you need help getting started, explore code
        samples developed by our developers for processing, downloading, and
        visualizing Cal-Adapt data using the <a
          href="https://berkeley-gif.github.io/caladapt-docs/cookbook.html"
          >Python</a
        >
        and
        <a href="https://observablehq.com/collection/@mukhtyar/cal-adapt"
          >JavaScript</a
        > programming languages.
      </p>
      <p>
        <a href="https://berkeley-gif.github.io/caladapt-docs/"
          >Go to Cal-Adapt API documentation</a
        >
      </p>
    </div>
  </div>

  <div class="bx--row">
    <div class="bx--col">
      <h2>3rd Party Integrations</h2>
      <p>
        The following packages enable working with the Cal-Adapt API using the R
        programming language and the ArcGIS Pro desktop software.
      </p>
      <p>
        <a href="https://ucanr-igis.github.io/caladaptr/">Cal-Adapt R package</a
        >
      </p>
      <p>
        <a href="/data/#">ArcGIS Pro Extension</a>
      </p>
    </div>
  </div>
</div>

<div class="spacing--v-96"></div>

<script>
  import { Button } from "carbon-components-svelte";
  import { ArrowRight16 } from "carbon-icons-svelte";
  import { inview } from "svelte-inview/dist/";
  import PageNav from "~/partials/PageNav.svelte";

  let selectedItem;
  let pageNavItems = [
    { id: "climate-tools", label: "Climate Tools" },
    { id: "data-download-tool", label: "Data Download Tool" },
    { id: "cal-adapt-data-server", label: "Data Server" },
    { id: "cal-adapt-api", label: "Cal-Adapt API" },
    { id: "third-party-integrations", label: "3rd Party Integrations" },
  ];

  const handleEntry = (e) => {
    const { entry } = e.detail;
    selectedItem = entry.target.id;
  };

  const entryOptions = {
    threshold: 1,
  };
</script>

<style>
  .banner {
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
      url(/img/banners/data.svg);
    background-position: center;
    background-size: cover;
    padding: var(--spacing-48) var(--spacing-16);
  }

  p:not(.lead) {
    font-size: 1.125rem;
  }

  p.btn-container {
    text-transform: uppercase;
  }

  .is-sticky {
    top: -1px;
    z-index: 1;
  }
</style>

<svelte:head>
  <title>Data | Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<div class="bleed banner overlay">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col-lg-2"></div>
      <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
        <h1>Download Data</h1>
        <p class="lead">
          Discover and access climate data for California from the state's
          scientific and research community hosted on Cal-Adapt in the following
          ways.
        </p>
      </div>
      <div class="bx--col-lg-5"></div>
    </div>
  </div>
</div>

<div class="bx--grid is-sticky">
  <div class="bx--row">
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-11 bx--col-md-8 bx--col-sm-4">
      <PageNav
        href="{'/data'}"
        items="{pageNavItems}"
        selected="{selectedItem}"
        center="{false}"
        isSticky="{false}"
        zIndex="{'initial'}"
      />
    </div>
    <div class="bx--col-lg-3"></div>
  </div>
</div>

<div class="bx--grid">
  <div
    class="bx--row margin--v-32"
    id="climate-tools"
    use:inview="{entryOptions}"
    on:enter="{handleEntry}"
  >
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <h2>Climate Tools</h2>
      <p>
        All Cal-Adapt climate tools have a “Download Chart” button that you may
        use to download all data and graphics displayed on screen. Any applied
        filters, selected date ranges, or other options and recalculations are
        applied to the exported data. For downloading complete and original time
        series data, use the Data Download Tool, Data Server, or API.
      </p>
      <p class="btn-container">
        <Button icon="{ArrowRight16}" href="/tools/">Climate Tools</Button>
      </p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  <div
    class="bx--row margin--v-32"
    id="data-download-tool"
    use:inview="{entryOptions}"
    on:enter="{handleEntry}"
  >
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <h2>Data Download Tool</h2>
      <p>
        Search by climate indicator, publisher or dataset name. Follow a series
        of steps to select a download format (GeoTIFF/CSV), spatial extent,
        emissions scenarios and climate models. Certain datasets have the option
        of downloading resampled data using different spatial and temporal
        aggregations.
      </p>
      <p class="btn-container">
        <Button icon="{ArrowRight16}" href="/data/download/"
          >Data Download Tool</Button
        >
      </p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  <div
    class="bx--row margin--v-32"
    id="cal-adapt-data-server"
    use:inview="{entryOptions}"
    on:enter="{handleEntry}"
  >
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
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
      <p class="btn-container">
        <Button
          icon="{ArrowRight16}"
          href="http://albers.cnr.berkeley.edu/data/"
          >Cal-Adapt Data Server</Button
        >
      </p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  <div
    class="bx--row margin--v-32"
    id="cal-adapt-api"
    use:inview="{entryOptions}"
    on:enter="{handleEntry}"
  >
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
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
      <p class="btn-container">
        <Button
          icon="{ArrowRight16}"
          href="https://berkeley-gif.github.io/caladapt-docs/"
          >Cal-Adapt API documentation</Button
        >
      </p>
    </div>
    <div class="bx--col-lg-5"></div>
  </div>

  <div
    class="bx--row margin--v-32"
    id="third-party-integrations"
    use:inview="{entryOptions}"
    on:enter="{handleEntry}"
  >
    <div class="bx--col-lg-2"></div>
    <div class="bx--col-lg-9 bx--col-md-8 bx--col-sm-4">
      <h2>3rd Party Integrations</h2>
      <p>
        The following packages enable working with the Cal-Adapt API using the R
        programming language and the ArcGIS Pro desktop software.
      </p>
      <p class="btn-container">
        <Button
          icon="{ArrowRight16}"
          href="https://ucanr-igis.github.io/caladaptr/"
          >Cal-Adapt R package</Button
        >
      </p>
      <p class="btn-container">
        <Button icon="{ArrowRight16}" href="/data/#"
          >ArcGIS Pro Extension</Button
        >
      </p>
    </div>
  </div>
  <div class="bx--col-lg-5"></div>
</div>

<div class="spacing--v-96"></div>

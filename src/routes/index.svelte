<script context="module">
  export function preload() {
    return this.fetch(`blog/events.json`)
      .then(r => r.json())
      .then(events => {
        return { events };
      });
  }
</script>

<script>
  import { Button } from 'carbon-components-svelte';
  import { ArrowRight16 } from 'carbon-icons-svelte';

  import SidebarRight from '../components/partials/SidebarRight.svelte';
  import Sun from '../../static/img/icons/sun.svg';
  import Rainfall from '../../static/img/icons/rainfall.svg';
  import Wildfire from '../../static/img/icons/wildfire.svg';
  import Snowflake from '../../static/img/icons/snowflake.svg';
  import Sea from '../../static/img/icons/sea.svg';
  import Streamflow from '../../static/img/icons/streamflow.svg';

  export let events;

  const icons = [ Sun, Rainfall, Wildfire, Snowflake, Sea, Streamflow];
</script>

<svelte:head>
  <title>Cal-Adapt</title>
</svelte:head>

<!-- Banner -->
<section class="banner overlay overlay-black overlay-40" style="background-image: url(/img/banners/yosemite_2000w.jpg);background-size:cover;">
  <div class="bx--grid">
    <div class="bx--row" style="padding: 0.5rem 1rem;">
      {#each icons as icon}
        <div class="bx--col-1">
          <a href="/tools">
            <div class="icon">{ @html icon }</div>
          </a>
        </div>  
      {/each}
    </div>
    <div class="bx--row">
      <div class="bx--col-md-16 bx--col-lg-12">
        <h1 style="font-size:2rem;">
          Cal-Adapt provides a means of exploring peer-reviewed data portraying how climate change might affect California at the state and local level.
        </h1>
        <p class="lead">
          We make this data available through downloads, visualizations, and the Cal-Adapt API for your research, outreach, and adaptation planning needs.
        </p>
        <Button icon={ArrowRight16} href="/about">LEARN MORE ABOUT CAL-ADAPT</Button>
      </div>
    </div>
  </div>
</section>

<section class="page-grid page-grid--home">
  <div class="content">
    <div class="content-block lift shadow bg-teal-40">
      <a href="/help/get-started" aria-label="get started with climate data"> </a>
      <h3 class="content-block-title">New to Cal-Adapt?</h3>
      <p class="content-block-text">
        Learn how to get started using climate data
      </p>
    </div>
    <div class="content-block lift shadow bg-blue-40 inverse">
      <a href="/tools/local-climate-change-snapshot" aria-label="local climate change snapshot tool"> </a>
      <h3 class="content-block-title">Local Climate Change Snapshot Tool</h3>
    </div>
    <div class="content-block lift shadow bg-blue-60 inverse" style="text-align:center;">
      <a href="/tools" aria-label="explore all climate tools"> </a>
      <h3 class="content-block-title">Explore all Climate Tools</h3>
    </div>
    <div class="content-block lift shadow bg-gray-70 inverse">
      <a href="/data" aria-label="download data"> </a>
      <h3 class="content-block-title">Download Data</h3>
      <p class="content-block-text">
        Download climate data in NetCDF, CSV and GeoTIFF formats for your area
      </p>
    </div>
    <div class="content-block lift shadow bg-teal-20" style="text-align:center;">
      <a href="/help/tutorials" aria-label="gtutorials and webinars">&nbsp;</a>
      <h3 class="content-block-title">Tutorials &amp; Webinars</h3>
    </div>
    <div class="content-block lift shadow bg-teal-80 inverse">
      <a href="/developer" aria-label="developers"> </a>
      <h3 class="content-block-title">Developers</h3>
      <p class="content-block-text">
        Integrate climate data in your workflows with the Cal-Adapt API
      </p>
    </div>
  </div>
  <div class="sidebar-right">
    <SidebarRight show={['events', 'posts']} {events} />
  </div>
  <div class="footer">
    <p class="lead">
      Get the latest Cal-Adapt news, updates &amp; events delivered to your inbox. Subscribe to the Cal-Adapt Newsletter. 
    </p>      
    <Button icon={ArrowRight16} href="/signup">SUBSCRIBE</Button>
  </div>
</section>




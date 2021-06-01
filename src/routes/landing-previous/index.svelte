<script>
  import { Button } from 'carbon-components-svelte';
  import ArrowRight16 from 'carbon-icons-svelte/lib/ArrowRight16';

  import Sun from '../../../static/img/icons/sun.svg';
  import Rainfall from '../../../static/img/icons/rainfall.svg';
  import Wildfire from '../../../static/img/icons/wildfire.svg';
  import Snowflake from '../../../static/img/icons/snowflake.svg';
  import Sea from '../../../static/img/icons/sea.svg';
  import Streamflow from '../../../static/img/icons/streamflow.svg';
  import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft32';
  import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight32';
  import Carousel from '@beyonk/svelte-carousel';
  import { tools } from '../../../content/tools/data';

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
          <div class="icon">{ @html icon }</div>
        </div>  
      {/each}
    </div>
    <div class="bx--row">
      <div class="bx--col-lg-12">
        <h1 class="landing">
          Cal-Adapt provides climate data from California’s scientific and research community and offers a view of how climate change might affect California at the state and local level.
        </h1>
        <p class="lead">
          We make this data available through downloads, visualizations, and the Cal-Adapt API for your research, outreach, and adaptation planning needs.
        </p>
        <Button icon={ArrowRight16} href="/about/">Learn More about Cal-Adapt</Button>
      </div>
    </div>
  </div>
</section>

<!-- Quick Links -->
<section class="bx--grid quick-links">
  <div class="bx--row">
    <div class="bx--col-lg-6">
      <div>
        <h2>
          New to Cal-Adapt?
        </h2>
        <p>
          Learn how to <a href="/help/get-started">get started</a> using climate data on Cal-Adapt.
        </p>
        <p>
          Check out climate data and future projections for your area with our <a href="/tools/local-climate-change-snashot">Local Climate Change Snapshot</a> tool.
        </p>
      </div>
    </div>
    <div class="bx--col-lg-5">
      <div>
        <h2>
          Explore
        </h2>
        <p>
          Take a deeper dive into different climate change indicators via interactive graphs and charts with our suite of <a href="/tools">Climate Tools</a>.
        </p>
      </div>
    </div>
    <div class="bx--col-lg-5">
      <div>
        <h2>
          Get Data
        </h2>
        <p>
          Download climate data in NetCDF, CSV or GeoTiff formats from our <a href="/data">Download Tool</a>. 
        </p>
        <p>
          Learn how to download <a href="/help/faqs/how-can-i-download-data">data and graphics</a> from Cal-Adapt tools.
        </p>
      </div>
    </div>
  </div>  <!-- / end row -->
</section> <!-- / end grid -->

<!-- News -->
<section class="bx--grid news">
  <div class="bx--row">
    <div class="bx--col-lg-7">
      <div class="news-header">
        <h4>From the Cal-Adapt Blog</h4>
        <a href="/blog">See all Posts</a> 
      </div>
      <div class="post overlay overlay-black overlay-60" style="background-image:url('/img/blog/maps-projected-change-maxtemp.png')">
        <div class="post-body">
          <h3>Maps of Projected Change</h3>
          <p>
            The Maps of Projected Change tool allows you to compare long-term historic climate conditions with projected future climate conditions in a quick geographic display. <a href="/blog/maps-projected-change">Read more</a>
          </p>
        </div>
      </div>
    </div>
    <div class="bx--col-lg-6">
      <div class="news-header">
        <h4>Upcoming Events</h4>
        <a href="/blog/events">See all Events</a> 
      </div>
      <div class="events">
        <ul class="list-event">
          <li class="list-event-item">
            <div class="event-date">
              <span class="month">May</span>
              <span class="date">10</span>
              <span class="day">Monday</span>
            </div>
            <div class="event-details">
              <p class="title">
                <a href="blog/events/some-future-event">Some future event</a>
              </p>
              <p class="location">Online</p>
              <p class="time">1:00 PM - 2:00 PM PST</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="bx--col-lg-3 contact">
      <p>
        Get the latest Cal-Adapt news, updates &amp; events delivered to your inbox. 
      </p>
      <p>
        Subscribe to the Cal-Adapt Newsletter. 
      </p>      
      <a href="/signup" class="bx--btn bx--btn--primary">
        Subscribe
      </a>  
    </div>

  </div>
  <div class="bx--row">

  </div> <!-- / end row -->
</section> <!-- / end grid -->

<!-- Tools -->
<section class="bx--grid tools">
  <div class="bx--row">
    <div class="bx--offset-lg-1 bx--col-lg-7 tools-header">
      <h2>
        Explore climate data in greater detail with <a href="/tools" style="white-space:nowrap;">Cal-Adapt Tools</a>
      </h2>
    </div>
    <div class="bx--col-lg-7 tools-text">
      <p>
        View interactive maps and charts showing climate projections for California. Aggregate data by common geographical boundaries or upload your own.
      </p>
    </div>
  </div>
  <div class="bx--row">
    <div class="bx--offset-lg-1 bx--col-lg-14 tools-list">
      <Carousel perPage={4}>
        <span class="control" slot="left-control">
          <ChevronLeft />
        </span>
        {#each tools as opt}
          <div class="slide-content">
            <div class="card shadow lift">
              <div class="card-body">
                <div>
                  {#each opt.icons as icon}
                    <img src="{icon}" alt="icon" style="width:60px;">
                  {/each}
                </div>
                <h4>{opt.title}</h4>
                <p class="truncate">{opt.desc}</p>
                <a class="stretched-link" href="/tools/{opt.slug}" title="Explore »"> </a>
              </div>
            </div>
          </div>
        {/each}
        <span class="control" slot="right-control">
          <ChevronRight />
        </span>
      </Carousel>
    </div>
  </div> <!-- / end row -->
</section> <!-- / end grid -->

<!-- Data -->
<section class="bx--grid data">
  <div class="bx--row">
    <div class="bx--col-lg-8">

      <!-- Image -->
      <div class="device device-macbook">
        <img src="/img/blog/data-download-search.png" class="device-screen" alt="...">
        <img src="/img/devices/macbook.svg" class="img-fluid" alt="...">
      </div>

    </div>
    <div class="bx--col-lg-8">
      <h2>
        Download Data
      </h2>

      <p class="lead">
        Search climate datasets available on Cal-Adapt. <a href="/data" class="text-reset" style="text-decoration:solid underline #6be7ba 1px;text-underline-offset:2px;">Download data</a> for selected climate indicators.
      </p>

      <div class="bx--row">
        <div class="bx--col-lg-8">
          <p>
            Select climate scenarios and global climate models.
          </p>
          <p>
            Aggregate data by decadal, annual, monthly time steps.
          </p>
        </div>
        <div class="bx--col-lg-8">
          <p>
            Get data in NetCDF, CSV or GeoTiff formats.
          </p>
          <p>
            Aggregate gridded data by area.
          </p>
        </div>
      </div>

    </div>
  </div> <!-- / end row -->
</section> <!-- / end grid -->

<!-- API & Help -->
<section class="bx--grid help bg-gray-60 text-white">
  <div class="bx--row">
    <div class="bx--offset-lg-1 bx--col-lg-7">
      <h2>
        For Developers
      </h2>
      <p>
        Learn how to integrate climate data on Cal-Adapt API with your own workflows using R, Python or JavaScript.
      </p>
      <a href="/developer" class="bx--btn bx--btn--secondary">Developers</a>
    </div>
    <div class="bx--col-lg-7">
      <h2>
        Get Help
      </h2>
      <p>
        Explore our Getting Started guide, frequently asked questions and tutorials to learn more about using Cal-Adapt.
      </p>
      <a href="/help" class="bx--btn bx--btn--secondary">Help</a>
    </div>
  </div> <!-- / end row -->
</section> <!-- / end grid -->

<!-- Collaborators -->
<section class="bx--grid partners">
  <div class="bx--row">
    <div class="bx--col-lg-6 partners-text">
      <p class="lead">Cal-Adapt synthesizes downscaled climate change projections and climate impact research from California&#39;s scientific and research community.</p>
    </div>
    <div class="bx--col-lg-10">
      <div class="bx--grid">
        <div class="bx--row partners-images">
          <img src="/img/logos/scripps_logo.svg"  alt="...">
          <img src="/img/logos/ca_dwr.png" class="mx-auto" alt="..." style="height:110px;width:110px;">
          <img src="/img/logos/UCBerkeley_wordmark_blue.svg"  alt="...">
          <img src="/img/logos/cec_900x790.png" class="mx-auto" alt="..." style="height:105px;width:120px;">
          <img src="/img/logos/oehha.png"  alt="...">
          <img src="/img/logos/OCOF-logo.png"  alt="...">
          <img src="/img/logos/logo_UCLA_blue.svg"  alt="...">
          <img src="/img/logos/USGS_ID_green.png" alt="...">
          <img src="/img/logos/UCM_Logo_Lake_Yosemite_Blue.png"  alt="...">
          <img src="/img/logos/boulder-fl-vertical-a-2.png"  alt="...">
        </div>
      </div>
    </div>  
  </div> <!-- / end row -->  
</section> <!-- / end grid -->


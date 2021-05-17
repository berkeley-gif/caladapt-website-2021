<script>
  import { Button } from 'carbon-components-svelte';
  import ArrowRight16 from 'carbon-icons-svelte/lib/ArrowRight16';

  import Sun from '../../static/img/icons/sun.svg';
  import Rainfall from '../../static/img/icons/rainfall.svg';
  import Wildfire from '../../static/img/icons/wildfire.svg';
  import Snowflake from '../../static/img/icons/snowflake.svg';
  import Sea from '../../static/img/icons/sea.svg';
  import Streamflow from '../../static/img/icons/streamflow.svg';

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
    <div class="content-block lift bg-teal-20">
      <a href="/help/get-started"> </a>
      <h3 class="content-block-title">New to Cal-Adapt?</h3>
      <p class="content-block-text">
        Learn how to get started using climate data
      </p>
    </div>
    <div class="content-block lift inverse bg-blue-40">
      <a href="/tools/local-climate-change-snapshot"> </a>
      <h3 class="content-block-title">Local Climate Change Snapshot Tool</h3>
    </div>
    <div class="content-block lift bg-gray-20" style="text-align:center;">
      <a href="/tools"> </a>
      <h3 class="content-block-title">Explore all Climate Tools</h3>
    </div>
    <div class="content-block lift bg-gray-30">
      <a href="/data"> </a>
      <h3 class="content-block-title">Download Data</h3>
      <p class="content-block-text">
        Download climate data in NetCDF, CSV and GeoTIFF formats for your area
      </p>
    </div>
    <div class="content-block lift inverse bg-teal-70" style="text-align:center;">
      <a href="/help/tutorials"> </a>
      <h3 class="content-block-title">Tutorials &amp; Webinars</h3>
    </div>
    <div class="content-block lift bg-teal-10">
      <a href="/developer"> </a>
      <h3 class="content-block-title">Developers</h3>
      <p class="content-block-text">
        Integrate climate data in your workflows with the Cal-Adapt API
      </p>
    </div>
  </div>
  <div class="sidebar-right">
    <div class="sidebar-block">
      <h4 class="sidebar-block-title">Upcoming Events</h4>
      <ul class="sidebar-block-list">
        <li class="item">
          <h5 class="item-title">Monday, May 10th</h5>
          <p class="item-text">
            <a href="blog/events/some-future-event">Some future event</a>
          </p>
          <p class="item-text">Online, 1:00 PM - 2:00 PM PST</p>
        </li>
      </ul>
      <span class="sidebar-block-link">
        <a href="/blog/events">See All Events</a>
      </span>
    </div>
    <div class="sidebar-block">
      <h4 class="sidebar-block-title">Latest on Cal-Adapt Blog</h4>
      <ul class="sidebar-block-list">
        <li class="item">
          <h5 class="item-title">Maps of Projected Change</h5>
          <p class="item-text">
            The Maps of Projected Change tool allows you to compare long-term historic climate conditions with projected future climate conditions in a quick geographic display. <a href="/blog/maps-projected-change">Read more</a>
          </p>
        </li>
      </ul>
      <span class="sidebar-block-link">
        <a href="/blog">See All Posts</a>
      </span>
    </div>
  </div>
  <div class="footer">
    <p class="lead">
      Get the latest Cal-Adapt news, updates &amp; events delivered to your inbox with the Cal-Adapt Newsletter.
    </p>
    <Button icon={ArrowRight16} href="/signup">SUBSCRIBE</Button>
  </div>
</section>




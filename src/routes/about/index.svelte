<script>
  import {
    SideNavItems,
    // SideNavMenu,
    // SideNavMenuItem,
    SideNavLink,
  } from 'carbon-components-svelte';
  import data from './_data.json';
  const { advisors, staff, managers } = data;

  let currentView = 'explore';

  const tac = [...advisors.current, ...advisors.prior];

  function selectView(e) {
    console.log('selectview', e);
  }
</script>

<style lang="scss">
  .banner {
    background-image: url(/img/banners/brian-wangenheim-p7j_nddDMdo-unsplash.jpg);
    background-position: center 35%;
    background-size: cover;
    min-height: 350px;
  }

  .secondary-nav {
    width: 100%;
    background: rgba(250, 251, 251, 1);
    border-bottom: 1px solid #dadee1;
    background: #dadee1;
    top: 0;
  }

  .secondary-nav :global(.bx--side-nav__items) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0;
  }

  .list-prior {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    li {
      width: calc(33% - 2rem);
      margin: 0.35rem;
    }
  }

  .contributors {
    display: flex;
    flex-wrap: wrap;

    img {
      max-width: 175px;
      height: 100%;
      display: block;
      margin: 1rem;
      self-align: center;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logos {
    display: flex;
    justify-content: center;
    align-content: center;

    img {
      width: 100px;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
    }
  }

  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
</style>

<svelte:head>
  <title>About | Cal-Adapt</title>
</svelte:head>

<section class="banner overlay overlay-black overlay-60">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <h1>
          About Cal-Adapt
        </h1>
        <p class="lead">
          Cal-Adapt provides a means of exploring peer-reviewed data portraying how climate change might affect California at the state and local level. We make this data available through downloads, visualizations, and the Cal-Adapt API for your research, outreach, and adaptation planning needs.  
        </p>
        <p class="lead">
          Cal-Adapt is a collaboration between state agency funding programs, university and private sector researchers.
        </p>
      </div>
    </div>
  </div>
</section>

<div class="secondary-nav is-sticky">
  <SideNavItems>
    <SideNavLink
      href="/about/#what"
      text="Collaborators"
    />
    <SideNavLink
      href="/about/#goal"
      text="Our Goal"
    />
    <SideNavLink
      href="/about/#audience"
      text="Our Audience"
    />
    <SideNavLink
      href="/about/#background"
      text="Background"
    />
    <SideNavLink
      href="/about/#oversight"
      text="Advisory Oversight"
    />
    <SideNavLink
      href="/about/#gif"
      text="About the GIF"
    />
  </SideNavItems>
</div>

<div class="content" style="margin: 2rem 4rem;">
  <div class="bx--grid">
    <div class="bx--row" id="what">
      <div class="bx--col-lg-16 logos">
        <div class="col">
          <h4>Funding and Oversight</h4>
          <div>
            <div class="logo">
              <img src="img/logos/cec_900x790.png" alt="logo for California Energy Commission"/>
              <a href="http://www.energy.ca.gov/" target="_blank">California Energy Commission</a>
            </div>
            <div class="logo">
              <img src="img/logos/SGC-Brand-Logos-White-11.png" alt="logo for California Strategic Growth Council" style="width:200px;background:#838b92;" />
              <a href="http://sgc.ca.gov/" target="_blank">California Strategic Growth Council</a>
            </div>        
          </div>
        </div>
        <div class="col">
          <h4>Site Development</h4>
          <div class="col-link">
            <div class="logo">
              <img src="img/logos/gif_249x100.png"  style="width:200px;" alt="Geospatial Innovation Facility logo"/>
              <a href="http://gif.berkeley.edu/" target="_blank">Geospatial Innovation Facility</a>
            </div>
          </div>
        </div>
        <div class="col">
          <h4>Science Advisor</h4>
          <div class="col-link">
            <div class="logo">
              <img src="img/logos/eagle-rock-analytics-logo-black_3.png" alt="logo for Eagle Rock Analytics"/>
              <a href="http://www.eaglerockanalytics.com/" target="_blank">Eagle Rock Analytics</a>
            </div>
          </div>
        </div>
      </div>
      <div class="bx--col-lg-16">
        <h3>List of data contributors:</h3>
        <div class="contributors">
          <img src="/img/logos/scripps_logo.svg"  alt="...">
          <img src="/img/logos/ca_dwr.png" class="mx-auto" alt="..." style="height:100px;width:100px;">
          <img src="/img/logos/UCBerkeley_wordmark_blue.svg"  alt="...">
          <img src="/img/logos/oehha.png"  alt="...">
          <img src="/img/logos/OCOF-logo.png"  alt="...">
          <img src="/img/logos/logo_UCLA_blue.svg"  alt="...">
          <img src="/img/logos/USGS_ID_green.png" alt="...">
          <img src="/img/logos/UCM_Logo_Lake_Yosemite_Blue.png"  alt="...">
          <img src="/img/logos/boulder-fl-vertical-a-2.png"  alt="...">
        </div>
      </div>
    </div>
    <div class="bx--row" id="goal">
      <div class="bx--col">
        <h2>Our Goal</h2>
        <p>
          Our goal is to make data portraying climate change in California more accessible and actionable for a broad audience, with an emphasis on energy sector stakeholders and local governments. We do this by:
        </p>
        <ul>
          <li>
            Building tools for exploring and downloading high-quality, peer-reviewed climate data from California’s scientific and research community. Cal-Adapt presents research developed under California’s climate change assessments, with Cal-Adapt 2.0 focusing on <a href="https://www.climateassessment.ca.gov/" target="_blank">California’s Fourth Climate Change Assessment</a>, including datasets portraying sea level rise, wildfires, droughts, storms, and extreme heat events.
          </li>
          <li>
            Designing tools and content to help users better understand climate data (via tooltips, <a href="/developer">Glossary</a> and <a href="/blog">Cal-Adapt Blog</a>) and learn best practices for working with climate projections (see our <a href="/help/get-started">Get Started</a> guide). We make it easy to share charts and tables of climate data with stakeholders and provide options for customizing data visualizations to meet sector specific requirements in some of our more technical tools.
          </li>
          <li>Building a publicly available <a href="/developer">Cal-Adapt API</a> to empower researchers and developers to integrate climate data on Cal-Adapt into existing workflows and develop domain specific applications.</li>
          <li>
            Engaging with and learning from our users through workshops, webinars and stakeholder outreach.
          </li>
        </ul>
      </div>
    </div>
    <div class="bx--row" id="audience">
      <div class="bx--col">
        <h2>Our Audience</h2>
        <p>
          Cal-Adapt offers free public access to peer-reviewed data that support exploration of California’s climate change impacts on state infrastructure, communities, and natural resources. Our users include energy sector stakeholders, infrastructure managers, municipal planners, community-based organizations, state agencies, scientists and climate experts, educators, and interested participants from the general public. 
        </p>
      </div>
    </div>
    <div class="bx--row" id="background">
      <div class="bx--col">
        <h2>Background</h2>
        <p>
          The <a href="http://www.energy.ca.gov/" target="_blank">California Energy Commission</a> (CEC) and UC Berkeley’s <a href="http://gif.berkeley.edu/" target="_blank">Geospatial Innovation Facility</a> (GIF) initially released Cal-Adapt to the public in 2011 as a web-based resource to showcase the innovative climate change research being produced by the scientific community in California, as recommended in the <a href="https://resources.ca.gov/CNRALegacyFiles/docs/climate/Statewide_Adaptation_Strategy.pdf" target="_blank">2009 California Climate Adaptation Strategy</a>. 
        </p>
        <p>
          The GIF, with funding support from the CEC, developed and launched the current iteration of Cal-Adapt (version 2.0) as part of <a href="https://www.climateassessment.ca.gov/" target="_blank">California’s Fourth Climate Change Assessment</a>. This version includes updates and enhancements that increase its ease of use, information value, interactive visualizations, and data accessibility. Cal-Adapt's design and functionality have been developed in collaboration with a variety of beta testers and advisory committee members who provided valuable feedback throughout several iterations of updates. 
        </p>
        <p>
          Cal-Adapt has been recognized by California’s legislature as a key resource to support local hazard mitigation efforts and has helped California move forward on climate policy by providing easy access and exploration of high-resolution, regionally downscaled climate projections that are sanctioned by the state to be used in climate adaptation resiliency and planning. The website continues to evolve to present the latest scientific data and to further support stakeholders in understanding climate-related impacts relevant to local decision making.
        </p>
        <p>
          For more detailed information on the background and development of Cal-Adapt see: 
        </p>
        <p class="reference">
          Thomas, Nancy, Mukhtyar, Shruti, Galey, Brian, Kelly, Maggi. (University of California Berkeley). 2018. <a href="https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-015_ADA.pdf" target="_blank">Cal-Adapt: Linking Climate Science with Energy Sector Resilience and Practitioner Need</a>. California’s Fourth Climate Change Assessment, California Energy Commission. Publication Number: CCCA4-CEC-2018-015.
          </p>
      </div>
    </div>
    <div class="bx--row" id="oversight">
      <div class="bx--col-lg-16">
        <h2>Advisory Oversight</h2>
        <p>
          Cal-Adapt project managers:
        </p>
        <ul>
          {#each managers as opt}
            <li>
              { opt.name }, { opt.org }
            </li>
          {/each}
        </ul>
        <p>
          We would like to thank our current and prior advisory committee members for their services.
        </p>
        <ul class="list-prior">
          {#each tac as opt}
            <li>
              { opt.name }
            </li>
          {/each}
        </ul>
      </div>
    </div>
    <div class="bx--row" id="gif">
      <div class="bx--col-lg-16">
        <h2>About the GIF</h2>
        <p>
          The <a href="http://gif.berkeley.edu/" target="_blank">Geospatial Innovation Facility</a> at <a href="https://www.berkeley.edu/" target="_blank">UC Berkeley</a>'s <a href="https://nature.berkeley.edu/" target="_blank">College of Natural Resources</a> provides leadership and training across a broad array of integrated mapping technologies. Our goal is to help people better understand the changing world through the analysis and visualization of spatial data. We develop engaging applications that leverage and build upon state-of-the-art geospatial and web technologies, and provide opportunities for researchers to learn how they can use spatial data to answer critical questions.
        </p>
      </div>
    </div>
    <div class="bx--row" id="gif">
      <div class="bx--col-lg-16">
        <h3 class="h4">Our Team:</h3>
      </div>
    </div>
    <ul class="bx--row">
      {#each staff.current as opt}
        <li class="bx--col-lg-8" style="padding:0.5rem;">
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title">
               { opt.name }
              </h5>
              <p class="font-weight--light">
                { opt.org }
              </p>
            </div>
          </div>
        </li>
      {/each}
    </ul>
    <div class="bx--row">
      <div class="bx--col">
        <h3 class="h4">Previous Contributors:</h3>
        <ul class="list-prior">
          {#each staff.prior as opt}
            <li>
              { opt.name }
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div> <!-- end grid --> 
</div>
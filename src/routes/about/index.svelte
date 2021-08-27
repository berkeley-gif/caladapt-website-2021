<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";

  import PageNav from "../../partials/PageNav.svelte";
  import data from "./_data.json";

  const { advisors, staff, managers } = data;

  let items = [
    {
      id: "mission",
      label: "Our Mission",
    },
    {
      id: "audience",
      label: "Our Audience",
    },
    {
      id: "partners",
      label: "Our Partners",
    },
    {
      id: "background",
      label: "Background",
    },
    {
      id: "team",
      label: "Our Team",
    },
  ];
  let href = "/about";
  let selected;

  const handleEntry = (e) => {
    const { entry } = e.detail;
    selected = entry.target.id;
  };
  const entryOptions = {
    threshold: 0.5,
  };
</script>

<style lang="scss">
  .banner {
    background-image: url(/img/banners/brian-wangenheim-p7j_nddDMdo-unsplash.jpg);
    background-position: center 35%;
    background-size: cover;
    min-height: 350px;
  }

  .content {
    margin: 2rem 4rem;
  }

  .order-1 {
    order: 0;
  }

  .contributor-list {
    display: flex;
    flex-wrap: wrap;
  }

  .contributor {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    height: 100px;

    img {
      height: 100%;
    }
  }

  .collaborator {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    height: 150px;
    background: var(--gray-20);
    justify-content: space-between;

    img {
      width: 100px;
    }
  }

  #team {
    background: var(--gray-20);
    padding: 2rem 0;

    :global(.bx--tabs__nav) {
      width: 100%;
      text-transform: uppercase;
      margin-top: 1rem;
    }

    :global(a.bx--tabs__nav-link) {
      width: 100%;
      text-align: center;
    }
  }

  p.team-text {
    padding: 2rem;
    margin-bottom: 0;
  }

  .team-members {
    display: flex;
    flex-wrap: wrap;
    padding: 0 2rem;
    justify-content: center;

    &.managers {
      margin: 2rem 0;

      .card {
        width: calc(50% - 2rem);
      }
    }

    .card {
      width: calc(33% - 2rem);
      margin: 0.25rem;
      text-align: center;
    }
  }

  .team-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: 4rem;

    li {
      width: calc(25% - 2rem);
      margin: 0.25rem;
    }
  }

  @media (max-width: 1000px) {
    .content {
      margin: 2rem auto;
    }

    .order-1 {
      order: 1;
    }

    figure {
      margin: 0;
    }

    .team-members .card,
    .team-members.managers .card,
    .team-list li {
      width: 100%;
    }
  }
</style>

<svelte:head>
  <title>About | Cal-Adapt</title>
</svelte:head>

<section class="banner overlay overlay-black overlay-60">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <h1>About Cal-Adapt</h1>
        <p class="lead">
          Cal-Adapt provides a means of exploring peer-reviewed data portraying
          how climate change might affect California at the state and local
          level. We make this data available through downloads, visualizations,
          and the Cal-Adapt API for your research, outreach, and adaptation
          planning needs.
        </p>
        <p class="lead">
          Cal-Adapt is a collaboration between state agency funding programs,
          university and private sector researchers.
        </p>
      </div>
    </div>
  </div>
</section>

<PageNav href="{href}" items="{items}" selected="{selected}" />

<div
  class="bx--grid content"
  id="mission"
  use:inview="{entryOptions}"
  on:enter="{handleEntry}"
>
  <div class="bx--row">
    <div class="bx--col-lg-6 center">
      <figure class="quote">
        <blockquote cite="https://www.climateassessment.ca.gov/">
          <p>
            California is one of the most “climate-challenged” regions of North
            America; its historical climate is extremely variable, and climate
            change is making extreme conditions more frequent and severe.
            California’s temperatures are already warming, heat waves are more
            frequent, and precipitation continues to be highly variable.
          </p>
        </blockquote>
        <figcaption>
          <cite
            >- A Summary of Key Findings from California’s Fourth Climate Change
            Assessment</cite
          >
        </figcaption>
      </figure>
    </div>
    <div class="bx--col-lg-10">
      <hr />
      <h2>Our Mission</h2>
      <p>
        Our mission is to make data portraying climate change in California more
        accessible and actionable for a broad audience, with an emphasis on
        energy sector stakeholders and local governments. We do this by:
      </p>
      <ul>
        <li>
          Building tools for exploring and downloading high-quality,
          peer-reviewed climate data from California’s scientific and research
          community. Cal-Adapt presents research developed under California’s
          climate change assessments, with Cal-Adapt 2.0 focusing on <a
            href="https://www.climateassessment.ca.gov/"
            target="_blank">California’s Fourth Climate Change Assessment</a
          >, including datasets portraying sea level rise, wildfires, droughts,
          storms, and extreme heat events.
        </li>
        <li>
          Designing tools and content to help users better understand climate
          data (via tooltips, <a href="/help/glossary">Glossary</a> and
          <a href="/blog">Cal-Adapt Blog</a>) and learn best practices for
          working with climate projections (see our
          <a href="/help/get-started">Get Started</a> guide). We make it easy to
          share charts and tables of climate data with stakeholders and provide options
          for customizing data visualizations to meet sector specific requirements
          in some of our more technical tools.
        </li>
        <li>
          Building a public <a href="/data">Cal-Adapt API</a> to empower researchers
          and developers to integrate climate data on Cal-Adapt into existing workflows
          and develop domain specific applications.
        </li>
        <li>
          Engaging with and learning from our users through workshops, webinars
          and stakeholder outreach.
        </li>
      </ul>
    </div>
  </div>
</div>

<div
  class="bx--grid content"
  id="audience"
  use:inview="{entryOptions}"
  on:enter="{handleEntry}"
>
  <div class="bx--row">
    <div class="bx--col-lg-6 center order-1">
      <figure class="image">
        <img
          src="/img/banners/gif-workshop.jpg"
          style="padding:1rem;"
          alt="workshop at GIF"
        />
      </figure>
    </div>
    <div class="bx--col-lg-10">
      <hr />
      <h2>Our Audience</h2>
      <p>
        Cal-Adapt offers free public access to peer-reviewed data that support
        exploration of California’s climate change impacts on state
        infrastructure, communities, and natural resources. Our users include
        energy sector stakeholders, infrastructure managers, municipal planners,
        community-based organizations, state agencies, scientists and climate
        experts, educators, and interested participants from the general public.
      </p>
    </div>
  </div>
</div>

<div
  class="bx--grid content"
  id="partners"
  use:inview="{entryOptions}"
  on:enter="{handleEntry}"
>
  <div class="bx--row">
    <div class="bx--col-lg-6 center d-md-none">
      <figure class="quote">
        <blockquote
          cite="https://resources.ca.gov/CNRALegacyFiles/docs/climate/Statewide_Adaptation_Strategy.pdf"
        >
          <p>
            The California Energy Commission will develop the Cal-Adapt Web site
            that will synthesize existing California climate change scenarios
            and climate impact research and to encourage its use in a way that
            is beneficial for local decision-makers.
          </p>
        </blockquote>
        <figcaption>
          <cite
            >- A key recommendation of the 2009 California Climate Adaptation
            Strategy</cite
          >
        </figcaption>
      </figure>
    </div>
    <div class="bx--col-lg-10">
      <hr />
      <h2>Our Partners</h2>
      <div class="bx--row">
        <div class="bx--col">
          <h3 class="h5">Funding and Oversight</h3>
        </div>
      </div>
      <div class="bx--row">
        <div class="bx--col-lg-8">
          <div class="collaborator">
            <img
              src="img/logos/cec_900x790.png"
              alt="logo for California Energy Commission"
            />
            <a href="http://www.energy.ca.gov/" target="_blank"
              >California Energy Commission</a
            >
          </div>
        </div>
        <div class="bx--col-lg-8">
          <div class="collaborator">
            <img
              src="img/logos/SGC-Brand-Logos-03.png"
              alt="logo for California Strategic Growth Council"
              style="width:200px;"
            />
            <a href="http://sgc.ca.gov/" target="_blank"
              >California Strategic Growth Council</a
            >
          </div>
        </div>
      </div>
      <div class="bx--row">
        <div class="bx--col-lg-8">
          <h3 class="h5">Site Development</h3>
          <div class="collaborator">
            <img
              src="img/logos/gif_249x100.png"
              style="width:200px;"
              alt="Geospatial Innovation Facility logo"
            />
            <a href="http://gif.berkeley.edu/" target="_blank"
              >Geospatial Innovation Facility</a
            >
          </div>
        </div>
        <div class="bx--col-lg-8">
          <h3 class="h5">Science Advisor</h3>
          <div class="collaborator">
            <img
              src="img/logos/eagle-rock-analytics-logo-black_3.png"
              alt="logo for Eagle Rock Analytics"
            />
            <a href="http://www.eaglerockanalytics.com/" target="_blank"
              >Eagle Rock Analytics</a
            >
          </div>
        </div>
      </div>
      <div class="bx--row"></div>
      <div class="bx--row">
        <div class="bx--col">
          <h3 class="h5">Data Contributors</h3>
          <div class="contributor-list">
            <div class="contributor">
              <img
                src="/img/logos/scripps_logo.svg"
                alt="logo for Scripps Institution of Oceanography"
              />
            </div>
            <div class="contributor">
              <img
                src="/img/logos/ca_dwr.png"
                alt="logo for California Department of Water Resources"
                style="height:100px;width:100px;"
              />
            </div>
            <div class="contributor">
              <img
                src="/img/logos/UCBerkeley_wordmark_blue.svg"
                alt="logo for University of California Berkeley"
              />
            </div>
            <div class="contributor">
              <img
                src="/img/logos/OCOF-logo.png"
                alt="logo for Our Coast Our Future"
              />
            </div>
            <div class="contributor">
              <img
                src="/img/logos/logo_UCLA_blue.svg"
                alt="logo for University of California Los Angeles"
              />
            </div>
            <div class="contributor">
              <img
                src="/img/logos/USGS_ID_green.png"
                alt="logo for United States Geological Survey"
              />
            </div>
            <div class="contributor">
              <img
                src="/img/logos/UCM_Logo_Lake_Yosemite_Blue.png"
                alt="logo for University of California Merced"
              />
            </div>
            <div class="contributor">
              <img
                src="/img/logos/boulder-fl-vertical-a-2.png"
                alt="logo for University of Colorado Boulder"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div
  class="bx--grid content"
  id="background"
  use:inview="{entryOptions}"
  on:enter="{handleEntry}"
>
  <div class="bx--row">
    <div class="bx--col-lg-6 center order-1">
      <a
        href="https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-015_ADA.pdf"
        target="_blank"
      >
        <figure class="image">
          <img
            src="/img/illustrations/caladapt-report-cover.png"
            class="report shadow"
            alt="caladapt report cover"
          />
          <figcaption>
            Read our technical report for the Fourth Assessment for more
            detailed information on the background and development of Cal-Adapt.
          </figcaption>
        </figure>
      </a>
    </div>
    <div class="bx--col-lg-10">
      <hr />
      <h2>Background</h2>
      <p>
        The <a href="http://www.energy.ca.gov/" target="_blank"
          >California Energy Commission</a
        >
        (CEC) and UC Berkeley’s
        <a href="http://gif.berkeley.edu/" target="_blank"
          >Geospatial Innovation Facility</a
        >
        (GIF) initially released Cal-Adapt to the public in 2011 as a web-based resource
        to showcase the innovative climate change research being produced by the
        scientific community in California, as recommended in the
        <a
          href="https://resources.ca.gov/CNRALegacyFiles/docs/climate/Statewide_Adaptation_Strategy.pdf"
          target="_blank">2009 California Climate Adaptation Strategy</a
        >.
      </p>
      <p>
        The GIF, with funding support from the CEC, developed and launched the
        current iteration of Cal-Adapt (version 2.0) as part of <a
          href="https://www.climateassessment.ca.gov/"
          target="_blank">California’s Fourth Climate Change Assessment</a
        >. This version includes updates and enhancements that increase its ease
        of use, information value, interactive visualizations, and data
        accessibility. Cal-Adapt's design and functionality have been developed
        in collaboration with a variety of beta testers and advisory committee
        members who provided valuable feedback throughout several iterations of
        updates.
      </p>
      <p>
        Cal-Adapt has been recognized by California’s legislature as a key
        resource to support local hazard mitigation efforts and has helped
        California move forward on climate policy by providing easy access and
        exploration of high-resolution, regionally downscaled climate
        projections that are sanctioned by the state to be used in climate
        adaptation resiliency and planning. The website continues to evolve to
        present the latest scientific data and to further support stakeholders
        in understanding climate-related impacts relevant to local decision
        making.
      </p>
    </div>
  </div>
</div>

<div
  class="bx--grid--full-width"
  id="team"
  use:inview="{entryOptions}"
  on:enter="{handleEntry}"
>
  <div class="bx--row">
    <div class="bx--col center">
      <hr />
      <h2>Our Team</h2>
    </div>
  </div>
  <div class="bx--row center">
    <div class="bx--ofset-lg-2 bx--col-lg-12">
      <Tabs>
        <Tab label="Site Development" />
        <Tab label="Contract Management" />
        <Tab label="Advisory Oversight" />
        <div slot="content">
          <TabContent>
            <p class="team-text">
              The <a href="http://gif.berkeley.edu/" target="_blank"
                >Geospatial Innovation Facility</a
              >
              at
              <a href="https://www.berkeley.edu/" target="_blank">UC Berkeley</a
              >'s
              <a href="https://nature.berkeley.edu/" target="_blank"
                >College of Natural Resources</a
              > provides leadership and training across a broad array of integrated
              mapping technologies. Our goal is to help people better understand
              the changing world through the analysis and visualization of spatial
              data.
            </p>
            <div class="team-members">
              {#each staff.current as opt}
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">
                      {opt.name}
                    </h5>
                    <p class="font-weight--light">
                      {opt.org}
                    </p>
                  </div>
                </div>
              {/each}
            </div>
            <p class="team-text">Previous contributors:</p>
            <ul class="team-list">
              {#each staff.prior as opt}
                <li style="flex: 1 0 auto;">
                  {opt.name}
                </li>
              {/each}
            </ul>
          </TabContent>
          <TabContent>
            <div class="team-members managers">
              {#each managers as opt}
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">
                      {opt.name}
                    </h5>
                    <p class="font-weight--light">
                      {opt.org}
                    </p>
                  </div>
                </div>
              {/each}
            </div>
          </TabContent>
          <TabContent>
            <p class="team-text">
              Our Technical Advisory Committee (TAC) is composed of experts from
              state and local government, utilities, consulting firms and
              academia. We thank the following people for serving on our TACs.
              If you are interested in serving on our TAC in the future, please
              email nethomas@berkeley.edu.
            </p>
            <ul class="team-list">
              {#each advisors.current as opt}
                <li>
                  {opt.name}
                  {#if opt.org}
                    <br /><span class="small text-gray-70">{opt.org}</span>
                  {/if}
                </li>
              {/each}
            </ul>
            <p class="team-text">Previous contributors:</p>
            <ul class="team-list">
              {#each advisors.prior as opt}
                <li>
                  {opt.name}
                </li>
              {/each}
            </ul>
          </TabContent>
        </div>
      </Tabs>
    </div>
  </div>
</div>

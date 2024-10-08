<script context="module">
  export async function preload() {
    return {
      data: await (await this.fetch("about.json")).json(),
    };
  }
</script>

<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";
  import { Banner, PageNav } from "~/partials";

  export let data;

  const { advisors, staff, managers } = data;

  const subtitleText = [
    `Cal-Adapt provides a way to explore peer-reviewed data that portrays
      how climate change might affect California at the state and local
      level. We make this data available through downloads, visualizations,
      and the Cal-Adapt API for your research, outreach, and adaptation
      planning needs.`,
    `Cal-Adapt is a collaboration between state agency funding programs, university, 
    national lab and private sector researchers.`,
  ];

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
      id: "leadership",
      label: "Cal-Adapt Leadership",
    },
    {
      id: "partners",
      label: "Our Partners",
    },
    {
      id: "roadmap",
      label: "Our Roadmap",
    },
    /*     {
      id: "team",
      label: "Our Team",
    }, */
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
  @import "scss/site/mixins/media-queries";

  figure {
    margin: 0;

    @include media("<=large") {
      margin: 2rem;
    }

    @include media("<=medium") {
      margin: 2rem 0;
    }
  }

  img.workshop {
    max-width: 100%;
    margin: 1rem 0;
    height: auto;
  }

  img.report {
    @include media("<=large") {
      max-width: 60%;
      margin: 0;
    }
  }

  hr {
    margin-top: 3rem;
  }

  h2:not(:first-of-type) {
    margin-top: 0;
  }

  li:not(.bx--side-nav__item):not(.team-list-prev-name),
  p:not(.lead):not(.card-title):not(.card-org) {
    font-size: 1.125rem;
    margin-bottom: calc(1.125rem * 1.5);
  }

  li {
    margin-left: 2rem;
    margin-bottom: 1.5rem;
  }

  .sidebar-figure-container {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .is-sticky {
    top: -1px;
    z-index: 1;
  }

  .contributor {
    height: 7.25rem;

    img {
      height: 100%;
    }

    @include media("<=large") {
      display: flex;
      flex-direction: column;
      align-items: center;
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

  /*   .tabs-container {
    margin-bottom: 4rem;

    :global(.bx--tabs__nav) {
      width: 100%;
      text-transform: uppercase;
      margin-top: 1rem;
    }

    :global(a.bx--tabs__nav-link) {
      width: 100%;
    }
  }

  .card-title {
    font-weight: 600;
    font-size: 1rem;
  }

  p.team-text {
    margin-top: 2rem;
    margin-bottom: 2rem;

    &.team-text-prev {
      margin-bottom: 1rem;
    }
  }

  .team-members {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .team-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 0.5rem;

    li {
      list-style-type: none;
      margin: 0;
    }
  }

  .team-list-advisory {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(25% - 1rem), 1fr));
    grid-gap: 0.5rem;

    .card-title {
      font-size: 0.875rem;
    }

    @include media("<=medium") {
      grid-template-columns: repeat(auto-fill, minmax(calc(50% - 1rem), 1fr));
    }
  } */
</style>

<svelte:head>
  <title>About | Cal-Adapt</title>
</svelte:head>

<Banner
  titleText="About Cal-Adapt"
  subtitleText="{subtitleText}"
  bannerImg="/img/banners/brian-wangenheim-p7j_nddDMdo-unsplash_1600x400.jpg"
  bannerImgMobile="/img/banners/brian-wangenheim-p7j_nddDMdo-unsplash_700x800.jpg"
/>

<!-- page anchor navigation -->
<div class="bx--grid is-sticky">
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-9 bx--col-sm-0">
      <PageNav href="{href}" items="{items}" selected="{selected}" />
    </div>
  </div>
</div>

<div class="bx--grid">
  <!-- Mission -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <div id="mission" use:inview="{entryOptions}" on:enter="{handleEntry}">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make data portraying climate change in California
          more accessible and actionable for a broad audience, with an emphasis
          on energy sector stakeholders and local governments. We do this by:
        </p>
        <ul>
          <li>
            Building tools for exploring and downloading high-quality,
            peer-reviewed climate data from California’s scientific and research
            community. Cal-Adapt presents research developed under <a
              href="https://opr.ca.gov/climate/icarp/climate-assessment/"
              target="_blank">California’s climate change assessments</a
            >, with Cal-Adapt 2.0 focusing on
            <a href="https://www.climateassessment.ca.gov/" target="_blank"
              >California’s Fourth Climate Change Assessment</a
            >, including datasets portraying sea level rise, wildfires,
            droughts, storms, and extreme heat events.
          </li>
          <li>
            Designing tools and content to help users better understand climate
            data (via tooltips, <a sapper:prefetch href="/help/glossary"
              >Glossary</a
            >
            and
            <a sapper:prefetch href="/blog">Cal-Adapt Blog</a>) and learn best
            practices for working with climate projections (see our
            <a sapper:prefetch href="/help/get-started">Get Started</a> guide). We
            make it easy to share charts and tables of climate data with stakeholders
            and provide options for customizing data visualizations to meet sector
            specific requirements in some of our more technical tools.
          </li>
          <li>
            Building a public <a sapper:prefetch href="/data">Cal-Adapt API</a> to
            empower researchers and developers to integrate climate data on Cal-Adapt
            into existing workflows and develop domain specific applications.
          </li>
          <li>
            Engaging with and learning from our users through workshops,
            webinars and stakeholder outreach.
          </li>
        </ul>
      </div>
    </div>

    <div class="bx--offset-lg-1 bx--col-lg-5 bx--col-padding">
      <div class="sidebar-figure-container">
        <figure class="quote">
          <blockquote cite="https://www.climateassessment.ca.gov/">
            <p>
              California is one of the most 'climate-challenged' regions of
              North America; its historical climate is extremely variable, and
              climate change is making extreme conditions more frequent and
              severe. California’s temperatures are already warming, heat waves
              are more frequent, and precipitation continues to be highly
              variable.
            </p>
          </blockquote>
          <figcaption>
            <cite
              >— A Summary of Key Findings from California’s Fourth Climate
              Change Assessment</cite
            >
          </figcaption>
        </figure>
      </div>
    </div>
  </div>

  <!-- Rule -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <hr />
    </div>
  </div>

  <!-- Audience -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <div id="audience" use:inview="{entryOptions}" on:enter="{handleEntry}">
        <h2>Our Audience</h2>
      </div>
    </div>
    <div class="bx--col-lg-0 bx--col-md-8 bx--col-sm-4">
      <img
        width="780"
        height="352"
        class="workshop"
        src="/img/banners/gif-workshop-780w.jpg"
        alt="Workshop at GIF"
      />
    </div>
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <p>
        Cal-Adapt offers free public access to peer-reviewed data that support
        exploration of California’s climate change impacts on state
        infrastructure, communities, and natural resources. Our users include
        energy sector stakeholders, infrastructure managers, municipal planners,
        community-based organizations, state agencies, scientists and climate
        experts, educators, and interested participants from the general public.
      </p>
    </div>

    <div
      class="bx--offset-lg-1 bx--col-lg-4 bx--col-md-0 bx--col-sm-0 bx--col-padding"
    >
      <div class="sidebar-figure-container">
        <figure class="image">
          <img
            width="350"
            src="/img/banners/gif-workshop-350w.jpg"
            alt="Workshop at GIF"
          />
        </figure>
      </div>
    </div>
  </div>

  <!-- Rule -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <hr />
    </div>
  </div>

  <!-- Leadership -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <div id="leadership" use:inview="{entryOptions}" on:enter="{handleEntry}">
        <h2>Cal-Adapt Leadership</h2>

        <div class="bx--row">
          <div class="bx--col-lg-8 bx--col-md-4">
            <h3 class="h5">Funding and Oversight</h3>
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
          <div class="bx--col-lg-8 bx--col-md-4">
            <h3 class="h5">Programmatic Lead</h3>
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
      </div>
    </div>

    <div class="bx--offset-lg-1 bx--col-lg-4 bx--col-padding">
      <div class="sidebar-figure-container">
        <figure class="quote">
          <blockquote
            cite="https://resources.ca.gov/CNRALegacyFiles/docs/climate/Statewide_Adaptation_Strategy.pdf"
          >
            <p>
              The California Energy Commission will develop the Cal-Adapt Web
              site that will synthesize existing California climate change
              scenarios and climate impact research and to encourage its use in
              a way that is beneficial for local decision-makers.
            </p>
          </blockquote>
          <figcaption>
            <cite
              >— A key recommendation of the 2009 California Climate Adaptation
              Strategy</cite
            >
          </figcaption>
        </figure>
      </div>
    </div>
  </div>

  <!-- Rule -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <hr />
    </div>
  </div>

  <!-- Partners -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <div id="partners" use:inview="{entryOptions}" on:enter="{handleEntry}">
        <h2>Our Partners</h2>

        <h3 class="h5">State Agencies</h3>
        <div class="bx--row">
          <div class="bx--col-lg-8 bx--col-md-4">
            <div class="collaborator">
              <img
                src="img/logos/opr-logo.png"
                alt="logo for Governor's
                s Office of Planning & Research"
              />
              <a href="https://opr.ca.gov/" target="_blank"
                >Governor's Office of Planning &amp; Research</a
              >
            </div>
          </div>
          <div class="bx--col-lg-8 bx--col-md-4">
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
          <div class="bx--col-lg-8 bx--col-md-4">
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
        </div>

        <div class="bx--row">
          <div class="bx--col">
            <h3 class="h5">Data Contributors</h3>
          </div>
        </div>

        <div class="bx--row bx--row-padding">
          <div class="bx--col-lg-8 bx--col-md-4 contributor">
            <img
              src="/img/logos/scripps_logo.svg"
              alt="logo for Scripps Institution of Oceanography"
            />
          </div>
          <div class="bx--col-lg-8 bx--col-md-4 contributor">
            <img
              src="/img/logos/ca_dwr.png"
              alt="logo for California Department of Water Resources"
            />
          </div>
        </div>
        <div class="bx--row bx--row-padding">
          <div class="bx--col-lg-8 bx--col-md-4 contributor">
            <img
              src="/img/logos/UCBerkeley_wordmark_blue.svg"
              alt="logo for University of California Berkeley"
            />
          </div>
          <div class="bx--col-lg-8 bx--col-md-4 contributor">
            <img
              src="/img/logos/OCOF-logo.png"
              alt="logo for Our Coast Our Future"
            />
          </div>
        </div>
        <div class="bx--row bx--row-padding">
          <div class="bx--col-lg-8 bx--col-md-4 contributor">
            <img
              src="/img/logos/logo_UCLA_blue.svg"
              alt="logo for University of California Los Angeles"
            />
          </div>
          <div class="bx--col-lg-8 bx--col-md-4 contributor">
            <img
              src="/img/logos/USGS_ID_green.png"
              alt="logo for United States Geological Survey"
            />
          </div>
        </div>
        <div class="bx--row bx--row-padding">
          <div class="bx--col-lg-8 bx--col-md-4 contributor">
            <img
              src="/img/logos/UCM_Logo_Lake_Yosemite_Blue.png"
              alt="logo for University of California Merced"
            />
          </div>
          <div class="bx--col-lg-8 bx--col-md-4 contributor">
            <img
              src="/img/logos/boulder-fl-vertical-a-2.png"
              alt="logo for University of Colorado Boulder"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Rule -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <hr />
    </div>
  </div>

  <!-- Our Roadmap -->
  <div class="bx--row">
    <div class="bx--offset-lg-2 bx--col-lg-8">
      <div id="roadmap" use:inview="{entryOptions}" on:enter="{handleEntry}">
        <h2>Our Roadmap</h2>
        <p>
          The <a href="http://www.energy.ca.gov/" target="_blank"
            >California Energy Commission</a
          >
          (CEC) and UC Berkeley’s
          <a href="http://gif.berkeley.edu/" target="_blank"
            >Geospatial Innovation Facility</a
          >
          (GIF) initially released Cal-Adapt to the public in 2011 as a web-based
          resource to showcase the innovative climate change research being produced
          by the scientific community in California, as recommended in the
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
          >. This version includes updates and enhancements that increase its
          ease of use, information value, interactive visualizations, and data
          accessibility. Cal-Adapt's design and functionality have been
          developed in collaboration with a variety of beta testers and advisory
          committee members who provided valuable feedback throughout several
          iterations of updates.
        </p>
        <p>
          Cal-Adapt is evolving substantially, expanding beyond its current
          capabilities to support <a
            href="https://opr.ca.gov/climate/icarp/climate-assessment/"
            target="_blank">California’s Fifth Climate Change Assessment</a
          >
          and offer a more comprehensive and powerful solution for highly technical
          and data-intensive needs, with a focus on the energy sector. The expanded
          Cal-Adapt enterprise will continue to provide essential visualization,
          analytical and computational resources to support a broad range of stakeholders
          in using large climate datasets to inform their decision-making and planning
          processes. For additional details on state agency vision and roles in this
          expanded enterprise, please see this
          <a
            href="https://efiling.energy.ca.gov/GetDocument.aspx?tn=239954&DocumentContentId=73401"
            target="_blank">CEC Staff memo</a
          >.
        </p>
        <a
          href="/img/blog/caladapt_roadmap.png"
          target="_blank"
          aria-describedby="roadmap-graphic"
        >
          <figure class="image">
            <img
              class="shadow"
              src="/img/blog/caladapt_roadmap.png"
              alt="caladapt roadmap"
            />
            <figcaption id="roadmap-graphic">
              Evolution of the Cal-Adapt enterprise
            </figcaption>
          </figure>
        </a>
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

    <div class="bx--offset-lg-1 bx--col-lg-4 bx--col-padding">
      <div class="sidebar-figure-container">
        <a
          href="https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-015_ADA.pdf"
          target="_blank"
          aria-describedby="fourth-assement-desc"
        >
          <figure class="image report">
            <img
              src="/img/illustrations/caladapt-report-cover-750w.png"
              class="report shadow"
              alt="caladapt report cover"
            />
            <figcaption id="fourth-assement-desc">
              Read our technical report for the Fourth Assessment for more
              detailed information on the background and development of
              Cal-Adapt.
            </figcaption>
          </figure>
        </a>
      </div>
    </div>
  </div>
</div>

<div class="spacing--v-48"></div>

<!-- Our Team -->
<!-- <div
  class="bx--grid bx--grid--full-width"
  style="background-color: var(--gray-20);"
>
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--offset-lg-2 bx--col-lg-8">
        <div class="spacing--v-48"></div>
        <div id="team" use:inview="{entryOptions}" on:enter="{handleEntry}">
          <h2>Our Team</h2>
        </div>
      </div>
    </div>

    <div class="bx--row bx--no-gutter">
      <div class="bx--offset-lg-2 bx--col-lg-8">
        <div class="tabs-container">
          <Tabs role="tablist" aria-label="Organizations">
            <Tab label="Site Development" />
            <Tab label="Contract Management" />
            <Tab label="Advisory Oversight" />
            <div slot="content" aria-live="polite">
              <TabContent>
                <p class="team-text">
                  The <a href="http://gif.berkeley.edu/" target="_blank"
                    >Geospatial Innovation Facility</a
                  >
                  at
                  <a href="https://www.berkeley.edu/" target="_blank"
                    >UC Berkeley</a
                  >'s
                  <a href="https://nature.berkeley.edu/" target="_blank"
                    >College of Natural Resources</a
                  > provides leadership and training across a broad array of integrated
                  mapping technologies. Our goal is to help people better understand
                  the changing world through the analysis and visualization of spatial
                  data.
                </p>
                <div class="team-members">
                  {#each staff.current as { name, org }}
                    <div class="card">
                      <div class="card-body">
                        <p class="card-title">
                          {name}
                        </p>
                        <p class="card-org font-weight--light">
                          {org}
                        </p>
                      </div>
                    </div>
                  {/each}
                </div>
                <p class="team-text team-text-prev">
                  <strong>Previous contributors:</strong>
                </p>
                <ul class="team-list team-list-prev">
                  {#each staff.prior as { name }, i}
                    {@const l = staff.prior.length - 1}
                    <li class="team-list-prev-name">
                      {name}{i < l ? "," : "."}
                    </li>
                  {/each}
                </ul>
              </TabContent>
              <TabContent>
                <div class="team-members">
                  {#each managers as { name, org }}
                    <div class="card">
                      <div class="card-body">
                        <p class="card-title">
                          {name}
                        </p>
                        <p class="card-org font-weight--light">
                          {org}
                        </p>
                      </div>
                    </div>
                  {/each}
                </div>
              </TabContent>
              <TabContent>
                <p class="team-text">
                  Our Technical Advisory Committee (TAC) is composed of experts
                  from state and local government, utilities, consulting firms
                  and academia. We thank the following people for serving on our
                  TACs. If you are interested in serving on our TAC in the
                  future, please email nethomas@berkeley.edu.
                </p>
                <ul class="team-list team-list-advisory">
                  {#each advisors.current as { name, org }}
                    <li class="card">
                      <div class="card-body">
                        <p class="card-title">{name}</p>
                        <p class="card-org small text-gray-70">{org}</p>
                      </div>
                    </li>
                  {/each}
                </ul>
                <p class="team-text team-text-prev">
                  <strong>Previous contributors:</strong>
                </p>
                <ul class="team-list team-list-prev">
                  {#each advisors.prior as { name }, i}
                    {@const l = advisors.prior.length - 1}
                    <li class="team-list-prev-name">
                      {name}{i < l ? "," : "."}
                    </li>
                  {/each}
                </ul>
              </TabContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</div> -->

<div class="spacing--v-48"></div>

<div
  class="bx--grid bx--grid--full-width"
  style="background-color: var(--gray-20);"
>
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--offset-lg-2 bx--col-lg-8">
        <div class="spacing--v-48"></div>
        <p>
          <strong>Disclaimer</strong>: This website was prepared as a result of
          work sponsored by the California Energy Commission (CEC) and the
          California Strategic Growth Council (SGC). It does not necessarily
          represent the views of the CEC, SGC, the agencies' employees or the
          State of California. The CEC, SGC, the State of California, its
          employees, contractors and subcontractors make no warranty, express or
          implied, and assume no legal liability for the information on this
          website or made available via the website; nor does any party
          represent that the use of this information will not infringe upon
          privately owned rights. The website has not been approved or
          disapproved by the CEC or SGC, nor has the CEC or SGC passed upon the
          accuracy or adequacy of the information on the website.
        </p>
        <div class="spacing--v-48"></div>
      </div>
    </div>
  </div>
</div>

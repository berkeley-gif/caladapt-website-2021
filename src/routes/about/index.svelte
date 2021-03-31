<script>
  import data from './_data.json';
  const { advisors, staff } = data;
</script>

<style lang="scss">
  .list-prior {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    li {
      width: calc(33% - 2rem);
      margin: 0.35rem;
    }
  }
</style>

<svelte:head>
  <title>About | Cal-Adapt</title>
</svelte:head>

<section class="banner bg-gray-100">
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--col">
        <h1>
          About Cal-Adapt
        </h1>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="bx--grid">
    <div class="bx--row">
      <div class="bx--offset-lg-1 bx--col-lg-12">
        <p>
          Cal-Adapt has been designed to provide access to the wealth of data and information that has been, and continues to be, produced by State of California's scientific and research community. The data available on this site offer a view of how climate change might affect California at the local level. Here you can work with visualization tools, access data, and participate in community sharing to contribute your own knowledge. Cal-Adapt&#39;s development is a key recommendation of the 2009 California Climate Adaptation Strategy.
        </p>
        <p>
          The site has been developed by UC Berkeley&#39;s&nbsp;
          <a href="http://gif.berkeley.edu/" target="_blank">Geospatial Innovation Facility (GIF)</a> with funding and advisory oversight by the <a href="http://www.energy.ca.gov/" target="_blank">California Energy Commission</a> and <a href="http://sgc.ca.gov/" target="_blank">California Strategic Growth Council</a>.
        </p>
        <p>
          The data used within the Cal-Adapt visualization tools have been gathered from California&#39;s scientific community, and represent peer-reviewed, high quality science. Learn more about the variety of scientists and organizations that have contributed data and resources to Cal-Adapt.
        </p>
        <figure class="quote">
          <blockquote cite="https://resources.ca.gov/CNRALegacyFiles/docs/climate/Statewide_Adaptation_Strategy.pdf">
              <p>The California Energy Commission will develop the Cal-Adapt Web site that will synthesize existing California climate change scenarios and climate impact research and to encourage its use in a way that is beneficial for local decision-makers.</p>
          </blockquote>
          <figcaption>—A key recommendation of the <cite>2009 California Climate Adaptation Strategy</cite></figcaption>
        </figure>
      </div>
    </div>

    <!-- List of current Advisory Committee members -->
    <div class="bx--row">
      <div class="bx--offset-lg-1 bx--col-lg-12">
        <h2 id="oversight-committee">Advisory Oversight</h2>
      </div>
    </div>

    <div class="bx--row">
      <div class="bx--offset-lg-1 bx--col-lg-14">
        <ul class="bx--row">
          {#each advisors.current as opt}
            <li class="bx--col-lg-4 bx--col-md-4" style="padding:1rem;">
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
      </div>
    </div>

    <div class="bx--row">
      <div class="bx--offset-lg-1 bx--col-lg-12">
        <!-- List of prior Advisory Committee members -->
        <h3>Previous contributors</h3>
        <p>We would like to thank our prior advisory committee members for their services.</p>
        <ul class="list-prior">
          {#each advisors.prior as opt}
            <li>
              { opt.name }
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <!-- List of current Cal-Adapt team -->
    <div class="bx--row">
      <div class="bx--offset-lg-1 bx--col-lg-12">
        <h2 id="caladapt-team">Site Development</h2>
        <p>
          This site has been developed by the <a href="http://gif.berkeley.edu/" target="_blank">Geospatial Innovation Facility (GIF)</a> at <a href="http://www.berkeley.edu/" target="_blank"> University of California, Berkeley</a>.
        </p>
      </div>
    </div>

    <div class="bx--row">
      <div class="bx--offset-lg-1 bx--col-lg-14">
        <ul class="bx--row">
          {#each staff.current as opt}
            <li class="bx--col-lg-6" style="padding:1rem;">
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
      </div>
    </div>

    <div class="bx--row">
      <div class="bx--offset-lg-1 bx--col-lg-12">
        <!-- List of prior Advisory Committee members -->
        <h3>Previous contributors</h3>
        <ul class="list-prior">
          {#each staff.prior as opt}
            <li>
              { opt.name }
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <div class="bx--row">
      <div class="bx--offset-lg-1 bx--col-lg-12">
        <h2>Acknowledgements</h2>
        <p>
          Amy Luers, then of Google.org, articulated the original need and vision for the creation of Cal-Adapt, and was instrumental in securing funding for its development. Dylan Beaudette, Vishal Mehta, and David Purkey from the Stockholm Environmental Institute created an initial prototype that formed a basis for the original (June 2011) release of Cal-Adapt. We also thank Shannon Koy for her valuable contribution to the graphic design and layout of the site.
        </p>
        <p>
          Cal-Adapt&#39;s current design and functionality have been developed with the insight from a variety of beta testers and advisory committee members who provided valuable feedback throughout several iterations of updates. These individuals represent scientists and climate experts, planners and technicians, and leaders in development of local climate policy, as well as interested participants from the general public.
        </p>
      </div>
    </div>

  </div> <!-- end grid --> 
</section>
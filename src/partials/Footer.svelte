<script>
  import LogoTwitter32 from "carbon-icons-svelte/lib/LogoTwitter32";
  import Email24 from "carbon-icons-svelte/lib/Email24";
</script>

<style lang="scss">
  /* TODO: mv SCSS partial styles in here */
  .about-text {
    display: flex;
    align-content: center;
    align-items: center;

    p {
      margin-bottom: 0;
    }
  }
</style>

<footer>
  <div class="bx--grid bx--grid--full-width footer-logos">
    <div class="bx--row bx--row-padding">
      <div class="bx--offset-lg-2 bx--col-lg-6 about-text">
        <p>
          Cal-Adapt has been developed by the Geospatial Innovation Facility at
          University of California, Berkeley with funding and advisory oversight
          by California Energy Commission and California Strategic Growth
          Council.
        </p>
      </div>
      <div class="bx--offset-lg-1 bx--col-lg-5 logos">
        <a
          href="http://gif.berkeley.edu/"
          target="_blank"
          aria-label="Geospatial Innovation Facility"
        >
          <img
            src="img/logos/gif_249x100.png"
            alt="logo for Geospatial Innovation Facility"
            style="width:180px;"
          />
        </a>
        <a
          href="http://www.energy.ca.gov/"
          target="_blank"
          aria-label="California Energy Commission"
        >
          <img
            src="img/logos/cec_900x790.png"
            alt="logo for California Energy Commission"
            style="width:100px;"
          />
        </a>
        <a
          href="http://sgc.ca.gov/"
          target="_blank"
          aria-label="California Strategic Growth Council"
          style="background: transparent;"
        >
          <img
            src="img/logos/SGC-Brand-Logos-White-13.png"
            alt="logo for Strategic Growth Council"
            style="width:200px;"
          />
        </a>
      </div>
    </div>
  </div>
  <div class="footer-links">
    <a href="https://twitter.com/cal_adapt" title="Twitter">
      <LogoTwitter32 />
    </a>
    <a href="mailto:support@cal-adapt.org" title="Email">
      <Email24 />
    </a>
  </div>
  <div class="footer-copyright">
    <small>&copy; 2021 California Energy Commission </small>
    <small> State of California, Gavin Newsom, Governor. </small>
  </div>
</footer>

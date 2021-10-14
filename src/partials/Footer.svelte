<script>
  import LogoTwitter32 from "carbon-icons-svelte/lib/LogoTwitter32";
  import Email24 from "carbon-icons-svelte/lib/Email24";
</script>

<style lang="scss">
  .footer-logos {
    background-image: linear-gradient(
      to top,
      var(--gray-60),
      #636b71,
      #5d646b,
      #575e64,
      #51585e
    );

    color: var(--white);
  }

  .about-text {
    display: flex;
    align-content: center;
    align-items: center;

    @media (max-width: 1000px) {
      text-align: center;
    }

    p {
      margin-bottom: 0;
    }
  }

  .logos {
    display: flex;
    align-items: baseline;
    justify-content: center;
    flex-wrap: wrap;

    a {
      background: var(--white);
      margin: 0.5rem;
    }

    @media (max-width: 1000px) {
      justify-content: space-evenly;
    }
  }

  .footer-links {
    background: var(--gray-80);
    display: flex;
    align-items: center;
    justify-content: center;

    a {
      color: var(--accent);
      margin: 1rem;
    }
  }

  .footer-copyright {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
</style>

<footer>
  <div class="bx--grid footer-logos">
    <div class="bx--row bx--row-padding">
      <div
        class="bx--offset-lg-2 bx--col-lg-6 bx--offset-md-1 bx--col-md-6 about-text"
      >
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
    <a href="https://twitter.com/cal_adapt" aria-label="Cal-Adapt on Twitter">
      <LogoTwitter32 />
    </a>
    <a href="mailto:support@cal-adapt.org" aria-label="Email Cal-Adapt support">
      <Email24 />
    </a>
  </div>
  <div class="footer-copyright">
    <small>&copy; 2021 California Energy Commission</small>
    <small>State of California, Gavin Newsom, Governor.</small>
  </div>
</footer>

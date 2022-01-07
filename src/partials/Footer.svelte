<script>
  import LogoTwitter32 from "carbon-icons-svelte/lib/LogoTwitter32";
  import Email24 from "carbon-icons-svelte/lib/Email24";

  export let useWideLayout = false;
</script>

<style lang="scss">
  footer {
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

    @media (max-width: 66rem) {
      text-align: center;
      justify-content: center;
    }

    p {
      margin-bottom: 0;
    }
  }

  .logos {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    a {
      margin: 0.5rem;
    }

    @media (max-width: 66rem) {
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
    background: var(--white);
    color: var(--gray-80);
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    line-height: 1.5;
  }
</style>

<footer>
  <div class="bx--grid footer-logos">
    <div class="bx--row bx--row-padding">
      <div
        class:bx--offset-lg-2="{!useWideLayout}"
        class:bx--offset-md-1="{!useWideLayout}"
        class="bx--col-lg-6 about-text"
      >
        <p>
          Cal-Adapt has been developed by the Geospatial Innovation Facility at
          the University of California, Berkeley with funding and advisory
          oversight by the California Energy Commission and the California
          Strategic Growth Council.
        </p>
      </div>
      <div
        class:bx--offset-lg-1="{!useWideLayout}"
        class:bx--offset-lg-3="{useWideLayout}"
        class="logos bx--col-lg-7"
      >
        <a href="http://gif.berkeley.edu/" target="_blank">
          <img
            src="img/logos/gif_249x100_gray.png"
            alt="Geospatial Innovation Facility"
            style="width:180px;"
          />
        </a>
        <a href="http://www.energy.ca.gov/" target="_blank">
          <img
            src="img/logos/CEC_BW_Logo_gray.png"
            alt="California Energy Commission"
            style="width:125px;margin-left:1rem;"
          />
        </a>
        <a
          href="http://sgc.ca.gov/"
          target="_blank"
          style="background: transparent;"
        >
          <img
            src="img/logos/SGC-Brand-Logos-White-13.png"
            alt="Strategic Growth Council"
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

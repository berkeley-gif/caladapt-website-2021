<script>
  import { stores } from "@sapper/app";
  import LogoTwitter32 from "carbon-icons-svelte/lib/LogoTwitter32";
  import Email24 from "carbon-icons-svelte/lib/Email24";

  // TODO: abstract this so that it can be used in the header as well.
  const { page } = stores();
  const TOP_LEVEL_WIDE_LAYOUTS = ["tools", "blog"];
  const SUB_LEVEL_WIDE_LAYOUTS = ["help", "tools"];
  const SUB_LEVEL_NARROW_LAYOUTS = ["blog"];
  const homepage = /^\/$/;
  const mainPage = /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/i;
  const subPage = /^\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*/i;

  let useWideLayout = false;

  $: path = `${$page.path}`;

  $: if (homepage.exec(path)) {
    useWideLayout = true;
  } else if (
    mainPage.exec(path) &&
    TOP_LEVEL_WIDE_LAYOUTS.includes(path.replace(/\//g, ""))
  ) {
    useWideLayout = true;
  } else if (subPage.exec(path)) {
    if (SUB_LEVEL_WIDE_LAYOUTS.includes(path.split("/")[1])) {
      useWideLayout = true;
    }
    if (SUB_LEVEL_NARROW_LAYOUTS.includes(path.split("/")[1])) {
      useWideLayout = false;
    }
  } else {
    useWideLayout = false;
  }
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
    align-items: center;
    justify-content: center;
    // flex-wrap: wrap;

    a {
      // background: var(--white);
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
    line-height: 1.5;
  }
</style>

<footer>
  <div class="bx--grid bx--grid--full-width footer-logos">
    <div class="bx--row bx--row-padding">
      <div
        class:bx--offset-lg-2="{!useWideLayout}"
        class="bx--col-lg-6 bx--offset-md-1 bx--col-md-6 about-text"
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
            src="img/logos/gif_249x100_gray.png"
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
            src="img/logos/CEC_BW_Logo_gray.png"
            alt="logo for California Energy Commission"
            style="width:125px;"
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

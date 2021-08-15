<script>
  import { Button } from "carbon-components-svelte";
  import { Download16 } from "carbon-icons-svelte";
</script>

<style>
  .source {
    margin-top: 0.5rem;
  }

  .source .source-logo {
    display: flex;
    padding-top: 1.5rem;
    align-items: start;
  }

  .source .source-logo img {
    width: 100px;
  }

  .source .source-text h5 {
    margin-bottom: 0.5rem;
  }

  .source .source-text p {
    margin-bottom: 0.5rem;
  }
</style>

<div class="bx--row">
  <div class="bx--col-lg-12">
    <h2>Data Sources</h2>
    <p>
      The following list of datasets were used to create this tool. Click on the
      Download Dataset buttons to download data in NetCDF, GeoTIFF or CSV
      formats. You can also download data visualized in Explore the Data section
      above in graphic and tabular formats by clicking on the Download Chart
      button.
    </p>
  </div>
</div>

<!-- Source -->
<div class="bx--row source">
  <div class="bx--col-lg-2 source-logo">
    <img src="/img/logos/scripps_100x100.png" alt="scripps logo" />
  </div>
  <div class="bx--col-lg-10 source-text">
    <h5>Hourly Observed Historical Data</h5>
    <p>
      <a href="https://www.metoffice.gov.uk/hadobs/hadisd/" target="_blank"
        >U.K. Met Office Hadley Centre</a
      >
    </p>
    <p>
      The Hourly Observed Historical Data product consists of 39 stations across
      the state (Figure 1), each with an observation period of greater than 30
      years (1973 to present) from the HadISD global record. Stations identified
      for use in this data product were chosen based on being considered high
      quality for temperature.
    </p>
    <Button size="field" kind="tertiary" icon="{Download16}" href="#!"
      >Download Dataset</Button
    >
  </div>
</div>

<!-- Source -->
<div class="bx--row source">
  <div class="bx--col-lg-2 source-logo">
    <img src="/img/logos/scripps_100x100.png" alt="scripps logo" />
  </div>
  <div class="bx--col-lg-10 source-text">
    <h5>LOCA Downscaled Climate Projections</h5>
    <p>
      <a href="https://scripps.ucsd.edu/" target="_blank"
        >Scripps Institution Of Oceanography - University of California, San
        Diego</a
      >
    </p>
    <p>
      Daily climate projections for California at a resolution of 1/16° (about 6
      km, or 3.7 miles) generated to support climate change impact studies for
      California’s Fourth Climate Change Assessment. The data, derived from 32
      coarse-resolution (~100 km) global climate models from the CMIP5 archive,
      were bias corrected and downscaled using the Localized Constructed
      Analogues (<a href="http://loca.ucsd.edu/what-is-loca/" target="_blank"
        >LOCA</a
      >) statistical method. The data cover 1950-2005 for the historical period
      and 2006-2100 (some models stop in 2099) for two future climate
      projections. Details are described in
      <a
        href="https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf"
        target="_blank">Pierce et al., 2018</a
      >.
    </p>
    <Button size="field" kind="tertiary" icon="{Download16}" href="#!"
      >Download Dataset</Button
    >
  </div>
</div>

<!-- Source -->
<div class="bx--row source">
  <div class="bx--col-lg-2 source-logo">
    <img
      style="width:80px;"
      src="/img/logos/gif_80x80.png"
      alt="geospatial innovation facility logo"
    />
  </div>
  <div class="bx--col-lg-10 source-text">
    <h5>Additional Calculations</h5>
    <p>
      <a href="http://gif.berkeley.edu/" target="_blank"
        >Geospatial Innovation Facility - University of California, Berkeley</a
      >
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
  </div>
</div>

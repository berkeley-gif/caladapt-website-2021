<script>
  import { Modal, CodeSnippet, Button } from "carbon-components-svelte";
  import Information16 from "carbon-icons-svelte/lib/Information16";
  import DataBase16 from "carbon-icons-svelte/lib/DataBase16";
  import Share16 from "carbon-icons-svelte/lib/Share16";
  import copy from "clipboard-copy";

  // Store
  import { bookmark } from "./_store";

  // Modals
  let showShare = false;
  let showAbout = false;
  let showData = false;
</script>

<div class="header-title">
  <h1>Snowpack</h1>
  <p class="lead">
    Explore projected changes in monthly Snow Water Equivalent (SWE) for
    California. SWE is a commonly used measurement used to gage the amount of
    liquid water contained within the snowpack.
  </p>
</div>
<div class="header-actions">
  <Button
    size="small"
    icon="{Information16}"
    kind="ghost"
    on:click="{() => (showAbout = true)}"
  >
    ABOUT
  </Button>
  <Button
    size="small"
    icon="{DataBase16}"
    kind="ghost"
    on:click="{() => (showData = true)}"
  >
    DATA
  </Button>
  <Button
    size="small"
    icon="{Share16}"
    kind="ghost"
    on:click="{() => (showShare = true)}"
  >
    SHARE
  </Button>
</div>

<Modal
  id="share"
  passiveModal
  bind:open="{showShare}"
  modalHeading="Share Link"
  on:open
  on:close
>
  <CodeSnippet
    type="multi"
    wrapText
    code="{$bookmark}"
    on:click="{() => copy($bookmark)}"
  />
</Modal>

<Modal
  passiveModal
  bind:open="{showAbout}"
  modalHeading="About the Tool"
  on:open
  on:close
>
  <p>
    If heat-trapping emissions continue unabated, more precipitation will fall
    as rain instead of snow, and the snow that does fall will melt earlier,
    reducing the Sierra Nevada spring snowpack by as much as 70 to 90 percent.
    How much snowpack will be lost depends in part on future precipitation
    patterns, the projections for which remain uncertain. However, even under
    wetter climate projections, the loss of snowpack would pose challenges to
    water managers, hamper hydropower generation, and nearly eliminate skiing
    and other snow-related recreational activities.
  </p>
</Modal>

<Modal
  passiveModal
  bind:open="{showData}"
  modalHeading="Data Sources"
  on:open
  on:close
>
  <div class="bx--grid">
    <!-- Source -->
    <div class="bx--row" style="background-color:#dadee1;margin:1rem 0;">
      <div
        class="bx--col-lg-3"
        style="display:flex;align-items:center;justify-content:center;"
      >
        <img
          style="width:80px;"
          src="/img/logos/scripps_100x100.png"
          alt="scripps logo"
        />
      </div>
      <div class="bx--col-lg-13">
        <h5>LOCA Downscaled Climate Projections</h5>
        <p>
          <a href="https://scripps.ucsd.edu/" target="_blank">
            Scripps Institution Of Oceanography - University of California, San
            Diego
          </a>
        </p>
      </div>
    </div>
    <div class="bx--row">
      <div class="bx--col">
        <p>
          Daily climate projections for California at a resolution of 1/16°
          (about 6 km, or 3.7 miles) generated to support climate change impact
          studies for California’s Fourth Climate Change Assessment. The data,
          derived from 32 coarse-resolution (~100 km) global climate models from
          the CMIP5 archive, were bias corrected and downscaled using the
          Localized Constructed Analogues (<a
            href="http://loca.ucsd.edu/what-is-loca/"
            target="_blank">LOCA</a
          >) statistical method. The data cover 1950-2005 for the historical
          period and 2006-2100 (some models stop in 2099) for two future climate
          projections. Details are described in
          <a
            href="https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf"
            target="_blank">Pierce et al., 2018</a
          >.
        </p>
      </div>
    </div>
    <!-- Source -->
    <div class="bx--row" style="background-color:#dadee1;margin:1rem 0;">
      <div
        class="bx--col-lg-3"
        style="display:flex;align-items:center;justify-content:center;"
      >
        <img
          style="width:80px;"
          src="/img/logos/u_colorado.png"
          alt="university of colorado boulder logo"
        />
      </div>
      <div class="bx--col-lg-13">
        <h5>Gridded Observed Meteorological Data</h5>
        <p>
          <a href="http://ciresgroups.colorado.edu/livneh/" target="_blank">
            University of Colorado, Boulder
          </a>
        </p>
      </div>
    </div>
    <div class="bx--row">
      <div class="bx--col">
        <p>
          Historical observed daily temperature data from approximately 20,000
          NOAA Cooperative Observer (COOP) stations form the basis of this
          gridded dataset from 1950–2013 at a spatial resolution of 1/16º
          (approximately 6 km). Observation-based meteorological data sets offer
          insights into changes to the hydro-climatic system by diagnosing
          spatio-temporal characteristics and providing a historical baseline
          for future projections. Details are described in <a
            href="http://www.nature.com/articles/sdata201542"
            target="_blank">Livneh et al., 2015</a
          >.
        </p>
      </div>
    </div>
    <!-- Source -->
    <div class="bx--row" style="background-color:#dadee1;margin:1rem 0;">
      <div
        class="bx--col-lg-3"
        style="display:flex;align-items:center;justify-content:center;"
      >
        <img
          style="width:80px;"
          src="/img/logos/gif_80x80.png"
          alt="geospatial innovation facility logo"
        />
      </div>
      <div class="bx--col-lg-13">
        <h5>Additional Calculations</h5>
        <p>
          <a href="http://gif.berkeley.edu/" target="_blank">
            Geospatial Innovation Facility - University of California, Berkeley
          </a>
        </p>
      </div>
    </div>
    <div class="bx--row">
      <div class="bx--col">
        <p>
          In order to create data layers used in this tool, we calculated
          monthly averages of daily values of Snow Water Equivalent for each
          year (1950–2100). This process was done for each of the 10 LOCA
          downscaled climate models selected for California, for historical and
          future scenarios - RCP 4.5 and RCP 8.5.
        </p>
      </div>
    </div>
  </div>
</Modal>

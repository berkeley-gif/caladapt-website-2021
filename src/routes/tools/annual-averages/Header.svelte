<script>
  import {
    Modal,
    CodeSnippet,
    Button,
  } from 'carbon-components-svelte';
  import Information16 from 'carbon-icons-svelte/lib/Information16';
  import DataBase16 from "carbon-icons-svelte/lib/DataBase16";
  import Share16 from "carbon-icons-svelte/lib/Share16";
  import copy from 'clipboard-copy';

  // Store
  import { bookmark } from './_store';

  // Modals
  let showShare = false;
  let showAbout = false;
  let showData = false;
</script>


<div class="header-title">
  <h1>Annual Averages</h1>
  <p class="lead">
    Explore projected changes in annual average Maximum Temperature, Minimum Temperature and Precipitation through end of this century for California.
  </p>
</div>
<div class="header-actions">
  <Button size="small" icon={Information16} kind="ghost" on:click={() => showAbout = true}>
    ABOUT
  </Button>
  <Button size="small" icon={DataBase16} kind="ghost" on:click={() => showData = true}>
    DATA
  </Button>
  <Button size="small" icon={Share16} kind="ghost" on:click={() => showShare = true}>
    SHARE
  </Button>
</div>


<Modal id="share" passiveModal bind:open={showShare} modalHeading="Share Link" on:open on:close>
  <CodeSnippet
   type="multi"
   wrapText
   code={$bookmark}
   on:click={() => copy($bookmark)} />
</Modal>

<Modal passiveModal bind:open={showAbout} modalHeading="About the Tool" on:open on:close>
  <p>
    Overall temperatures are projected to rise substantially throughout this century. These projections differ depending on the time of year and the type of measurement (highs vs. lows), all of which have different potential effects to the state's ecosystem health, agricultural production, water use and availability, and energy demand. On average, the projections show little change in total annual precipitation in California. Furthermore, among several models, precipitation projections do not show a consistent trend during the next century. The Mediterranean seasonal precipitation pattern is expected to continue, with most precipitation falling during winter from North Pacific storms. However, even modest changes would have a significant impact because California ecosystems are conditioned to historical precipitation levels and water resources are nearly fully utilized.
  </p>
  <p>
    With this tool you can explore projections of annually averaged maximum temperature, minimum temperature and precipitation. These climate projections have been downscaled from global climate models from the <a href="https://pcmdi.llnl.gov/mips/cmip5/" target="_blank">CMIP5</a> archive, using the <a href="http://loca.ucsd.edu/what-is-loca/" target="_blank">Localized Constructed Analogs</a> (LOCA) statistical technique developed by Scripps Institution Of Oceanography. LOCA is a statistical downscaling technique that uses past history to add improved fine-scale detail to global climate models.
    On average, the projections show little change in total annual precipitation in California. Furthermore, among several models, precipitation projections do not show a consistent trend during the next century. However, even modest changes would have a significant impact because California ecosystems are conditioned to historical precipitation levels and water resources are nearly fully utilized.
  </p>
</Modal>

<Modal passiveModal bind:open={showData} modalHeading="Data Sources" on:open on:close>
  <div class="bx--grid">
    <!-- Source -->
    <div class="bx--row" style="background-color:#dadee1;margin:1rem 0;">
      <div class="bx--col-lg-3" style="display:flex;align-items:center;justify-content:center;">
        <img style="width:80px;" src="/img/logos/scripps_100x100.png" alt="scripps logo">
      </div>
      <div class="bx--col-lg-13">
        <h5>LOCA Downscaled Climate Projections</h5>
        <p>
          <a href="https://scripps.ucsd.edu/" target="_blank">
            Scripps Institution Of Oceanography - University of California, San Diego
          </a>
        </p>
      </div>
    </div>
    <div class="bx--row">
      <div class="bx--col">
        <p>
          Daily climate projections for California at a resolution of 1/16° (about 6 km, or 3.7 miles) generated to support climate change impact studies for California’s Fourth Climate Change Assessment. The data, derived from 32 coarse-resolution (~100 km) global climate models from the CMIP5 archive, were bias corrected and downscaled using the Localized Constructed Analogues (<a href="http://loca.ucsd.edu/what-is-loca/" target="_blank">LOCA</a>) statistical method. The data cover 1950-2005 for the historical period and 2006-2100 (some models stop in 2099) for two future climate projections. Details are described in <a href="https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf" target="_blank">Pierce et al., 2018</a>.
        </p>
      </div>
    </div>
    <!-- Source -->
    <div class="bx--row" style="background-color:#dadee1;margin:1rem 0;">
      <div class="bx--col-lg-3" style="display:flex;align-items:center;justify-content:center;">
        <img style="width:80px;" src="/img/logos/u_colorado.png" alt="university of colorado boulder logo">
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
          Historical observed daily temperature data from approximately 20,000 NOAA Cooperative Observer (COOP) stations form the basis of this gridded dataset from 1950–2013 at a spatial resolution of 1/16º (approximately 6 km). Observation-based meteorological data sets offer insights into changes to the hydro-climatic system by diagnosing spatio-temporal characteristics and providing a historical baseline for future projections. Details are described in <a href="http://www.nature.com/articles/sdata201542" target="_blank">Livneh et al., 2015</a>.
        </p>
      </div>
    </div>
    <!-- Source -->
    <div class="bx--row" style="background-color:#dadee1;margin:1rem 0;">
      <div class="bx--col-lg-3" style="display:flex;align-items:center;justify-content:center;">
        <img style="width:80px;" src="/img/logos/gif_80x80.png" alt="geospatial innovation facility logo">
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
          In order to create data layers used in this visualization tool, we calculated annual averages of daily values of maximum temperature (daily high) minimum temperature (daily low) and precipitation for each year (1950–2100). This process was done for each of the 32 LOCA downscaled climate models for the historical scenario and the future scenarios - RCP 4.5 and RCP 8.5.
        </p>
        <p>
          An envelope of modeled variability for each variable-scenario combination was generated by selecting the highest and lowest values from annual averages of all 32 LOCA downscaled climate models.
        </p>
        <p>
          California agencies have selected 10 of the 32 LOCA downscaled climate models for performance in the California/Nevada region. For more details on this process see <a href="https://www.energy.ca.gov/sites/default/files/2019-11/Projections_CCCA4-CEC-2018-006_ADA.pdf" target="_blank">Pierce et al., 2018</a>. Data for these 10 models and the gridded historical observed data are displayed in the tool and are available through the Cal-Adapt API.
        </p>
      </div>
    </div>
  </div>
</Modal>
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
  <h1>Extreme Heat</h1>
  <p class="lead">
    For most areas around the state, the climate models project a significant rise in the number of days exceeding what is now considered extremely hot for the given area. Explore how the frequency and timing of extreme heat days and warm nights is expected to change under different emission scenarios for your location.
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
    With this tool you can explore how the frequency and timing of extreme heat days and warm nights is expected to change under different emission scenarios. This data is derived from daily climate projections which have been downscaled from global climate models from the <a href="http://cmip-pcmdi.llnl.gov/cmip5/data_portal.html" target="_blank">CMIP5</a> archive, using the <a href="http://loca.ucsd.edu/what-is-loca/" target="_blank">Localized Constructed Analogs</a> (LOCA) statistical technique developed by Scripps Institution Of Oceanography. LOCA is a statistical downscaling technique that uses past history to add improved fine-scale detail to global climate models.
  </p>
  <p>
    As the climate changes in California, one of the more serious threats to the public health of Californians will stem primarily from the higher frequency of extreme conditions, principally more frequent, more intense, and longer heat waves. An increase in heat waves may increase the risk of heat stroke and dehydration. Find out how you can become better prepared and more resilient to increasing temperature and extreme heat events at <a href="https://healthyplacesindex.org/wp-content/uploads/2018/02/2013_cph_preparing_california_for_extreme_eat.pdf" target="_blank">Preparing California for Extreme Heat</a>, a report put together by California Environmental Protection Agency (<a href="http://www.calepa.ca.gov/" target="_blank">CalEPA</a>) and the California Department of Public Health (<a href="http://www.cdph.ca.gov/" target="_blank">CDPH</a>).
  </p>
  <h4>What is an extreme heat day?</h4>
  <p>
    For purposes of this tool, an extreme heat day or warm night is defined as a day in a year when the daily maximum/minimum temperature exceeds the 98th historical percentile of daily maximum/minimum temperatures based on observed historical data from 1961–1990 between April and October. Users have the option of setting a different value for threshold temperature or reset back to the 98th percentile value.
  </p>

  <h4>What is warm night?</h4>
  <p>
    For purposes of this tool, a warm night is defined as a day in April through October when the daily minimum temperature exceeds the 98th historical percentile of daily minimum temperatures based on observed data from 1961–1990. Users have the option of setting a different value for threshold temperature or reset back to the 98th percentile value.
  </p>

  <h4>What is a heat wave?</h4>
  <p>
    Heat waves are characterized as periods of sustained, extreme heat, although there is no universal definition of a heat wave. For purposes of this tool, a heat wave is defined as a period of 4 consecutive extreme heat days or warm nights when the daily maximum/minimum temperature is above the extreme heat threshold. Each 4 day/night period is counted, so that if extreme temperatures persist for 10 consecutive days/nights, it counts as 2 Heat Waves. Users have the option of choosing a different value for number of consecutive days/nights.
  </p>
</Modal>

<Modal passiveModal bind:open={showData} modalHeading="Data Sources" on:open on:close>
  <div class="bx--grid">
    <!-- Source -->
    <div class="bx--row">
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
    <div class="bx--row">
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
  </div>
</Modal>
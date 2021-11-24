<script context="module">
  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  import resourcesList from "../../../../content/resources/data";
  import {
    DEFAULT_STATION_ID,
    DEFAULT_CLIMATE_VARIABLE,
    TOOL_SLUG,
  } from "./_constants";
  export async function preload({ query }) {
    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const tool = toolsList.find((d) => d.slug === TOOL_SLUG);
    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));
    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    // Set intitial config for tool
    let initialConfig;
    if (Object.keys(query).length > 0) {
      // TODO: validate bookmark
      const { climvar, station, imperial } = query;
      initialConfig = {
        stationId: station,
        climvarId: climvar,
        imperial: imperial === "true" ? true : false,
      };
    } else {
      initialConfig = {
        stationId: DEFAULT_STATION_ID,
        climvarId: DEFAULT_CLIMATE_VARIABLE,
        imperial: true,
      };
    }

    return { initialConfig, tool, relatedTools, externalResources };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { timeParse } from "d3-time-format";
  import { Loading } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";

  // Helpers
  import { getStationById } from "~/helpers/geocode";

  // Components
  import { Header, About, ToolNavigation } from "~/components/tools/Partials";
  import ExploreData from "./_ExploreData.svelte";
  import { NotificationDisplay, notifier } from "~/components/notifications";

  // Store
  import { isFetchingStore } from "../_common/stores";
  import {
    climvarStore,
    unitsStore,
    locationStore,
    doyStore,
    hadisdStore,
    extremesStore,
  } from "./_store";
  import {
    getObservedValues,
    getObservedReturnLevels,
    getQueryParams,
  } from "./_data";

  export let initialConfig;
  export let tool;

  // Derived stores
  const { climvar } = climvarStore;

  // Local props
  let appReady = false;

  // TODO: This prop can be removed when Resources and Help
  // content are available for the tool
  const pageNavItems = [
    { id: "explore-data", label: "Explore Data" },
    { id: "about", label: "About the Tool" },
  ];

  // Monitor sections as they enter & leave viewport
  let currentView;
  const handleEntry = (e) => {
    const { inView, entry } = e.detail;
    if (inView) {
      currentView = entry.target.id;
    }
  };

  const description = [
    `Explore extreme temperatures and wind speed for past weather and present day. This tool
      provides data from 38 weather stations across California, utilizing a
      quality-controlled dataset for hourly weather observations curated for use
      by the energy sector (<a
        href="https://www.energy.ca.gov/sites/default/files/2021-05/CEC-500-2020-039.pdf"
        target="_blank">Doherty 2020</a
      >). Present day weather conditions are from NOAA.`,
    `<em style="font-size:1rem;">Note: This tool is still under development. We are soliciting feedback
      from our users. Please email us at support@cal-adapt.org with your
      comments and questions.</em>`,
  ];

  // Reactive props
  $: $climvar, $doyStore, $locationStore, $extremesStore, update();

  async function update() {
    if (!appReady) return;
    try {
      hadisdStore.set(null);
      const config = {
        climvarId: $climvarStore,
      };
      const { params } = getQueryParams({
        location: $locationStore,
        doy: $doyStore,
        extype: $extremesStore,
        imperial: true,
      });

      isFetchingStore.set(true);

      const values = await getObservedValues(config, {
        g: params.g,
        imperial: params.imperial,
      });
      const returnLevels = await getObservedReturnLevels(config, params);
      hadisdStore.set({
        values,
        returnLevels: returnLevels[0],
      });
    } catch (err) {
      // TODO: notify user of error
      console.log("updateData", err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp(config) {
    const { stationId, climvarId, imperial, doy } = config;
    climvarStore.set(climvarId);
    unitsStore.set({ imperial });
    // Set intial station
    const station = await getStationById(stationId, "hadisdstations");
    locationStore.updateLocation(station);
    // Set today's date as default
    if (!doy) {
      doyStore.set(new Date());
    } else {
      doyStore.set(timeParse("%j")(+doy));
    }
    return;
  }

  onMount(() => {
    initApp(initialConfig)
      .then(() => {
        appReady = true;
        console.log("app ready");
        update();
      })
      .catch((error) => {
        console.log("init error", error);
        notifier.error(
          "Unable to Load Tool",
          "Sorry! Something's probably wrong at our end. Try refereshing your browser. If you still see an error please contact us at support@cal-adapt.org.",
          2000
        );
      });
    window.scrollTo(0, 0);
  });
</script>

<svelte:head>
  <title>{tool.title}</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<Header
  iconPaths="{tool.icons}"
  title="{`${tool.title} (beta)`}"
  description="{description}"
/>

<ToolNavigation pageNavItems="{pageNavItems}" href="{`/tools/${tool.slug}`}" />

<div id="explore-data" use:inview="{{}}" on:enter="{handleEntry}">
  {#if appReady}
    <ExploreData />
  {:else}
    <Loading />
  {/if}
</div>

<div class="bx--grid">
  <!-- About -->
  <div id="about" use:inview="{{}}" on:enter="{handleEntry}">
    <About datasets="{[]}">
      <div slot="description">
        <p>
          Extreme Value Theory (EVT) is a statistical methodology used for
          describing rare events. There are several ways to apply EVT to weather
          variables including fitting a Generalized Extreme Value distribution
          (GEV) over Block Maxima (annual maximum value) and the
          Peaks-Over-Threshold approach where probability distribution of
          exceedances over a pre-defined threshold are modeled using a
          generalized Pareto distribution. This tool explores extreme events in
          California using a Block Maxima approach.
        </p>
        <p>
          Annual Maximum values of the climate variable from a 21 day window
          around the day of interest are extracted from a 30 year daily
          timeseries for the Baseline Period (1991–2020). A GEV distribution for
          Temperature and an inverted Weibull distribution for Wind Speed is
          applied to this time series. Shape and scale parameters for the
          distribution are estimated using the Maximum Likelihood method.
          Exceedance Probabilities for different threshold values (return
          levels) are estimated from the fitted model with 95% confidence
          intervals.
        </p>
        <p>
          <strong>User Advisory</strong>: The Extreme Weather Tool is designed
          to broadly inform estimated probabilities of extreme weather events
          across a wide range of environments and climate zones in California.
          On a local scale, different statistical assumptions (i.e. fitting
          techniques for distribution parameters, choice of extreme value
          distribution) may be more appropriate. We encourage users to ensure
          the empirical fit of the applied distribution is acceptable to their
          end use before using estimates produced from this tool for planning
          purposes.
        </p>
      </div>
      <div slot="extra-sources">
        <div class="bx--row source">
          <div class="bx--col-lg-2 bx--col-md-1 bx--col-sm-1">
            <img
              src="/img/logos/scripps_100x100.png"
              class="source-logo"
              alt="data provider logo"
            />
          </div>
          <div class="bx--col-lg-12 bx--col-md-7 bx--col-sm-3">
            <div class="h4">Hourly Observed Historical Data</div>
            <div class="h5">Met Office Hadley Centre</div>
            <p class="source-text">
              The Hourly Observed Historical Data product consists of 39
              stations across the state, each with an observation period of
              greater than 47 years (1973 to present) from the HadISD global
              record. Stations identified for use in this data product were
              chosen based on being considered high quality for temperature. Due
              to observing techniques, instrumentation used, and similarities in
              QA/QC protocols, it’s likely that data for dew point and mean sea
              level pressure will be of similar quality, however this has not
              been assessed fully.
            </p>
            <p>
              <em
                >Note: Only 38 of the 39 stations from the Hourly Observed
                Historical Data (<a
                  href="https://www.energy.ca.gov/sites/default/files/2021-05/CEC-500-2020-039.pdf"
                  target="_blank">Doherty 2020</a
                >) are presented in this tool. The Monterey NAF station was
                archived by HadISD on 12/31/2020.</em
              >
            </p>
            <p class="source-text">Data Access:</p>
            <ul class="source-list">
              <li class="source-list-item">
                <a
                  href="https://albers.cnr.berkeley.edu/data/hadisd/"
                  target="_blank"
                  >Hourly Observed Historical Data Product (csv)</a
                >
              </li>
              <li class="source-list-item">
                <a
                  href="https://www.metoffice.gov.uk/hadobs/hadisd/"
                  target="_blank"
                  >HadISD Global Sub-Daily Station Dataset (netcdf)</a
                >
              </li>
            </ul>
            <p class="source-text">References:</p>
            <ul class="source-list">
              <li class="source-list-item">
                Explanatory Guide to Hourly Observed Historical Data on
                Cal-Adapt (<a
                  href="https://albers.cnr.berkeley.edu/data/hadisd/user_guide_to_hourly_data.pdf"
                  target="_blank">link</a
                >)
              </li>
              <li class="source-list-item">
                Doherty, Owen and Amato Evan. 2020. Weather and Climate
                Informatics for the Electricity Sector. California Energy
                Commission. Publication Number: CEC-500-2020-039. (<a
                  href="https://www.energy.ca.gov/publications/2020/weather-and-climate-informatics-electricity-sector-subdaily-observations-and"
                  target="_blank">link</a
                >)
              </li>
            </ul>
          </div>
        </div>
        <div class="bx--row source">
          <div class="bx--col-lg-2 bx--col-md-1 bx--col-sm-1">
            <img
              src="/img/logos/US-NationalWeatherService-Logo.svg"
              class="source-logo"
              alt="data provider logo"
            />
          </div>
          <div class="bx--col-lg-12 bx--col-md-7 bx--col-sm-3">
            <div class="h4">Near-Term Weather Forecast</div>
            <div class="h5">National Weather Service, NOAA</div>
            <p class="source-text">
              The National Weather Service (NWS) is an agency of the United
              States federal government that provides weather, water, and
              climate forecasts and warnings for the United States, its
              territories, adjacent waters and ocean areas. The Near-Term
              forecast provided by NWS focuses on large-scale temperature and
              precipitation patterns for the next 7 days.
            </p>
            <p class="source-text">Data Access:</p>
            <ul class="source-list">
              <li class="source-list-item">
                <a
                  href="https://www.weather.gov/documentation/services-web-api"
                  target="_blank">National Weather Service API</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="bx--row source">
          <div class="bx--col-lg-2 bx--col-md-1 bx--col-sm-1">
            <img
              src="/img/logos/NOAA_logo.svg"
              class="source-logo"
              alt="data provider logo"
            />
          </div>
          <div class="bx--col-lg-12 bx--col-md-7 bx--col-sm-3">
            <div class="h4">GHCN-Daily</div>
            <div class="h5">
              National Centers for Environmental Information, NOAA
            </div>
            <p class="source-text">
              The National Centers for Environmental Information (NCEI) is an
              agency of the United States federal government that manages one of
              the world's largest archives of atmospheric data. The Global
              Historical Climatology Network - Daily (GHCN-Daily) dataset
              integrates daily land surface observations from around the world.
              If observed, the station dataset includes max and minimum
              temperatures, total precipitation, snowfall, and depth of snow on
              ground.
            </p>
            <p class="source-text">Data Access:</p>
            <ul class="source-list">
              <li class="source-list-item">
                <a
                  href="https://www.ncei.noaa.gov/metadata/geoportal/rest/metadata/item/gov.noaa.ncdc:C00861/html"
                  target="_blank">GHCN-Daily Dataset Overview</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </About>
  </div>
</div>

<div class="spacing--v-96"></div>

<NotificationDisplay />

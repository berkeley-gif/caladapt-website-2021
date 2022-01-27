<script context="module">
  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  import resourcesList from "content/resources/data";
  import { TOOL_SLUG } from "./_constants";
  export async function preload() {
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

    const { aboutContent, description } = await (
      await this.fetch("tools/extreme-weather.json")
    ).json();

    return { tool, relatedTools, externalResources, description, aboutContent };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { timeParse, timeFormat } from "d3-time-format";
  import { Loading } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";
  import { stores as sapperStores } from "@sapper/app";

  // Helpers
  import { getStationById } from "~/helpers/geocode";
  import { logException } from "~/helpers/logging";
  import { getInitialConfig } from "../_common/helpers";
  import {
    DEFAULT_STATION_ID,
    DEFAULT_CLIMATE_VARIABLE,
    DEFAULT_SELECTED_DAY,
  } from "./_constants";

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

  export let tool;
  export let description;
  export let aboutContent;

  // Derived stores
  const { page } = sapperStores();
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
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp() {
    const { query } = $page;
    const config = {
      station: DEFAULT_STATION_ID,
      climvar: DEFAULT_CLIMATE_VARIABLE,
      doy: timeFormat("%j")(DEFAULT_SELECTED_DAY),
      imperial: true,
    };
    const { station, climvar, imperial, doy } = getInitialConfig(query, config);
    // Set stores
    climvarStore.set(climvar);
    doyStore.set(timeParse("%j")(+doy));
    unitsStore.set({ imperial });
    // Set intial station
    const feature = await getStationById(station, "hadisdstations");
    locationStore.updateLocation(feature);
    return;
  }

  onMount(() => {
    initApp()
      .then(() => {
        appReady = true;
        console.log("app ready");
        update();
      })
      .catch((error) => {
        console.log("init error", error);
        logException(error);
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
        {@html aboutContent}
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

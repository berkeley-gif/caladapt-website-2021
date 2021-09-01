<script context="module">
  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
  import resourcesList from "../../../../content/resources/data";
  export async function preload({ query }) {
    // Get tools metadata
    const toolsList = await this.fetch("tools.json")
      .then((r) => r.json())
      .then((data) => {
        const { tools } = data;
        return tools;
      });

    // Filter metadata for current tool
    const tool = toolsList.find((d) => d.slug === "extreme-weather");
    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));
    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    const glossary = await this.fetch(`help/glossary.json`)
      .then((r) => r.json())
      .then((json) => {
        return json.data;
      });

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
        stationId: 11,
        climvarId: "tasmax",
        imperial: true,
      };
    }

    return { initialConfig, glossary, tool, relatedTools, externalResources };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { timeParse } from "d3-time-format";
  import { Modal } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";

  // Helpers
  import { getStationById } from "~/helpers/geocode";

  // Components
  import ExploreData from "./ExploreData.svelte";
  import {
    Header,
    About,
    Resources,
    ToolNavigation,
  } from "~/components/tools/Partials";
  import { NotificationDisplay, notifier } from "~/components/notifications";

  // Store
  import {
    climvarStore,
    unitsStore,
    locationStore,
    doyStore,
    queryParams,
    hadisdStore,
    extremesStore,
    datasetStore,
    threshCIStore,
  } from "./_store";
  import { getObservedValues, getObservedReturnLevels } from "./_data";

  export let initialConfig;
  export let glossary;
  export let tool;
  export let relatedTools;
  export let externalResources;

  // Derived stores
  const { climvar } = climvarStore;

  // Local props
  let showInfo = false;
  let definitionText;
  let definitionTitle;
  let appReady = false;

  // Temporary prop for Tool Navigation
  // TODO: Remove when Help content has been developed
  // for the tool
  let toolItems = [
    {
      id: "explore",
      label: "Explore Data",
    },
    {
      id: "about",
      label: "About the Tool",
    },
    {
      id: "resources",
      label: "Resources",
    },
  ];

  // Add tool specific content to glossary
  // TODO: Review when Glossary items are updated
  glossary = [
    ...glossary,
    {
      slug: "threshold",
      metadata: {
        title: "",
      },
      html: `
        <div>
          <p>The threshold sets the conditions for which a weather event is considered “extreme“.</p>
          <p>Due to the nature of the extreme value statistics, only threshold values at or above the 90th percentile for Maximum Temperature, and at or below the 10th percentile for Minimum Temperature, are allowed for this input.</p>
        </div>
      `,
    },
    {
      slug: "extreme-event",
      metadata: {
        title: "",
      },
      html: `
        <div>
          <p>According to WMO (<a href="https://ane4bf-datap1.s3-eu-west-1.amazonaws.com/wmocms/s3fs-public/event/related_docs/DraftversionoftheGuidelinesontheDefinitionandMonitoringofExtremeWeatherandClimateEvents.pdf?h2Kr0f7dXp6CXZzoclQYveoEQ9FNoO5r" target="_blank">2016</a>), an extreme can be identified when a single climate variable exceeds its specific threshold, which can be varying percentile-based values, fixed absolute values and return period.</p>
          <p>This tool uses Extreme Value Theory (<a href="https://link.springer.com/book/10.1007%2F978-1-4471-3675-0" target="_blank">Coles, 2001</a>) to evaluate the exceedance probability of rare events that lie far in the tails (upper and lower ranges) of the probability distribution of a weather variable.</p>
          <p>The following descriptive terms are used for labeling extreme events:
          <ul style="padding-left:1.5rem;">
            <li><strong>Extreme</strong>: Exceedance Probability <=1% is </li>
            <li><strong>Rare</strong>: Exceedance Probability >1% and <25% is </li>
            <li><strong>Common</strong>: Exceedance Probability <=25% is</li>
          </ul>
        </div>
      `,
    },
    {
      slug: "probability",
      metadata: {
        title: "",
      },
      html: `
        <div>
          <p>
            The Exceedance probability describes the likelihood of a specific threshold temperature being exceeded in any given year. Annual maxima from 30 years of observed data for the Baseline period are used to calculate the estimated exceedance probability.
          </p>
        </div>
      `,
    },
    {
      slug: "doy",
      metadata: {
        title: "",
      },
      html: `
        <div>
          <p>This can be any day of the year you wish to see data for. Selecting a different year has no effect. Please note that the Near Term forecast & Recent Observations are for today's date only and do not change if you select a different day of year.</p>
        </div>
      `,
    },
    {
      slug: "extremes",
      metadata: {
        title: "",
      },
      html: `
        <div>
          <p>Need text for this toolip</p>
        </div>
      `,
    },
    {
      slug: "chart",
      metadata: {
        title: "",
      },
      html: `
        <div>
          <p>The histogram shows the distribution of selected climate variable around a 20 day window for the Baseline period (1991-2020). The data values for a climate variable are grouped into buckets and represented by columns along the X axis. The Y axis represents the percentage of occurences in the data for each column.</p>
          <p>The NWS Forecast section of the graphic, if selected, shows the Near Term forecast from the National Weather Service for selected climate variable.</p>
          <p>The Recent Observations section of the graphic, if selected, shows Recent Observations from NOAA, for selected climate variable. There is usually a time lag of 2-3 days in the data provided by NOAA, so you may not see data for the last 2-3 days.</p>
          <p>Both the NWS Forecast and Recent Observations are presented with respect to <strong>today's date</strong> and <strong>do not change</strong> if the user selects another Day of Year value.
        </div>
      `,
    },
    {
      slug: "forecast",
      metadata: {
        title: "Near Term Forecast",
      },
      html: `
        <div>
          <p>The data values represent the 9-day weather forecast from the National Weather Serivice for selected date and current year.</p>
        </div>
      `,
    },
    {
      slug: "projections",
      metadata: {
        title: "Return Level Estimates",
      },
      html: `
        <div>
          <p>The lines represent frequency curves that relate estimated values of selected climate variable to return periods (years) for historcal observed data and downscaled GCMs. The shaded areas represent 95% confidence intervals.</p>
          <p>Data is presented for Baseline, Mid-Century and End-Century periods. Click on the legend button to highlight corresponding timeseries.</p>
        </div>
      `,
    },
    {
      slug: "tasmax",
      metadata: {
        title: "Daily Maximum Temperature",
      },
      html: `
        <div>
          <p>The daily maximum temperature is the highest near-surface air temperature for a day. It usually occurs in the afternoon.</p>
        </div>
      `,
    },
    {
      slug: "tasmin",
      metadata: {
        title: "Daily Minimum Temperature",
      },
      html: `
        <div>
          <p>The daily minimum temperature is the lowest near-surface air temperature for a day. It usually occurs in the early morning.</p>
        </div>
      `,
    },
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
  $: datasets = tool.datasets;
  $: resources = [...externalResources, ...relatedTools];
  $: $climvar, $doyStore, $locationStore, $extremesStore, update();

  function updateDataset(e) {
    datasetStore.set(e.detail);
  }

  async function update() {
    if (!appReady) return;
    try {
      hadisdStore.set(null);
      const config = {
        climvarId: $climvarStore,
      };
      const { params } = $queryParams;
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
    }
  }

  function showDefinition(e) {
    const { topics, title } = e.detail;
    const items = glossary.filter((d) => topics.includes(d.slug));
    definitionText = items
      .map((item) => {
        if (title === "What is Exceedance Probability?") {
          return `
          <div>
            <h5>${item.metadata.title}</h5>
            ${item.html}
            <p>The <strong>95% Confidence Intervals</strong> for selected threshold value are <strong>[${$threshCIStore[0].toFixed(
              1
            )}, ${$threshCIStore[1].toFixed(1)}] °F</strong></p>
          </div>
          `;
        }
        return `
        <div>
          <h5>${item.metadata.title}</h5>
          ${item.html}
        </div>
        `;
      })
      .join("<br/>");
    definitionTitle = title;
    showInfo = true;
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

<div class="tool">
  <!-- Header -->
  <div id="header">
    <Header iconPaths="{tool.icons}" title="{`${tool.title} (beta)`}">
      <div slot="description">
        <p class="lead">
          Explore extreme temperatures for past weather and present day. This
          tool provides data from 38 weather stations across California,
          utilizing a quality-controlled dataset for hourly weather observations
          for 1973-2019. This dataset was produced for use by the energy sector
          (<a
            href="https://www.energy.ca.gov/sites/default/files/2021-05/CEC-500-2020-039.pdf"
            target="_blank">Doherty 2020</a
          >). Present day weather conditions are from the National Weather
          Service.
        </p>
        <p>
          <em
            >Note: This tool is still under development. We are working on
            adding Wind Speed to the list of climate variables and soliciting
            feedback from our users. Please email us at support@cal-adapt.org
            with your comments and questions.</em
          >
        </p>
      </div>
    </Header>
  </div>

  <!-- Tool navigation -->
  <ToolNavigation selected="{currentView}" items="{toolItems}" />

  <!-- Explore -->
  <div id="explore" class="section" use:inview="{{}}" on:enter="{handleEntry}">
    {#if appReady}
      <ExploreData on:define="{showDefinition}" />
    {/if}
  </div>

  <div class="bx--grid">
    <!-- About -->
    <div id="about" use:inview="{{}}" on:enter="{handleEntry}">
      <About datasets="{[]}">
        <div slot="description">
          <p>
            Extreme Value Theory (EVT) is a statistical methodology used for
            describing rare events. There are several ways to apply EVT to
            weather variables including fitting a Generalized Extreme Value
            distribution (GEV) over Block Maxima (annual maximum value) and the
            Peaks-Over-Threshold approach where probability distribution of
            exceedances over a pre-defined threshold are modeled using a
            generalized Pareto distribution (GPD). This tool explores extreme
            events in California using a Block Maxima approach.
          </p>
          <p>
            Annual Maximum values from a 20 day window around the day of
            interest are extracted from a 30 year daily timeseries for the
            Baseline period (1991–2020). A GEV distribution is applied to this
            time series. Shape and scale parameters for the distribution are
            estimated using the Maximum Likelihood method. Exceedance
            Probabilities for different threshold values (Return levels) are
            estimated from the fitted model with 95% confidence intervals.
          </p>
          <p>
            <strong>User Admonishment</strong>: The Extreme Weather Tool is
            designed to broadly inform estimated probabilities of extreme
            weather events across a wide range of environments and climate zones
            in California. On a local scale, different statistical assumptions
            (i.e. fitting techniques for distribution parameters, choice of
            extreme value distribution) may be more appropriate. We encourage
            users to ensure the empirical fit of the applied distribution is
            acceptable to their end use before using estimates produced from
            this tool for planning purposes.
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
                greater than 30 years (1973 to present) from the HadISD global
                record. Stations identified for use in this data product were
                chosen based on being considered high quality for temperature.
                Due to observing techniques, instrumentation used, and
                similarities in QA/QC protocols, it’s likely that data for dew
                point and mean sea level pressure will be of similar quality,
                however this has not been assessed fully.
              </p>
              <p>
                <em
                  >Note: Only 38 of the 39 stations from the Hourly Observed
                  Historical Data are presented in this tool. The Monterey NAF
                  station was archived by HadISD on 12/31/2020.</em
                >
              </p>
              <p class="source-text">Data Access:</p>
              <ul class="source-list">
                <li class="source-list-item">
                  <a
                    href="http://albers.cnr.berkeley.edu/data/hadisd/"
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
                    href="http://albers.cnr.berkeley.edu/data/hadisd/user_guide_to_hourly_data.pdf"
                    target="_blank">link</a
                  >)
                </li>
                <li class="source-list-item">
                  Weather and Climate Informatics for the Electricity Sector,
                  Subdaily Observations and the Predictability of Extreme Heat
                  Events (<a
                    href="https://www.energy.ca.gov/publications/2020/weather-and-climate-informatics-electricity-sector-subdaily-observations-and"
                    target="_blank">link</a
                  >)
                </li>
              </ul>
            </div>
          </div>
          <div class="bx--row">
            <div class="bx--col-lg-2 bx--col-md-1 bx--col-sm-1"></div>
            <div class="bx--col-lg-12 bx--col-md-7 bx--col-sm-3">
              <p>
                <em
                  >Note: Only 38 of the 39 stations from the Hourly Observed
                  Historical Data are presented in this tool. The Monterey NAF
                  station was archived by HadISD on 12/31/2020.</em
                >
              </p>
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
              <div class="h4">Near Term Weather Forecast</div>
              <div class="h5">National Weather Service</div>
              <p class="source-text">
                The National Weather Service (NWS) is an agency of the United
                States federal government that provides weather, water, and
                climate forecasts and warnings for the United States, its
                territories, adjacent waters and ocean areas. The Near Term
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
                The Global Historical Climatology Network - Daily (GHCN-Daily)
                dataset integrates daily land surface observations from around
                the world. If observed, the station dataset includes max and
                minimum temperatures, total precipitation, snowfall, and depth
                of snow on ground.
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
</div>

<Modal
  id="definition"
  size="sm"
  passiveModal
  bind:open="{showInfo}"
  modalHeading="{definitionTitle}"
  on:open
  on:close
>
  <div>{@html definitionText}</div>
</Modal>

<NotificationDisplay />

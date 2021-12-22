<script context="module">
  import resourcesList from "../../../../content/resources/data";
  import { INITIAL_CONFIG } from "../_common/constants";
  import {
    TOOL_SLUG,
    DEFAULT_RETURN_PERIOD,
    DEFAULT_DURATION,
    DEFAULT_THRESHOLD_TYPE,
  } from "./_constants";

  // The preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page. It only runs once
  // during export.
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

    // Get help categories
    const help = await this.fetch("help.json")
      .then((r) => r.json())
      .then((json) => {
        return json;
      });
    const helpItems = help.filter((d) =>
      ["get-started", "faqs"].includes(d.slug)
    );

    // Set intitial config for tool
    let initialConfig;

    if (Object.keys(query).length > 0) {
      // TODO: validate bookmark
      const {
        boundary,
        climvar,
        scenario,
        models,
        lat,
        lng,
        duration,
        threshId,
      } = query;
      initialConfig = {
        boundaryId: boundary,
        scenarioId: scenario,
        climvarId: climvar,
        modelIds: models.split(","),
        lat: +lat,
        lng: +lng,
        intervals: DEFAULT_RETURN_PERIOD,
        duration: +duration,
        thresholdId: threshId,
      };
    } else {
      initialConfig = {
        ...INITIAL_CONFIG,
        climvarId: "pr",
        intervals: DEFAULT_RETURN_PERIOD,
        duration: DEFAULT_DURATION,
        thresholdId: DEFAULT_THRESHOLD_TYPE,
      };
    }

    return {
      initialConfig,
      tool,
      relatedTools,
      externalResources,
      helpItems,
    };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { Loading } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";

  // Helpers
  import { getFeature, reverseGeocode } from "~/helpers/geocode";
  import { logException } from "~/helpers/logging";

  // Components
  import ExploreData from "./_ExploreData.svelte";
  import {
    Header,
    About,
    Resources,
    Help,
    ToolNavigation,
  } from "~/components/tools/Partials";
  import { NotificationDisplay, notifier } from "~/components/notifications";

  // Store
  import {
    scenarioStore,
    modelsStore,
    unitsStore,
    locationStore,
    datasetStore,
    isFetchingStore,
  } from "../_common/stores";
  import {
    climvarStore,
    thresholdStore,
    thresholdTypeStore,
    durationStore,
    intervalsStore,
    dataStore,
  } from "./_store";
  import {
    getObserved,
    getModels,
    getIntensityData,
    getQueryParams,
    getThreshold,
  } from "./_data";
  import { DEFAULT_ROLLING_FUNCTION } from "./_constants";

  export let initialConfig;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  // Derived stores
  const { location, boundary } = locationStore;
  const { scenario } = scenarioStore;
  const { intensity, events } = dataStore;

  // Local props
  let appReady = false;

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

  $: potParams = {
    intervals: $intervalsStore, // threshold value is same for all intervals
    duration: $durationStore,
  };

  $: eventParams = {
    thresh: $thresholdStore,
    window: $durationStore,
    rolling: DEFAULT_ROLLING_FUNCTION,
  };

  $: $intervalsStore, updateIntensity();
  $: $thresholdTypeStore, $location, $durationStore, updateThreshold();
  $: $modelsStore, $scenarioStore, $thresholdStore, update();

  async function updateThreshold() {
    if (!appReady) return;
    try {
      isFetchingStore.set(true);
      const { params } = getQueryParams({
        location: $location,
        boundary: $boundary,
        imperial: true,
      });
      const pct = $thresholdTypeStore === "max" ? null : $thresholdTypeStore;
      const thresh = await getThreshold({
        ...params,
        ...potParams,
        ...(pct && { pct }),
      });
      console.log("trehosld", thresh);
      thresholdStore.set(thresh);
    } catch (err) {
      console.log("update threshold error", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function updateIntensity() {
    if (!appReady || !$modelsStore.length) return;
    try {
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
      };
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
      });
      const pct = $thresholdTypeStore === "max" ? null : $thresholdTypeStore;
      isFetchingStore.set(true);
      const intensityData = await getIntensityData(
        config,
        { ...params, ...potParams, ...(pct && { pct }) },
        method
      );
      console.log("intensity");
      dataStore.setIntensity(intensityData);
    } catch (err) {
      console.log("update intensity error", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function update() {
    if (!appReady || !$modelsStore.length) return;
    try {
      await updateIntensity();
      const config = {
        climvarId: $climvarStore,
        scenarioId: $scenarioStore,
        modelIds: $modelsStore,
      };
      const { params, method } = getQueryParams({
        location: $location,
        boundary: $boundary,
      });
      isFetchingStore.set(true);
      const observed = await getObserved(
        config,
        { ...params, ...eventParams },
        method
      );
      const modelsData = await getModels(
        config,
        { ...params, ...eventParams },
        method
      );
      console.log("events");
      dataStore.setEvents([...observed, ...modelsData]);
    } catch (err) {
      console.log("update events error", err);
      logException(err);
      notifier.error("Error", err, 2000);
    } finally {
      isFetchingStore.set(false);
    }
  }

  async function initApp({
    lat,
    lng,
    boundaryId,
    scenarioId,
    modelIds,
    imperial,
    duration,
    intervals,
    thresholdId,
  }) {
    scenarioStore.set(scenarioId);
    modelsStore.set(modelIds);
    unitsStore.set({ imperial });
    durationStore.set(duration);
    intervalsStore.set(intervals);
    thresholdTypeStore.set(thresholdId);
    const addresses = await reverseGeocode(`${lng}, ${lat}`);
    const nearest = addresses.features[0];
    const loc = await getFeature(nearest, boundaryId);
    locationStore.updateLocation(loc);
    locationStore.updateBoundary(boundaryId);
    const { params } = getQueryParams({
      location: loc,
      boundary: { id: boundaryId },
      imperial: true,
    });
    const pct = thresholdId === "max" ? null : thresholdId;
    const thresh = await getThreshold({
      ...params,
      intervals,
      duration,
      ...(pct && { pct }),
    });
    // thresholdListStore.add(thresh98p, "98th Percentile");
    thresholdStore.set(thresh);
  }

  onMount(() => {
    initApp(initialConfig)
      .then(() => {
        appReady = true;
      })
      .catch((error) => {
        console.error("init error", error);
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
  title="{tool.title}"
  description="An extreme weather event is an occurrence that is significantly different from typical weather at a specific location and time of year. Extreme precipitation events can lead to flooding, mudslides and other damaging events. In a changing climate the intensity and frequency of such events will likely change across California. This tool visualizes how climate models predict extreme precipitation events will change over the 21st century. "
/>

<ToolNavigation href="{`/tools/${tool.slug}`}" />

<div id="explore-data" use:inview="{{}}" on:enter="{handleEntry}">
  {#if appReady}
    <ExploreData />
  {:else}
    <Loading />
  {/if}
</div>

<div class="bx--grid">
  <div id="about" use:inview="{{}}" on:enter="{handleEntry}">
    <About
      datasets="{datasets}"
      on:datasetLoaded="{(e) => datasetStore.set(e.detail)}"
    >
      <div slot="description">
        <p>
          With this tool you can explore what an extreme precipitation event
          looks like by providing estimates of intensity and frequency of
          extreme precipitation events. The tools and visualizations allow you
          to examine how extreme precipitation events are likely to change in a
          warming climate over locations of interest to you.
        </p>
        <p>
          By default, Cal-Adapt calculates extreme values of precipitation over
          a 2-day period, and defines an extreme event as the lowest value from
          Annual Maximum values in the historical period (1961–1990). Users can
          override these defaults by selecting a new “event duration” (number of
          days over which precipitation accumulates), or by selecting a
          different “threshold“ value that corresponds to either the 90th, 95th
          or 99th percentiles. The tool then displays the extreme events that
          exceed the threshold in different ways. The Frequency chart shows the
          estimated intensity of precipitation events (Return Level) for a
          selected period (Return Period) and how it changes over the historical
          period (1961–1990), mid-century (2035–2064) and end-century
          (2071–2099). The other charts display the total number of events, the
          timing of these events and the longest stretch of consecutive extreme
          events.
        </p>
        <p class="h4">What is a Threshold value?</p>
        <p>
          The extreme threshold sets the conditions for which a precipitation
          event is considered “extreme“. By default, the threshold is set to the
          lowest annual maximum precipitation accumulation in the historical
          record (1961 to 1990). Other alternative threshold values (90th, 95th
          and 99th percentiles) are based on commonly used quantiles over the
          historical record. Selecting too high a threshold (in arid locations)
          or too low a threshold can decrease the reliability of the estimates.
        </p>

        <p class="h4">What is an Event Duration?</p>
        <p>
          Event duration is the number of days over which precipitation falls
          that contribute to a single event. Changing this value will change the
          extreme threshold.
        </p>

        <p class="h4">What is a Return Period?</p>
        <p>
          The return period estimates the average time between extreme events.
          This is sometimes worded as a “1 in x years” event.
        </p>

        <p class="h4">What is a Return Level?</p>
        <p>
          The return level is the estimated amount of precipitation that would
          be expected to be exceeded once every return period. Effectively it is
          the inverse of the return period. Instead of wondering how often an
          extreme precipitation event will occur, we are instead considering
          once in any given time period what would extreme precipitation event
          look like? The return level is similar to the accumulated
          precipitation threshold, but is estimated from the underlying
          statistical distribution of modeled precipitation data in future
          climate scenarios. By contrast, accumulated precipitation threshold
          are calculated from historical observed values.
        </p>

        <p class="h4">Technical Approach</p>
        <p>
          Extreme Value Theory (EVT) is a statistical methodology used for
          describing rare events. There are several ways to apply EVT to
          precipitation data inlcuding fitting a Generalized Extreme Value
          distribution (GEV) over block maxima (annual maximum value) and the
          Peaks-Over-Threshold (POT) approach where probability distribution of
          exceedances over a pre-defined threshold are modeled using a
          generalized Pareto distribution (GPD). This tool explores extreme
          events in California using a POT approach.
        </p>
        <p>
          Data values that exceed a high predefiend threshold, by default the
          lowest value from Annual Maximum values in the historical period
          (1961–1990), are extracted from a 30 year daily time series. If there
          are any back-to-back events only the largest such event is included. A
          generalized Pareto distribution is applied to this partial duration
          time series. Shape and scale parameters for the distribution are
          estimated using the Maximum Likelihood method. Return levels for
          selected Return Periods are estimated from the fitted model.
          Confidence intervals at the 95% level for each return level are
          estimated using the Profile Likelihood method, where sufficient (n >
          100) events exist.
        </p>

        <p>
          <strong>User Advisory</strong>: The Extreme Precipitation Tool is
          designed to broadly inform potential changes in extreme precipitation
          intensity and frequency across a wide range of environments and
          climate zones in California. On a local scale different statistical
          assumptions (i.e. using annual maximal values rather than partial
          duration time-series, fitting techniques for distribution parameters
          and choice of extreme value distribution) may be more appropriate. We
          encourage users to ensure the empirical fit of the applied
          distribution is acceptable to their end use before using estimates
          produced from this tool for planning purposes.
        </p>

        <p class="h3">References</p>
        <ul style="padding-left: 1rem;">
          <li>
            <a
              target="_blank"
              href="https://www.elsevier.com/books/statistical-methods-in-the-atmospheric-sciences/wilks/978-0-12-385022-5"
              >Wilks, D. (2011).</a
            > Statistical methods in the atmospheric sciences (3rd ed.). Oxford ;
            Waltham, MA: Academic Press.
          </li>
          <li>
            <a
              target="_blank"
              href="https://ral.ucar.edu/staff/ericg/Intro2EVT.pdf"
              >Gilleland, E. (2015).</a
            > Introduction to Extreme Value Theorem Analysis. National Center for
            Atmospheric Research.
          </li>
          <li>
            <a
              target="_blank"
              href="https://link.springer.com/book/10.1007%2F978-1-4471-3675-0"
              >Coles, S. (2001).</a
            > An introduction to statistical modeling of extreme values. London:
            Springer-Verlag. ISBN: 1-85233-459-2.
          </li>
        </ul>
      </div>
    </About>
  </div>

  <div id="resources" use:inview="{{}}" on:enter="{handleEntry}">
    <Resources resources="{resources}" />
  </div>

  <div id="help" use:inview="{{}}" on:enter="{handleEntry}">
    <Help items="{helpItems}" />
  </div>
</div>

<div class="spacing--v-96"></div>

<NotificationDisplay />

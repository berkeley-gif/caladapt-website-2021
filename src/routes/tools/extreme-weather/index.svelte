<script context="module">
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
    const tool = toolsList.find((d) => d.slug === "extreme-weather");
    const related = toolsList.filter((d) => tool.related.includes(d.slug));

    const glossary = await this.fetch(`help/glossary.json`)
      .then((r) => r.json())
      .then((json) => {
        return json.data;
      });

    // Set intitial config for tool
    let initialConfig;
    if (Object.keys(query).length > 0) {
      // TODO: validate bookmark
      let imperial;
      if (query.imperial && query.imperial === "false") {
        imperial = false;
      } else {
        imperial = true;
      }
      initialConfig = { ...query, imperial };
    } else {
      initialConfig = {
        stationId: 11,
        climvarId: "tasmax",
        imperial: true,
      };
    }

    return { initialConfig, glossary, tool, related };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { timeParse } from "d3-time-format";
  import { Modal } from "carbon-components-svelte";
  import { inview } from "svelte-inview/dist/";

  // Helpers
  import { getStation } from "../../../helpers/geocode";

  // Components
  import Header from "./Header.svelte";
  import ExploreData from "./ExploreData.svelte";
  import About from "./About.svelte";
  import Resources from "./Resources.svelte";
  import Help from "./Help.svelte";
  import { NotificationDisplay } from "../../../components/notifications";

  // Store
  import {
    climvarStore,
    unitsStore,
    locationStore,
    dataStore,
    doyStore,
    queryParams,
    observationsStore,
    forecastStore,
    extremesStore,
  } from "./_store";
  import { getObservedValues, getObservedReturnLevels } from "./_data";

  export let initialConfig;
  export let glossary;
  export let tool;
  export let related;

  // Derived stores
  const { climvar } = climvarStore;

  // Local props
  let showInfo = false;
  let definitionText;
  let definitionTitle;
  let appReady = false;

  // Add tool specific content to glossary
  glossary = [
    ...glossary,
    {
      slug: "threshold",
      metadata: {
        title: "Threshold",
      },
      html: `
        <div>
          <p>Due to the nature of the extreme value statistics, only threshold values at or above the 90th percentile for Maximum Temperature, and at or above the 10th percentile for Minimum Temperature, are allowed for this input.</p>
        </div>
      `,
    },
    {
      slug: "return-period",
      metadata: {
        title: "Return Period",
      },
      html: `
        <div>
          <p>The probability that an extreme weather event occurs is often expressed as a Return Period. A return period is the inverse of probability (generally expressed in %); it gives the estimated time interval between events of a similar size or intensity.</p>
          <p>For example, the estimated return period of an event might be 1 in 10 years. This does not mean the event will occur every 10 years, it indicates probability of ocurrence being 10/100, or 10% in any one year.</p>
          <p>For this tool, 30 years of data for the Baseline, Mid-Century and End-Century periods are used to calculate return periods. Due to the relatively short time frame, values extrapolated far into the tail should be understood to have more uncertainty than those calculated for earlier return periods.</p>
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
          <p>This can be any day of the year you wish to see data for. Selecting a different year has no effect. Please note that the 7-day forecast if for today's date only and does not change if you select a different day of year.</p>
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
          <p>This can be any day of the year you wish to see data for. Selecting a different year has no effect. Please note that the 7-day forecast if for today's date only and does not change if you select a different day of year.</p>
        </div>
      `,
    },
    {
      slug: "observations",
      metadata: {
        title: "Frequency of Observations",
      },
      html: `
        <div>
          <p>This histogram indicates the frequency distribution of selected climate varibale and shows how often each different value occurs.</p>
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
  ];

  // Monitor sections as they enter & leave viewport
  let inviewEl = "explore";
  const handleEntry = (e) => {
    const { entry } = e.detail;
    inviewEl = entry.target.id;
  };
  const entryOptions = {
    threshold: 0.5,
  };

  // Reactive props
  $: datasets = tool.datasets;
  $: resources = [...tool.resources, ...related];
  $: $climvar, $doyStore, $locationStore, $extremesStore, update();
  $: $locationStore, forecastStore.reset();

  async function update() {
    if (!appReady) return;
    try {
      dataStore.set(null);
      const config = {
        climvarId: $climvarStore,
      };
      const { params } = $queryParams;
      const observedValues = await getObservedValues(config, {
        g: params.g,
        imperial: params.imperial,
      });
      const observedReturnLevels = await getObservedReturnLevels(
        config,
        params
      );
      observationsStore.set({
        values: observedValues,
        returnLevels: observedReturnLevels[0],
      });
    } catch (err) {
      // TODO: notify user of error
      console.log("updateData", err);
    }
  }

  function showDefinition(e) {
    const { topics, title } = e.detail;
    const items = glossary.filter((d) => topics.includes(d.slug));
    definitionText = items
      .map((item) => {
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
    const station = await getStation(stationId, "hadisdstations");
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
      });
    window.scrollTo(0, 0);
  });
</script>

<svelte:head>
  <title>Extreme Weather</title>
  <link
    href="https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css"
    rel="stylesheet"
  />
</svelte:head>

<div class="tool">
  <!-- Header -->
  <Header currentView="{inviewEl}" />

  <!-- Explore -->
  <div id="explore" class="section">
    <ExploreData on:define="{showDefinition}" />
  </div>

  <div class="bx--grid">
    <!-- Help -->
    <div
      id="help"
      class="section"
      use:inview="{entryOptions}"
      on:enter="{handleEntry}"
    >
      <Help />
    </div>

    <!-- About -->
    <div
      id="about"
      class="section"
      use:inview="{entryOptions}"
      on:enter="{handleEntry}"
    >
      <About datasets="{datasets}" />
    </div>

    <!-- Resources -->
    <div
      id="resources"
      class="section"
      use:inview="{entryOptions}"
      on:enter="{handleEntry}"
    >
      <Resources resources="{resources}" />
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

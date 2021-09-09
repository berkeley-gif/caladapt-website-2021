<script context="module">
  import resourcesList from "content/resources/data";

  export async function preload({ query }) {
    const toolsList = (await (await this.fetch("tools.json")).json()).tools;
    const tool = toolsList.find((d) => d.slug === "degree-days");

    const relatedTools = toolsList
      .filter((d) => tool.related.includes(d.slug))
      .map((d) => ({ ...d, category: "caladapt" }));

    const externalResources = resourcesList
      .filter((d) => tool.resources.includes(d.title))
      .map((d) => ({ ...d, category: "external" }));

    const glossary = (await (await this.fetch("help/glossary.json")).json())
      .data;

    const help = await (await this.fetch("help.json")).json();
    const helpItems = help.filter((d) =>
      ["get-started", "faqs"].includes(d.slug)
    );

    let initialConfig = {};

    if (Object.keys(query).length) {
      const { boundary, climvar, scenario, models, imperial, lat, lng } = query;
      initialConfig = {
        boundaryId: boundary,
        scenarioId: scenario,
        climvarId: climvar,
        modelIds: models,
        imperial: imperial === "true" ? true : false,
        lat: +lat,
        lng: +lng,
      };
    } else {
      initialConfig = {
        boundaryId: "locagrid",
        scenarioId: "rcp45",
        climvarId: "tasmax",
        modelIds: "HadGEM2-ES,CNRM-CM5",
        imperial: true,
        lat: 38.58,
        lng: -121.46,
      };
    }

    return {
      initialConfig,
      glossary,
      tool,
      relatedTools,
      externalResources,
      helpItems,
    };
  }
</script>

<script>
  export let initialConfig;
  export let glossary;
  export let tool;
  export let relatedTools;
  export let externalResources;
  export let helpItems;

  $: {
    console.log(initialConfig);
    console.log(glossary);
    console.log(tool);
    console.log(relatedTools);
    console.log(externalResources);
    console.log(helpItems);
  }
</script>

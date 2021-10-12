import config from "~/helpers/api-config";
import models from "../../../helpers/climate-models";
import scenarios from "../../../helpers/climate-scenarios";
import boundaries from "../../../helpers/mapbox-layers";
import climvars from "../../../helpers/climate-variables";
import { tools } from "../../../../content/tools/data";

const { apiEndpoint } = config.env.production;

export const climvarList = climvars
  .filter((d) => ["swe"].includes(d.id))
  .map((d) => {
    const title = `Snow Water Equivalent`;
    return { ...d, title };
  });

// List of series used in tool with additional props for
// symbolyzing these lines
const series = [
  {
    key: "observed",
    label: "Observed",
    color: "rgba(110, 110, 110, 1)",
    mark: "line",
  },
];

models.forEach((d) => {
  let label;
  if (d.text) {
    label = `${d.id} (${d.text})`;
  } else {
    label = d.id;
  }
  series.push({
    key: d.id,
    label,
    color: d.color,
    mark: "line",
  });
});

export const seriesList = series;

export const boundaryList = boundaries
  .filter((d) => d.metadata.group === "Boundaries")
  .map((d) => {
    let text;
    if (d.id === "locagrid") {
      text = "None";
    } else {
      text = d.metadata.title;
    }
    return { ...d, text };
  });

export const modelList = models.map((d) => {
  let text;
  if (d.text) {
    text = `${d.id} (${d.text})`;
  } else {
    text = d.id;
  }
  return {
    ...d,
    text,
  };
});

export const scenarioList = scenarios.filter((d) =>
  ["rcp45", "rcp85"].includes(d.id)
);

const toolsList = ["Extreme Precipitation", "Streamflow", "Annual Averages"];
const caladaptTools = tools.filter((tool) => {
  if (toolsList.includes(tool.title)) {
    tool.category = "caladapt";
    return true;
  }
});

export const resources = [
  ...caladaptTools,
  {
    title: "Get started with Cal-Adapt",
    category: "help",
    link: "/help/get-started/",
    icon: "get-started",
  },
  {
    title: "Tutorials & Webinars",
    category: "help",
    link: "/help/tutorials/",
    icon: "tutorials",
  },
  {
    title: "Frequently Asked Questions",
    category: "help",
    link: "/help/faqs/",
    icon: "faqs",
  },
  {
    title: "California's Adaptation Clearinghouse",
    link: "https://resilientca.org",
    category: "other",
    image: "logos/EJ_JRC_ccc_simulation-7094.jpg",
    desc: `The Adaptation Clearinghouse is the State of California’s consolidated searchable 
    database of resources for local, regional and statewide climate adaptation planning 
    and decision-making.`,
  },
  {
    title: "Regional Reports: California's 4th Climate Change Assessment",
    link: "https://www.climateassessment.ca.gov/regions/",
    category: "other",
    image: "logos/ccc4a.jpg",
    desc: `California’s Fourth Climate Change Assessment provides information to 
    build resilience to climate impacts, including temperature, wildfire, water, 
    sea level rise, and governance. The assessment includes reports for nine regions 
    of the state to support action at local and regional scales.`,
  },
];

export const getMapImages = ({
  climvarId,
  modelId,
  years,
  duration,
  scenarioId,
  monthNumber,
}) =>
  years.map((year) => {
    const start = parseInt(year);
    const end = start + duration;
    const useScenario = year < 2010 ? "livneh" : `${modelId}_${scenarioId}`;
    return {
      id: start,
      text: `${start}-${end}`,
      src: `${apiEndpoint}/series/${climvarId}_month_${useScenario}/${start}-${end}/${monthNumber}.png?style=swe&scale=10`,
    };
  });

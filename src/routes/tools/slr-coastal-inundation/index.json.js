import { getToolContent } from "../_common/server-utils";

export function get(_req, res) {
  // names of files that reside in content/tools/slr-coastal-inundation
  const contentItems = [
    "about",
    "learn-more-flood-scenario",
    "learn-more-map-layers",
    "learn-more-time-period",
    "map-explainer",
  ];

  try {
    const [aboutContent, floodScenario, mapLayers, timePeriod, mapExplainer] =
      contentItems.map((item) =>
        getToolContent("slr-coastal-inundation", item)
      );

    const description = require("content/tools/slr-coastal-inundation/description.json");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        aboutContent,
        description,
        learnMoreContent: {
          floodScenario,
          mapLayers,
          timePeriod,
        },
        mapExplainer,
      })
    );
  } catch (error) {
    console.error(error);
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        message: `Not found`,
      })
    );
  }
}

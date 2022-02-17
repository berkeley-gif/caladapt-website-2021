import { getToolContent } from "../_common/server-utils";

export function get(_req, res) {
  try {
    const aboutContent = getToolContent("slr-coastal-inundation", "about");
    const floodScenario = getToolContent(
      "slr-coastal-inundation",
      "learn-more-flood-scenario"
    );
    const mapLayers = getToolContent(
      "slr-coastal-inundation",
      "learn-more-map-layers"
    );
    const timePeriod = getToolContent(
      "slr-coastal-inundation",
      "learn-more-time-period"
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        aboutContent,
        learnMoreContent: {
          floodScenario,
          mapLayers,
          timePeriod,
        },
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

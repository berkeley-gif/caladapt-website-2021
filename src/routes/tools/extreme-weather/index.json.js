import { getToolContent } from "../_common/server-utils";

export function get(_req, res) {
  try {
    const {
      description,
    } = require("/content/tools/extreme-weather/description");
    const aboutContent = getToolContent("extreme-weather", "about");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ aboutContent, description }));
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

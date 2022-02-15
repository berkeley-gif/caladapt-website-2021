import { getToolContent } from "../_common/server-utils";

export function get(_req, res) {
  try {
    const aboutContent = getToolContent("extreme-precipitation", "about");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ aboutContent }));
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

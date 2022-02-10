import { getToolContent } from "../_common/server-utils";
import { CLIMATE_CATEGORIES } from "content/tools/local-climate-change-snapshot/categories";
import { CLIMATE_INDICATORS } from "content/tools/local-climate-change-snapshot/indicators";

export function get(_req, res) {
  try {
    const toolIntro = getToolContent(
      "local-climate-change-snapshot",
      "tool-intro"
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        toolIntro,
        categories: CLIMATE_CATEGORIES,
        indicators: CLIMATE_INDICATORS,
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

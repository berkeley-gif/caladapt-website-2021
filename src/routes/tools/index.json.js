import { tools, categories } from "../../../content/tools/data";

let json;

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  if (!json || process.env.NODE_ENV !== "production") {
    json = JSON.stringify({
      // Temporarily hide the SLR CIS tool behind a feature flag until it's
      // approved for production
      tools: process.cal_adapt_features.slrCoastalInundation
        ? tools
        : tools.filter((d) => d.slug === "slr-coastal-inundation"),
      categories,
    });
  }

  res.end(json);
}

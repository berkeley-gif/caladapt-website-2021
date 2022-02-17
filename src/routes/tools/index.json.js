import { tools, categories } from "../../../content/tools/data";

let json;

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  if (!json || process.env.NODE_ENV !== "production") {
    json = JSON.stringify({
      // Potentially hides the SLR CIS tool behind a feature flag.
      // This will prevent Sapper from building this page route when deploying
      // to prod, but not for dev or beta.
      tools: process.cal_adapt_features.slrCoastalInundation
        ? tools
        : tools.filter((d) => d.slug === "slr-coastal-inundation"),
      categories,
    });
  }

  res.end(json);
}
